import { LOOP_PHASES } from "../../../config/constants.js";
import { resolveEnding } from "../../../systems/ending-resolver.js";

export function registerReturnWithElixirBeat({ beatOrchestrator, gameState }) {
  const id = "heroJourney:epilogue:returnWithElixir";

  const beat = {
    id,
    enter({ gameState }) {
      const endingText = resolveEnding({ gameState });
      const threat = gameState.world.homeThreat;

      const title = "Epilogue";
      const body = `${threat.name} is ended—or transformed. ${endingText}`;

      const choices = [
        {
          id: `${id}:restart`,
          label: "Begin again.",
          hint: "New journey.",
          effects: {}
        }
      ];

      return {
        phase: LOOP_PHASES.EPILOGUE,
        text: { title, body },
        choices
      };
    },

    applyChoice(choice, { gameState, beatOrchestrator }) {
      // Reset to start
      return "heroJourney:intro:callToAdventure";
    }
  };

  beatOrchestrator.registerBeat(id, beat);
}