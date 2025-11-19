import { LOOP_PHASES } from "../../../config/constants.js";
import { evaluateArchetype } from "../../../systems/protagonist-archetype.js";
import { updateWorldTone } from "../../../systems/tone-system.js";
import { generateBeatContent } from "../../engine/llm-service.js";

export function registerResurrectionBeat({ beatOrchestrator, gameState }) {
  const id = "heroJourney:return:resurrection";

  const beat = {
    id,
    async enter({ gameState }) {
      const threat = gameState.world.homeThreat;

      const instructions = `
        This is "The Resurrection" – the pivotal identity-defining choice near the end.
        The protagonist stands at the threshold of home, facing the threat "${threat.name}".
        Their journey, relationships, and the MacGuffin should echo through this moment.
        Provide 2-3 choices that can tilt the protagonist toward:
        - Sacrificial/redemptive path.
        - Triumphant/epic victory.
        - Survival-focused/reluctant path or other nuanced outcomes.
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