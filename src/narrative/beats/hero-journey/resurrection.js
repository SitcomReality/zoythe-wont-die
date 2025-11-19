import { LOOP_PHASES } from "../../../config/constants.js";
import { evaluateArchetype } from "../../../systems/protagonist-archetype.js";
import { updateWorldTone } from "../../../systems/tone-system.js";

export function registerResurrectionBeat({ beatOrchestrator, gameState }) {
  const id = "heroJourney:return:resurrection";

  const beat = {
    id,
    enter({ gameState }) {
      const title = "The Final Choice";
      const body = `You stand at the threshold of home. The ${gameState.world.homeThreat.name} rages before you. The MacGuffin pulses in your hands. This moment will define who you are: the hero who saves, the sacrifice who gives all, or the survivor who endures. Choose.`;

      const choices = [
        {
          id: `${id}:sacrifice`,
          label: "Give everything. Become the sacrifice.",
          hint: "Redemptive.",
          classification: ["sacrifice"],
          effects: { player: { heroism: +3, devotion: +3, compassion: +2 } }
        },
        {
          id: `${id}:triumph`,
          label: "Stand tall. Claim victory.",
          hint: "Epic.",
          classification: ["direct"],
          effects: { player: { heroism: +3, ambition: +2, resolve: +3 } }
        },
        {
          id: `${id}:survive`,
          label: "Do what you must to survive.",
          hint: "Reluctant.",
          classification: ["cautious"],
          effects: { player: { resolve: +2, doubt: +1 } }
        }
      ];

      return {
        phase: LOOP_PHASES.RETURN,
        text: { title, body },
        choices
      };
    },

    applyChoice(choice, { gameState }) {
      const { player, world } = gameState;

      if (choice.effects?.player) {
        player.applyDelta(choice.effects.player);
      }

      // Evaluate final archetype
      const newArchetype = evaluateArchetype({ player });
      player.archetype = newArchetype;

      // Update world tone
      updateWorldTone({ world, player });

      return "heroJourney:epilogue:returnWithElixir";
    }
  };

  beatOrchestrator.registerBeat(id, beat);
}