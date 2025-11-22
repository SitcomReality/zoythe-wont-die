import { LOOP_PHASES, CHOICE_CLASSIFICATIONS } from "../../../config/constants.js";
import { generateBeatContent } from "../../engine/llm-service.js";
import ordealPrompt from "../../../prompts/hero/ordeal.js";

export function registerOrdealBeat({ beatOrchestrator, gameState }) {
  const id = "heroJourney:ordeal:heartOfInterregnum";

  const beat = {
    id,
    async enter({ gameState, previousPage, previousChoice }) {
      const mystery = gameState.mystery;
      
      // Phase 2: Knowledge Tracking - Filter Suspects
      // Only show suspects we have met OR have found significant clues pointing to
      const allSuspects = Array.from(mystery.suspects.values());
      const knownSuspects = allSuspects.filter(s => {
        const isMet = s.met || (gameState.player.relationships.has(s.id));
        // Also check if we found the "killer clue" or specific evidence linked to them
        const cluesFound = Array.from(mystery.clues.discovered).map(id => mystery.clues.all.get(id));
        const linkedClueFound = cluesFound.some(c => c && c.relatedSuspectIds && c.relatedSuspectIds.includes(s.id));
        return isMet || linkedClueFound;
      });

      // Fallback if we somehow know nobody (unlikely by Ordeal)
      const visibleSuspects = knownSuspects.length > 0 ? knownSuspects : allSuspects;

      const suspectList = visibleSuspects.map(s => `- ${s.name} (${s.role})`).join("\n");
      
      const cluesFound = mystery.clues.discovered.size;
      const urgency = gameState.narrative.urgencyLevel;
      const totalClues = mystery.clues.all.size;
      const killer = mystery.suspects.get(mystery.killerId);

      // Step 3.4: Determine Ordeal Type
      let ordealType = "ACCUSATION";
      
      // Logic for ordeal variation
      if (urgency >= 7) {
        // Reality is collapsing hard: pure escape scenario
        ordealType = "ESCAPE";
      } else if (urgency >= 5) {
        ordealType = "CONFRONTATION";
      } else if (cluesFound < 2) {
        ordealType = "REVELATION";
      } else if (gameState.world.scope === "national" || gameState.world.scope === "cosmic") {
        // Higher scopes might default to a Trial if clues are sufficient but not 100%
        ordealType = cluesFound >= 3 ? "TRIAL" : "ACCUSATION"; 
      } else {
        ordealType = "ACCUSATION";
      }
      
      // Store type for applyChoice logic
      gameState.narrative.flags["ordealType"] = ordealType;

      const instructions = ordealPrompt({
        type: ordealType,
        suspectList,
        killerName: killer ? killer.name : "The Killer",
        urgency
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
        phase: LOOP_PHASES.ORDEAL,
        text: { title: content.title, body: content.body },
        shouldAdvance: content.shouldAdvance,
        choices
      };
    },

    applyChoice(choice, { gameState }) {
      const killerId = gameState.mystery.killerId;
      const killer = gameState.mystery.suspects.get(killerId);
      const text = (choice.label + " " + choice.id).toLowerCase();
      const ordealType = gameState.narrative.flags["ordealType"];
      
      let correct = false;
      let accusationMade = false;

      // Handle outcomes based on type
      if (ordealType === "REVELATION" || ordealType === "CONFRONTATION") {
        // In these cases, the killer is revealed to the player forcefully.
        // We treat this as "knowing" the killer, but perhaps with a penalty in the ending score/text.
        // For the narrative flow, we mark it as 'correct' so they deal with the right person in Resurrection,
        // but we flag how it happened.
        correct = true;
        accusationMade = true;
        gameState.narrative.flags["solvedByDeduction"] = false;
      } else if (ordealType === "ESCAPE") {
        // Escape path: you fail to formally solve the case here.
        // You do not make a proper accusation; the mystery remains unresolved going into Resurrection.
        correct = false;
        accusationMade = false;
        gameState.narrative.flags["solvedByDeduction"] = false;
      } else {
        // ACCUSATION or TRIAL - Player choice matters
        if (killer && text.includes(killer.name.toLowerCase())) {
          correct = true;
          gameState.narrative.flags["solvedByDeduction"] = true;
        } else if (text.includes("don't know") || text.includes("ignorance")) {
          correct = false;
        } else {
          // Accused someone else
          correct = false;
        }
        accusationMade = true;
      }

      gameState.mystery.progress.accusationMade = accusationMade;
      gameState.mystery.progress.correctKillerAccused = correct;

      // Store result for the Return phase
      gameState.narrative.flags["accusationResult"] = correct ? "correct" : "incorrect";

      return "heroJourney:return:roadBack";
    }
  };

  beatOrchestrator.registerBeat(id, beat);
}