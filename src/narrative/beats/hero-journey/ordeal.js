import { LOOP_PHASES, MACGUFFIN_STATUS } from "../../../config/constants.js";
import { generateBeatContent } from "../../engine/llm-service.js";

export function registerOrdealBeat({ beatOrchestrator, gameState }) {
  const id = "heroJourney:ordeal:heartOfInterregnum";

  const beat = {
    id,
    async enter({ gameState }) {
      const macguffin = gameState.world.primaryMacGuffin;

      const instructions = `
        This is "The Ordeal" at the heart of the Interregnum.
        The protagonist confronts the MacGuffin: "${macguffin.name}" (${macguffin.description}).
        The scene should feel climactic, surreal, and dangerous; the dying god's presence is palpable.
        Provide 2-3 choices that represent different approaches:
        - Bold/direct seizure.
        - Reverent/prayerful or redemptive approach.
        - Hesitant/reluctant or cautious response.
        Some choices may mark the MacGuffin as acquired (world.macGuffinStatus = "primaryAcquired" or "backupAcquired").
      `;

      const content = await generateBeatContent({
        gameState,
        instructions,
        beatId: id
      });

      const choices = content.choices.map(c => ({
        ...c,
        id: `${id}:${c.id}`
      }));

      return {
        phase: LOOP_PHASES.ORDEAL,
        text: { title: content.title, body: content.body },
        choices
      };
    },

    applyChoice(choice, { gameState }) {
      const { player, world } = gameState;

      // Ensure some macguffin status if LLM did not set one
      if (!world.macGuffinStatus || world.macGuffinStatus === MACGUFFIN_STATUS.NONE) {
        world.macGuffinStatus = MACGUFFIN_STATUS.PRIMARY_ACQUIRED;
      }

      // Add the appropriate MacGuffin to inventory based on status
      if (world.macGuffinStatus === MACGUFFIN_STATUS.PRIMARY_ACQUIRED || world.macGuffinStatus === MACGUFFIN_STATUS.BOUND) {
        if (!player.inventory.includes(world.primaryMacGuffin)) {
          player.addToInventory(world.primaryMacGuffin);
        }
      } else if (world.macGuffinStatus === MACGUFFIN_STATUS.BACKUP_ACQUIRED) {
        if (!player.inventory.includes(world.backupMacGuffin)) {
          player.addToInventory(world.backupMacGuffin);
        }
      }

      return "heroJourney:return:roadBack";
    }
  };

  beatOrchestrator.registerBeat(id, beat);
}