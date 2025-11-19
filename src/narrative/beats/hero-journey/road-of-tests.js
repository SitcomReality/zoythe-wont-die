import { LOOP_PHASES } from "../../../config/constants.js";
import { generateInterregnumEffect } from "../../../systems/interregnum-effects.js";

export function registerRoadOfTestsBeat({ beatOrchestrator, gameState, rng }) {
  const id = "heroJourney:tests:firstTrial";

  const beat = {
    id,
    enter({ gameState, rng }) {
      const effect = generateInterregnumEffect({ rng, severity: 1 });
      gameState.world.addEffect(effect);

      const title = "Trial of the Dying Heavens";
      const body = `The path forward splits before a divine wound in reality. ${effect.description}. To reach the MacGuffin, you must pass through this chaos. You see three paths: a direct charge through the center, a careful route along the edge, or a hidden passage that demands sacrifice.`;

      const choices = [
        {
          id: `${id}:direct`,
          label: "Charge through the center.",
          hint: "Bold.",
          classification: ["direct", "fight"],
          effects: { player: { ambition: +2, resolve: +1 } }
        },
        {
          id: `${id}:cautious`,
          label: "Follow the edge carefully.",
          hint: "Careful.",
          classification: ["cautious"],
          effects: { player: { resolve: +1 } }
        },
        {
          id: `${id}:sacrifice`,
          label: "Offer blood to the hidden passage.",
          hint: "Sacrifice.",
          classification: ["sacrifice"],
          effects: { player: { devotion: +2, compassion: +1 } }
        }
      ];

      return {
        phase: LOOP_PHASES.ASCENT,
        text: { title, body },
        choices
      };
    },

    applyChoice(choice, { gameState }) {
      const { player } = gameState;

      if (choice.effects?.player) {
        player.applyDelta(choice.effects.player);
      }

      // Advance threat level
      gameState.world.homeThreatLevel += 1;

      return "heroJourney:ordeal:heartOfInterregnum";
    }
  };

  beatOrchestrator.registerBeat(id, beat);
}