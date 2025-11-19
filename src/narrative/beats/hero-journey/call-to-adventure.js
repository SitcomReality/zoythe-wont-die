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

      // Placeholder routing: both flow to the same next beat stub (to be split later).
      return "heroJourney:intro:afterCallStub";
    }
  };

  beatOrchestrator.registerBeat(id, beat);

  // Minimal placeholder for the immediate follow-up beat to keep loop functional.
  const afterId = "heroJourney:intro:afterCallStub";
  beatOrchestrator.registerBeat(afterId, {
    id: afterId,
    enter() {
      return {
        phase: LOOP_PHASES.INTRO,
        text: {
          title: "The World Holds Its Breath",
          body:
            "Light and ash settle around you. Somewhere above, another god flickers. The path you have chosen begins to crystalize, fragile as first ice. The Interregnum has noticed you."
        },
        choices: [
          {
            id: `${afterId}:continue`,
            label: "Let the story tighten around you.",
            hint: "Proceed.",
            effects: {}
          }
        ]
      };
    },
    applyChoice() {
      // For now, loop back to the call to keep the prototype replayable.
      return id;
    }
  });
}