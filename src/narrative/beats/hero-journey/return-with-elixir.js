import { LOOP_PHASES } from "../../../config/constants.js";
import { resolveEnding } from "../../../systems/ending-resolver.js";
import { generateBeatContent } from "../../engine/llm-service.js";

export function registerReturnWithElixirBeat({ beatOrchestrator, gameState }) {
  const id = "heroJourney:epilogue:returnWithElixir";

  const beat = {
    id,
    async enter({ gameState }) {
      const endingText = resolveEnding({ gameState });
      const threat = gameState.world.homeThreat;

      const instructions = `
        This is the Epilogue: "Return with the Elixir".
        The home threat was "${threat.name}".
        A precomputed ending summary from the game logic is:
        "${endingText}"
        Use this summary as a guiding spine, but you may elaborate and color it with tone, relationships, and prior choices.
        Focus on resolution and reflection rather than new action.
        Provide 1-2 simple choices about how the protagonist frames or begins their next chapter (e.g., begin again, retire, teach others).
      `;

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