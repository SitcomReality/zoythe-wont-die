import { LOOP_PHASES, CHOICE_CLASSIFICATIONS } from "../../../config/constants.js";
import { generateBeatContent } from "../../engine/llm-service.js";
import callToAdventurePrompt from "../../../prompts/hero/callToAdventure.js";
import { getCluesByMethod, getImmediateClues } from "../../../systems/clue-generator.js";

const INVESTIGATION_METHODS = {
  IMMEDIATE: "immediate",
  BODY_EXAMINATION: "bodyExamination",
  SURROUNDINGS: "surroundings",
  MEMORY_RECALL: "memoryRecall"
};

export function registerCallToAdventureBeat({ beatOrchestrator, eventBus }) {
  const id = "heroJourney:intro:callToAdventure";

  const beat = {
    id,
    async enter({ gameState, terminology, beatRepeatCount, previousPage, previousChoice }) {
      const mystery = gameState.mystery;
      const weapon = mystery ? mystery.weapon.name : "an unknown weapon";
      const deathScenario = gameState.world.deathScenario || (mystery ? mystery.deathScenario : null);

      // Initialize discovery tracking if needed
      if (!gameState.narrative.flags["discoveredCluesInCTA"]) {
        gameState.narrative.flags["discoveredCluesInCTA"] = new Set();
      }

      const discoveredInThisBeat = gameState.narrative.flags["discoveredCluesInCTA"];
      const isRepeat = beatRepeatCount > 0;

      // Determine what text to show based on investigation history
      let beatInstructions = "";
      let additionalContext = "";

      if (!isRepeat) {
        // First visit: basic scene description
        beatInstructions = callToAdventurePrompt.replace("${weapon}", weapon);
        additionalContext = "This is the protagonist's first moment of awareness. Present the immediate scene.";
      } else {
        // Repeat visit: player is investigating further
        additionalContext = `This is investigation attempt ${beatRepeatCount}. The environment remains but player seeks deeper understanding.`;
        
        // Add information about what player found on previous investigation
        if (discoveredInThisBeat.size > 0) {
          const foundClues = Array.from(discoveredInThisBeat)
            .map(clueId => mystery.clues.all.get(clueId))
            .filter(c => c)
            .map(c => `- ${c.label}: ${c.description}`)
            .join("\n");
          
          additionalContext += `\n\nAlready discovered:\n${foundClues}`;
        }

        // Build investigation prompt
        beatInstructions = `
The protagonist stands over their own body again. They're investigating further.
The scene: ${deathScenario?.methodDescription || "Your death remains a mystery."}
Location: ${deathScenario?.location || "an unknown place"}

Provide investigation-focused choices:
- "Examine the body closely" to discover physical evidence
- "Look around the surroundings" to find contextual clues
- "Search your fading memories" to recall last moments
- "Move on" to accept what you've learned and advance

Each choice should potentially reveal new details. Reference what was already found.
${additionalContext}
`;
      }

      const content = await generateBeatContent({
        gameState,
        instructions: beatInstructions + additionalContext,
        beatId: id,
        previousPage,
        previousChoice
      });

      // Enhance choices to include investigation metadata
      const choices = (content.choices || []).map(c => {
        const choiceId = `${id}:${c.id}`;
        const lowerLabel = c.label.toLowerCase();

        // Classify investigation type
        let investigationType = null;
        if (lowerLabel.includes("body") || lowerLabel.includes("examine") || lowerLabel.includes("corpse")) {
          investigationType = INVESTIGATION_METHODS.BODY_EXAMINATION;
        } else if (lowerLabel.includes("surroundings") || lowerLabel.includes("around") || lowerLabel.includes("environment")) {
          investigationType = INVESTIGATION_METHODS.SURROUNDINGS;
        } else if (lowerLabel.includes("memor") || lowerLabel.includes("recall") || lowerLabel.includes("remember")) {
          investigationType = INVESTIGATION_METHODS.MEMORY_RECALL;
        } else if (lowerLabel.includes("move") || lowerLabel.includes("forward") || lowerLabel.includes("accept")) {
          investigationType = "advance";
        }

        return {
          ...c,
          id: choiceId,
          investigationType, // Track investigation type for beat logic
          classification: c.classification || [CHOICE_CLASSIFICATIONS.INVESTIGATE]
        };
      });

      return {
        phase: LOOP_PHASES.INTRO,
        text: { title: content.title, body: content.body },
        shouldAdvance: content.shouldAdvance,
        choices,
        beatRepeatCount
      };
    },

    applyChoice(choice, { gameState }) {
      const mystery = gameState.mystery;
      const investigationType = choice.investigationType;

      // Track if this was an investigation choice
      if (!gameState.narrative.flags["discoveredCluesInCTA"]) {
        gameState.narrative.flags["discoveredCluesInCTA"] = new Set();
      }
      const discovered = gameState.narrative.flags["discoveredCluesInCTA"];
      const investigationUsed = gameState.narrative.flags["investigationMethodsUsed"] || new Set();

      // If player chose to investigate, reveal clues
      if (investigationType && investigationType !== "advance") {
        investigationUsed.add(investigationType);
        gameState.narrative.flags["investigationMethodsUsed"] = investigationUsed;

        // Get clues for this investigation type
        const availableClues = Array.from(mystery.clues.all.values()).filter(clue => 
          clue.discoveryMethod === investigationType && !discovered.has(clue.id)
        );

        // Reveal 0-2 clues based on randomness
        if (availableClues.length > 0) {
          const clueCount = Math.random() > 0.5 ? 1 : 2;
          for (let i = 0; i < Math.min(clueCount, availableClues.length); i++) {
            const clue = availableClues[i];
            discovered.add(clue.id);
            mystery.clues.discovered.add(clue.id);
          }
        }

        // Return null to stay in this beat (will increment beat repeat count)
        return null;
      }

      // If player chose to advance, move to next beat
      return "heroJourney:intro:meetingMentor";
    }
  };

  beatOrchestrator.registerBeat(id, beat);
}