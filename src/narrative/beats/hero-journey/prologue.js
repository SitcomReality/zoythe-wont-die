import { LOOP_PHASES } from "../../../config/constants.js";
import { generateBeatContent } from "../../engine/llm-service.js";

export function registerPrologueBeat({ beatOrchestrator, gameState }) {
  const id = "heroJourney:intro:prologue";

  const beat = {
    id,
    async enter({ gameState, terminology }) {
      const instructions = `
        This is the Prologue.
        The protagonist has just died. The sensation is confusing, broken, and wrong.
        Instead of passing on, they are stuck in a "Supernal Interregnum" - a shattered ${terminology.afterlife} where the ${terminology.dead_god} is also dead.
        Describe the sensation of the soul unraveling but hitting a hard floor instead of dissolving.
        The world is grey, filled with ${terminology.strange} distortions, and terrifyingly silent.
        Establish the central mystery immediately: "You are dead. But you are still here. And you don't remember who killed you."
        This is a read-only narrative beat. Provide a single "continue" option labeled "Open your eyes." or "Stand up.".
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