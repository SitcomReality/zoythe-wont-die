import { LOOP_PHASES } from "../../../config/constants.js";
import { resolveEnding } from "../../../systems/ending-resolver.js";
import { generateBeatContent } from "../../engine/llm-service.js";
import returnWithElixirPrompt from "../../../prompts/hero/returnWithElixir.js";

export function registerReturnWithElixirBeat({ beatOrchestrator, gameState }) {
  const id = "heroJourney:epilogue:returnWithElixir";

  const beat = {
    id,
    async enter({ gameState, previousPage, previousChoice }) {
      const endingText = resolveEnding({ gameState });

      const instructions = returnWithElixirPrompt.replace(/\${endingText}/g, endingText);

      const content = await generateBeatContent({
        gameState,
        instructions,
        beatId: id,
        previousPage,
        previousChoice
      });

      const choices = (content.choices && content.choices.length
        ? content.choices
        : [
            {
              id: "restart",
              label: "Begin again.",
              hint: "New journey.",
              classification: [],
              effects: {}
            }
          ]
      ).map(c => ({
        ...c,
        id: `${id}:${c.id}`
      }));

      return {
        phase: LOOP_PHASES.EPILOGUE,
        text: { title: content.title, body: content.body },
        shouldAdvance: content.shouldAdvance,
        choices
      };
    },

    applyChoice(choice, { gameState }) {
      return "heroJourney:intro:prologue";
    }
  };

  beatOrchestrator.registerBeat(id, beat);
}