import { LOOP_PHASES } from "../../../config/constants.js";
import { generateBeatContent } from "../../engine/llm-service.js";

export function registerRoadBackBeat({ beatOrchestrator, gameState }) {
  const id = "heroJourney:return:roadBack";

  const beat = {
    id,
    async enter({ gameState }) {
      const threat = gameState.world.homeThreat;
      const hasPrimary = gameState.world.macGuffinStatus === "primaryAcquired";
      const macguffin = hasPrimary ? gameState.world.primaryMacGuffin : gameState.world.backupMacGuffin;

      const instructions = `
        This is "The Road Back".
        The protagonist turns toward home, carrying the MacGuffin: "${macguffin.name}" (${macguffin.description}).
        Binding effect: "${macguffin.bindingEffect}".
        The Interregnum remains hostile, and some dying god or force offers corrupting power or temptation along the way.
        Home threat is "${threat.name}".
        Provide 2-3 choices that roughly correspond to:
        - Refusing corruption and holding to purpose.
        - Accepting or partially accepting power (possibly adding "divine-corruption" to world.tags).
        - Bargaining or pragmatic compromise.
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

