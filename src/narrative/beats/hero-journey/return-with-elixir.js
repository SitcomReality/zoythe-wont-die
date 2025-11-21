import { LOOP_PHASES } from "../../../config/constants.js";
import { resolveEnding } from "../../../systems/ending-resolver.js";
import { generateBeatContent } from "../../engine/llm-service.js";
import returnWithElixirPrompt from "../../prompts/hero/returnWithElixir.js";

export function registerReturnWithElixirBeat({ beatOrchestrator, gameState }) {
  const id = "heroJourney:epilogue:returnWithElixir";

  const beat = {
    id,
    async enter({ gameState }) {
      const endingText = resolveEnding({ gameState });
      const threat = gameState.world.homeThreat;

      const instructions = returnWithElixirPrompt
        .replace(/\${threat.name}/g, threat.name)
        .replace(/\${endingText}/g, endingText);

      const content = await generateBeatContent({
        gameState,
        instructions,
        beatId: id
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
        choices
      };
    },

    applyChoice(choice, { gameState, beatOrchestrator }) {
      // Reset to start structurally; new run will have fresh generated content.
      return "heroJourney:intro:callToAdventure";
    }
  };

  beatOrchestrator.registerBeat(id, beat);
}