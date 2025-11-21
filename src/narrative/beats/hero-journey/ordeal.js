import { LOOP_PHASES, CHOICE_CLASSIFICATIONS } from "../../../config/constants.js";
import { generateBeatContent } from "../../engine/llm-service.js";
import ordealPrompt from "../../prompts/hero/ordeal.js";

export function registerOrdealBeat({ beatOrchestrator, gameState }) {
  const id = "heroJourney:ordeal:heartOfInterregnum";

  const beat = {
    id,
    async enter({ gameState }) {
      const suspects = Array.from(gameState.mystery.suspects.values());
      const suspectList = suspects.map(s => `- ${s.name} (${s.role})`).join("\n");
      
      const instructions = ordealPrompt.replace(/\${suspectList}/g, suspectList);

      const content = await generateBeatContent({
        gameState,
        instructions,
        beatId: id
      });
      
      // Force choice IDs to match suspect IDs for easy parsing
      // We'll trust the LLM generated suitable labels, but we might want to hardcode the IDs if we were stricter.
      // For now, rely on mapping LLM output.
      
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
      // Determine if the player accused the correct killer
      const killerId = gameState.mystery.killerId;
      const text = (choice.label + " " + choice.id).toLowerCase();
      const killer = gameState.mystery.suspects.get(killerId);
      
      let correct = false;
      if (text.includes(killer.name.toLowerCase())) {
        correct = true;
      }

      gameState.mystery.progress.accusationMade = true;
      gameState.mystery.progress.correctKillerAccused = correct;

      // Store result for the Return phase
      gameState.narrative.flags["accusationResult"] = correct ? "correct" : "incorrect";

      return "heroJourney:return:roadBack";
    }
  };

  beatOrchestrator.registerBeat(id, beat);
}