import { LOOP_PHASES, CHOICE_CLASSIFICATIONS } from "../../../config/constants.js";
import { generateBeatContent } from "../../engine/llm-service.js";

export function registerOrdealBeat({ beatOrchestrator, gameState }) {
  const id = "heroJourney:ordeal:heartOfInterregnum";

  const beat = {
    id,
    async enter({ gameState }) {
      const suspects = Array.from(gameState.mystery.suspects.values());
      
      const instructions = `
        This is "The Accusation" (The Ordeal).
        The protagonist has gathered enough evidence (or run out of time).
        They stand before the assembled spirits/suspects in the Court of Dead Gods.
        The pressure is immense. Reality is collapsing.
        You must identify the killer.
        
        The suspects are:
        ${suspects.map(s => `- ${s.name} (${s.role})`).join("\n")}
        
        Provide a brief dramatic intro to the confrontation.
        Then, strictly provide choices that are Accusations for each suspect, plus maybe one "I don't know" option.
        Example choices: "Accuse Kael", "Accuse Mira", "Admit ignorance".
      `;

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