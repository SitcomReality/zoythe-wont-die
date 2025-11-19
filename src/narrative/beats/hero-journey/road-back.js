import { LOOP_PHASES } from "../../../config/constants.js";

export function registerRoadBackBeat({ beatOrchestrator, gameState }) {
  const id = "heroJourney:return:roadBack";

  const beat = {
    id,
    enter({ gameState }) {
      const threat = gameState.world.homeThreat;
      const hasPrimary = gameState.world.macGuffinStatus === "primaryAcquired";
      const macguffin = hasPrimary ? gameState.world.primaryMacGuffin : gameState.world.backupMacGuffin;

      const title = "The Road Home Burns";
      const body = `You turn toward home, ${macguffin.name} in hand. ${macguffin.bindingEffect}. But the Interregnum is not done with you. A dying god offers you power—enough to reshape the world, or enough to doom it. The choice tears at your soul.`;

      const choices = [
        {
          id: `${id}:refuse`,
          label: "Refuse. Hold to your purpose.",
          hint: "Heroic.",
          effects: { player: { heroism: +2, resolve: +2 } }
        },
        {
          id: `${id}:accept`,
          label: "Accept the power. Become something more.",
          hint: "Corruption.",
          effects: { player: { ambition: +3, doubt: +2 }, world: { tags: ["divine-corruption"] } }
        },
        {
          id: `${id}:bargain`,
          label: "Bargain for a lesser boon.",
          hint: "Pragmatic.",
          effects: { player: { resolve: +1, compassion: +1 } }
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

      if (choice.effects?.world) {
        world.applyDelta(choice.effects.world);
      }

      return "heroJourney:return:resurrection";
    }
  };

  beatOrchestrator.registerBeat(id, beat);
}