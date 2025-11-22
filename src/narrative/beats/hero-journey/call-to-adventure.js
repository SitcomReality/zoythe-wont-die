import { LOOP_PHASES, CHOICE_CLASSIFICATIONS } from "../../../config/constants.js";
import { generateBeatContent } from "../../engine/llm-service.js";
import { getCluesByMethod, getImmediateClues } from "../../../systems/clue-generator.js";

const INVESTIGATION_METHODS = {
  IMMEDIATE: "immediate",
  BODY_EXAMINATION: "bodyExamination",
  SURROUNDINGS: "surroundings",
  MEMORY_RECALL: "memoryRecall"
};

export function registerCallToAdventureBeat({ beatOrchestrator, eventBus, gameState }) {
  const id = "heroJourney:intro:callToAdventure";

  const beat = {
    id,
    async enter({ gameState, terminology, beatRepeatCount, previousPage, previousChoice }) {
      const mystery = gameState.mystery;
      const weapon = mystery ? mystery.weapon : null;
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
        // LOGIC-DRIVEN PROMPT CONSTRUCTION (Phase 3)
        const weaponName = weapon ? weapon.name : "Unknown Weapon";
        
        let weaponDescription = "";
        if (weapon && weapon.discoverable && !deathScenario?.weaponVisible) {
           weaponDescription = `The weapon is missing. The method of death is clear (${deathScenario?.methodDescription}), but the instrument is gone.`;
        } else if (weapon) {
           weaponDescription = `The weapon, ${weaponName}, is present at the scene. ${weapon.description || ""}`;
        } else {
           weaponDescription = "The cause of death is not immediately obvious.";
        }

        beatInstructions = `
This is the Discovery of the Corpse.
The protagonist stands over their own mortal remains.
Scene: ${deathScenario?.methodDescription || "A broken body."}
Weapon Status: ${weaponDescription}
Environment: ${deathScenario?.location || "A void-touched ruin"}.
The reality is ${terminology.glitch}ing.
The Call: You have been murdered. The system of death is broken. You must solve it.
Provide choices to investigate the body, the surroundings, or your memories.
`;
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
        
        // Robust detection of investigation intent to prevent accidental skipping
        const isInvestigation = 
          lowerLabel.includes("body") || 
          lowerLabel.includes("examine") || 
          lowerLabel.includes("corpse") ||
          lowerLabel.includes("surroundings") || 
          lowerLabel.includes("around") || 
          lowerLabel.includes("environment") ||
          lowerLabel.includes("memor") || 
          lowerLabel.includes("recall") || 
          lowerLabel.includes("remember") ||
          lowerLabel.includes("investigate") ||
          lowerLabel.includes("look") ||
          lowerLabel.includes("check") ||
          lowerLabel.includes("search") ||
          lowerLabel.includes("analyze") ||
          lowerLabel.includes("inspect") ||
          lowerLabel.includes("weapon");

        // Explicit advance keywords
        const isAdvance = 
          lowerLabel.includes("move on") || 
          lowerLabel.includes("leave") || 
          lowerLabel.includes("accept fate");

        if (isAdvance) {
          investigationType = "advance";
        } else if (lowerLabel.includes("body") || lowerLabel.includes("corpse")) {
          investigationType = INVESTIGATION_METHODS.BODY_EXAMINATION;
        } else if (lowerLabel.includes("surroundings") || lowerLabel.includes("environment")) {
          investigationType = INVESTIGATION_METHODS.SURROUNDINGS;
        } else if (lowerLabel.includes("memor") || lowerLabel.includes("recall")) {
          investigationType = INVESTIGATION_METHODS.MEMORY_RECALL;
        } else if (isInvestigation) {
          // Fallback for generic investigation actions that didn't match specific buckets
          // We map them to SURROUNDINGS or BODY based on context, or just 'surroundings' as safe default
          // This ensures they don't return null investigationType and accidentally advance
          investigationType = INVESTIGATION_METHODS.SURROUNDINGS; 
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

      // If investigationType is "advance", we move on.
      // If investigationType is null, it usually means it didn't match anything.
      // However, in this specific beat, "null" usually meant "fall through to return meetingMentor".
      // We want to invert that: Default to STAY unless explicitly advancing.
      
      const isAdvance = investigationType === "advance";

      // If player chose to investigate (any valid type NOT advance), reveal clues and stay
      if (!isAdvance && investigationType) {
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
      
      // Safety check: If we somehow got a null investigationType (e.g. "Scream into the void"),
      // we should probably stay in the beat rather than defaulting to advancing, unless repeat count is high.
      if (!isAdvance && gameState.narrative.beatRepeatCount < 3) {
         return null;
      }

      // If player chose to advance, move to next beat
      return "heroJourney:intro:meetingMentor";
    }
  };

  beatOrchestrator.registerBeat(id, beat);
}