import { LOOP_PHASES, CHOICE_CLASSIFICATIONS } from "../../../config/constants.js";
import { generateBeatContent } from "../../engine/llm-service.js";
import callToAdventurePrompt from "../../../prompts/hero/callToAdventure.js";

export function registerCallToAdventureBeat({ beatOrchestrator, eventBus, gameState }) {
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
      const investigationDepth = beatRepeatCount;
      const maxIterations = 3; // After 3 investigations, encourage moving on

      let beatInstructions = "";
      let additionalContext = "";

      if (!isRepeat) {
        beatInstructions = callToAdventurePrompt({ weapon, terminology });
        additionalContext = "This is the protagonist's first moment of awareness. Present the immediate scene and the body.";
      } else {
        additionalContext = `This is investigation attempt ${beatRepeatCount} of the body and scene. The player is seeking deeper understanding.`;

        if (discoveredInThisBeat.size > 0) {
          const foundClues = Array.from(discoveredInThisBeat)
            .map(clueId => mystery.clues.all.get(clueId))
            .filter(c => c)
            .map(c => `- ${c.label}: ${c.description}`)
            .join("\n");

          additionalContext += `\n\nAlready discovered:\n${foundClues}`;
        }

        // After 2+ investigations, encourage moving on but don't force it
        if (investigationDepth >= 2) {
          additionalContext += `\n\nNarrative Guidance: The player has examined the scene thoroughly (${beatRepeatCount} times). Include an explicit "Move on" or "Accept what you've learned" choice to signal that advancement to the next beat is available and encouraged.`;
        }

        beatInstructions = `\nThe protagonist stands over their own body again, investigating further.\nThe scene: ${deathScenario?.methodDescription || "Your death remains a mystery."}\nLocation: ${deathScenario?.location || "an unknown place"}\n\nProvide investigation-focused choices:\n- "Examine the body more closely" to discover physical evidence\n- "Look around the surroundings" to find contextual clues  \n- "Search your fading memories" to recall last moments\n- "Accept what you've learned and move on" to advance to the next beat\n\nEach investigation reveals new details. Even without finding clues, the scene should feel richer and more detailed on repeat visits.\n${additionalContext}`;
      }

      const content = await generateBeatContent({
        gameState,
        instructions: beatInstructions,
        beatId: id,
        previousPage,
        previousChoice
      });

      // Enhance choices to track investigation vs advancement intent
      const choices = (content.choices || []).map(c => {
        const choiceId = `${id}:${c.id}`;
        const lowerLabel = c.label.toLowerCase();

        // Classify investigation type
        let investigationType = null;
        if (lowerLabel.includes("body") || lowerLabel.includes("examine") || lowerLabel.includes("corpse")) {
          investigationType = "bodyExamination";
        } else if (lowerLabel.includes("surroundings") || lowerLabel.includes("around") || lowerLabel.includes("environment")) {
          investigationType = "surroundings";
        } else if (lowerLabel.includes("memor") || lowerLabel.includes("recall") || lowerLabel.includes("remember")) {
          investigationType = "memoryRecall";
        } else if (lowerLabel.includes("move") || lowerLabel.includes("forward") || lowerLabel.includes("accept")) {
          investigationType = "advance";
        }

        return {
          ...c,
          id: choiceId,
          investigationType,
          classification: c.classification || [CHOICE_CLASSIFICATIONS.INVESTIGATE]
        };
      });

      return {
        phase: LOOP_PHASES.INTRO,
        text: { title: content.title, body: content.body },
        shouldAdvance: false, // Don't auto-advance; player controls pacing
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

      // If player chose to investigate, reveal clues/details
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