import { LOOP_PHASES } from "../../../config/constants.js";
import { evaluateArchetype } from "../../../systems/protagonist-archetype.js";
import { updateWorldTone } from "../../../systems/tone-system.js";
import { generateBeatContent } from "../../engine/llm-service.js";
import resurrectionPrompt from "../../../prompts/hero/resurrection.js";
import { resolveResurrectionScene } from "../../../systems/twist-generator.js";

export function registerResurrectionBeat({ beatOrchestrator, gameState }) {
  const id = "heroJourney:return:resurrection";

  const beat = {
    id,
    async enter({ gameState, previousPage, previousChoice }) {
      const didAccuseCorrectly = gameState.narrative.flags["accusationResult"] === "correct";

      // Retrieve the pre-determined twist details
      const twist = resolveResurrectionScene({
        gameState,
        rng: gameState.rng
      });

      const instructions = resurrectionPrompt({
        accusationResult: didAccuseCorrectly ? "correct" : "incorrect",
        twist
      });

      const content = await generateBeatContent({
        gameState,
        instructions,
        beatId: id,
        previousPage,
        previousChoice
      });

      const choices = content.choices.map(c => ({
        ...c,
        id: `${id}:${c.id}`
      }));

      return {
        phase: LOOP_PHASES.RETURN,
        text: { title: content.title, body: content.body },
        shouldAdvance: content.shouldAdvance,
        choices
      };
    },

    applyChoice(choice, { gameState }) {
      const { player, world } = gameState;
      const newArchetype = evaluateArchetype({ player });
      player.archetype = newArchetype;
      updateWorldTone({ world, player });
      return "heroJourney:epilogue:returnWithElixir";
    }
  };

  beatOrchestrator.registerBeat(id, beat);
}

