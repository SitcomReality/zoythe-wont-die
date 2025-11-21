import { LOOP_PHASES } from "../../../config/constants.js";
import { generateBeatContent } from "../../engine/llm-service.js";
import roadBackPrompt from "../../prompts/hero/roadBack.js";

export function registerRoadBackBeat({ beatOrchestrator, gameState }) {
  const id = "heroJourney:return:roadBack";

  const beat = {
    id,
    async enter({ gameState }) {
      const threat = gameState.world.homeThreat;
      const hasPrimary = gameState.world.macGuffinStatus === "primaryAcquired";
      const macguffin = hasPrimary ? gameState.world.primaryMacGuffin : gameState.world.backupMacGuffin;

      const instructions = roadBackPrompt
        .replace(/\${macguffin.name}/g, macguffin.name)
        .replace(/\${macguffin.description}/g, macguffin.description)
        .replace(/\${macguffin.bindingEffect}/g, macguffin.bindingEffect)
        .replace(/\${threat.name}/g, threat.name);

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
        phase: LOOP_PHASES.RETURN,
        text: { title: content.title, body: content.body },
        choices
      };
    },

    applyChoice(choice, { gameState }) {
      // Any world/player deltas already applied by orchestrator.
      // Proceed to Resurrection.
      return "heroJourney:return:resurrection";
    }
  };

  beatOrchestrator.registerBeat(id, beat);
}

