import { LOOP_PHASES } from "../../../config/constants.js";
import { evaluateArchetype } from "../../../systems/protagonist-archetype.js";
import { updateWorldTone } from "../../../systems/tone-system.js";
import { generateBeatContent } from "../../engine/llm-service.js";
import resurrectionPrompt from "../../prompts/hero/resurrection.js";

export function registerResurrectionBeat({ beatOrchestrator, gameState }) {
  const id = "heroJourney:return:resurrection";

  const beat = {
    id,
    async enter({ gameState }) {
      const threat = gameState.world.homeThreat;

      const instructions = resurrectionPrompt.replace(/\${threat.name}/g, threat.name);

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
      const { player, world } = gameState;

      // Re-evaluate final archetype and world tone after LLM-driven deltas
      const newArchetype = evaluateArchetype({ player });
      player.archetype = newArchetype;

      updateWorldTone({ world, player });

      return "heroJourney:epilogue:returnWithElixir";
    }
  };

  beatOrchestrator.registerBeat(id, beat);
}