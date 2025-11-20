import { LOOP_PHASES } from "../../../config/constants.js";
import { generateBeatContent } from "../../engine/llm-service.js";

export function registerPrologueBeat({ beatOrchestrator, gameState }) {
  const id = "heroJourney:intro:prologue";

  const beat = {
    id,
    async enter({ gameState }) {
      const threat = gameState.world.homeThreat;

      const instructions = `
        This is the Prologue – a scene-setting exposition page with no player choices yet.
        Describe the world of the Interregnum: dying gods, their wars, the fallout across mortal lands.
        Establish the immediate home threat: "${threat.name}" (${threat.description}).
        Write evocative, atmospheric prose (100-150 words) that sets tone and stakes.
        This is a read-only narrative beat, so provide a single "continue" option labeled naturally (e.g. "Continue.", "Press onward.", "Face the dawn.").
        Return exactly ONE choice with id "continue", label as you see fit, and no effects.
      `;

      const content = await generateBeatContent({
        gameState,
        instructions,
        beatId: id
      });

      // Ensure exactly one continue choice
      const choices = content.choices && content.choices.length > 0
        ? [{ 
            id: `${id}:continue`,
            label: content.choices[0].label || "Continue.",
            hint: null,
            classification: [],
            effects: {}
          }]
        : [{
            id: `${id}:continue`,
            label: "Continue.",
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