import { LOOP_PHASES } from "../../../config/constants.js";
import { generateBeatContent } from "../../engine/llm-service.js";
import prologuePrompt from "../../../prompts/hero/prologue.js";

export function registerPrologueBeat({ beatOrchestrator, gameState }) {
  const id = "heroJourney:intro:prologue";

  const beat = {
    id,
    async enter({ gameState, terminology }) {
      const instructions = prologuePrompt;

      const content = await generateBeatContent({
        gameState,
        instructions,
        beatId: id
      });

      // Ensure exactly one continue choice
      const choices = content.choices && content.choices.length > 0
        ? [{ 
            id: `${id}:continue`,
            label: content.choices[0].label || "Open your eyes.",
            hint: null,
            classification: [],
            effects: {}
          }]
        : [{
            id: `${id}:continue`,
            label: "Open your eyes.",
            hint: null,
            classification: [],
            effects: {}
          }];

      return {
        phase: LOOP_PHASES.INTRO,
        text: { title: content.title, body: content.body },
        choices
      };
    },

    applyChoice(choice, { gameState }) {
      return "heroJourney:intro:callToAdventure";
    }
  };

  beatOrchestrator.registerBeat(id, beat);
}