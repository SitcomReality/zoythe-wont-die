import { LOOP_PHASES, MACGUFFIN_STATUS } from "../../../config/constants.js";

export function registerOrdealBeat({ beatOrchestrator, gameState }) {
  const id = "heroJourney:ordeal:heartOfInterregnum";

  const beat = {
    id,
    enter({ gameState }) {
      const macguffin = gameState.world.primaryMacGuffin;

      const title = "The Heart of Divine Ruin";
      const body = `You stand before ${macguffin.name}. It hovers in a crumbling temple, surrounded by the death-throes of a god. The air screams with divine agony. To claim it, you must prove yourself worthy—or simply survive long enough to grasp it.`;

      const choices = [
        {
          id: `${id}:claimBoldly`,
          label: "Seize it without hesitation.",
          hint: "Epic.",
          classification: ["direct"],
          effects: { 
            player: { heroism: +3, ambition: +2, resolve: +2 },
            world: { macGuffinStatus: MACGUFFIN_STATUS.PRIMARY_ACQUIRED }
          }
        },
        {
          id: `${id}:prayFirst`,
          label: "Pray to the dying god before taking it.",
          hint: "Redemptive.",
          classification: ["mercy"],
          effects: { 
            player: { heroism: +2, devotion: +2, compassion: +2 },
            world: { macGuffinStatus: MACGUFFIN_STATUS.PRIMARY_ACQUIRED }
          }
        },
        {
          id: `${id}:hesitate`,
          label: "Hesitate. The weight of this feels wrong.",
          hint: "Reluctant.",
          classification: ["refuseQuest", "cautious"],
          effects: { 
            player: { doubt: +2, compassion: +1 }
          }
        }
      ];

      return {
        phase: LOOP_PHASES.ORDEAL,
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

      // If hesitated, forced to take backup
      if (choice.id.includes("hesitate")) {
        world.macGuffinStatus = MACGUFFIN_STATUS.BACKUP_ACQUIRED;
        player.addToInventory(world.backupMacGuffin);
      } else {
        player.addToInventory(world.primaryMacGuffin);
      }

      return "heroJourney:return:roadBack";
    }
  };

  beatOrchestrator.registerBeat(id, beat);
}