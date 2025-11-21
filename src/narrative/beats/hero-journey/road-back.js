import { LOOP_PHASES } from "../../../config/constants.js";
import { generateBeatContent } from "../../engine/llm-service.js";
import roadBackPrompt from "../../../prompts/hero/roadBack.js";

export function registerRoadBackBeat({ beatOrchestrator, gameState }) {
  const id = "heroJourney:return:roadBack";

  const beat = {
    id,
    async enter({ gameState }) {
      const accusationResult = gameState.narrative.flags["accusationResult"];
      const didAccuseCorrectly = accusationResult === "correct";
      const killer = gameState.mystery.suspects.get(gameState.mystery.killerId);

      const instructions = roadBackPrompt
        .replace(/\${killerName}/g, killer?.name || "unknown")
        .replace(/\${accusationResult}/g, didAccuseCorrectly ? "correct" : "incorrect");

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
      return "heroJourney:return:resurrection";
    }
  };

  beatOrchestrator.registerBeat(id, beat);
}

