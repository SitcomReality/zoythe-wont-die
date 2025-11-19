import { LOOP_PHASES } from "../../../config/constants.js";

export function registerCallToAdventureBeat({ beatOrchestrator }) {
  const id = "heroJourney:intro:callToAdventure";

  const beat = {
    id,
    enter({ gameState }) {
      const { player, world } = gameState;

      const title = "Omens at the Edge of a Dying Heaven";
      const body =
        "The sky has learned to bleed. Fractured constellations hang like broken crowns over the world, each shard a fading god whose name you half-remember from childhood prayers. Tonight, one of them falls—straight toward you.";

      const choices = [
        {
          id: `${id}:accept`,
          label: "Step toward the falling godlight.",
          hint: "Embrace the call.",
          effects: { player: { resolve: +1 }, world: { omensSeen: 1 } }
        },
        {
          id: `${id}:refuse`,
          label: "Turn away. This is not your fate.",
          hint: "Refuse—for now.",
          effects: { player: { doubt: +1 } }
        }
      ];

      return {
        phase: LOOP_PHASES.INTRO,
        text: { title, body },
        choices
      };
    },

    applyChoice(choice, { gameState }) {
      const { player, world } = gameState;

      if (choice.effects?.player) {
        player.applyDelta(choice.effects.player);
      }
      if (choice.effects?.world) {
        world.applyDelta(choice.effects.world);
      }

      return "heroJourney:intro:meetingMentor";
    }
  };

  beatOrchestrator.registerBeat(id, beat);
}