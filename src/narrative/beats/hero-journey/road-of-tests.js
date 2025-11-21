import { LOOP_PHASES, CHOICE_CLASSIFICATIONS } from "../../../config/constants.js";
import { generateBeatContent } from "../../engine/llm-service.js";
import roadOfTestsPrompt from "../../../prompts/hero/roadOfTests.js";

export function registerRoadOfTestsBeat({ beatOrchestrator, gameState, rng }) {
  const firstTrialId = "heroJourney:tests:firstTrial";
  const urgentTrialId = "heroJourney:tests:urgentTrial"; // Kept for rails
  
  // Helper to find an undiscovered clue
  function getUndiscoveredClue(mystery) {
    if (!mystery || !mystery.clues) return null;
    const allIds = Array.from(mystery.clues.all.keys());
    const discovered = mystery.clues.discovered;
    const available = allIds.filter(id => !discovered.has(id));
    if (available.length === 0) return null;
    const id = rng.pick(available);
    return mystery.clues.all.get(id);
  }

  // The Investigation Beat
  const investigationBeat = {
    id: firstTrialId,
    async enter({ gameState, rng, beatRepeatCount }) {
      const clue = getUndiscoveredClue(gameState.mystery);
      
      // Vary instructions based on repetition
      let instructions = "";
      const isRepeat = beatRepeatCount > 0;
      
      if (clue) {
        instructions = roadOfTestsPrompt
          .replace(/\${clue.label}/g, clue.label)
          .replace(/\${clue.description}/g, clue.description)
          .replace(/\${iteration}/g, String(beatRepeatCount + 1));
        
        gameState.narrative.pendingClueId = clue.id;
      } else {
        instructions = `
          This is a transition scene. The trail has gone cold for a moment.
          The world glitches violently.
          ${isRepeat ? `This is attempt ${beatRepeatCount + 1}. The environment is degrading.` : ""}
          Provide choices to travel to a new location or rest.
        `;
        gameState.narrative.pendingClueId = null;
      }

      const content = await generateBeatContent({
        gameState,
        instructions,
        beatId: firstTrialId
      });

      const choices = content.choices.map(c => ({
        ...c,
        id: `${firstTrialId}:${c.id}`
      }));

      return {
        phase: LOOP_PHASES.ASCENT,
        text: { title: content.title, body: content.body },
        choices
      };
    },

    applyChoice(choice, { gameState }) {
      // Check if choice leads to clue discovery
      const { pendingClueId } = gameState.narrative;
      const isPassive = choice.id.includes("ignore") || choice.id.includes("flee") || choice.id.includes("rest");
      
      if (pendingClueId && !isPassive) {
        gameState.mystery.clues.discovered.add(pendingClueId);
      }

      // Decide whether to advance or stay
      const cluesFound = gameState.mystery.clues.discovered.size;
      
      // After 3 clues, advance to Ordeal
      if (cluesFound >= 3) {
        return "heroJourney:ordeal:heartOfInterregnum";
      }

      // Otherwise, return null to stay in this beat (will repeat with new iteration count)
      // The beat will be re-run with beatRepeatCount incremented
      return null;
    }
  };

  beatOrchestrator.registerBeat(firstTrialId, investigationBeat);
  
  // Re-register others if needed, but mainly we want the loop to be investigation focused now.
  // We'll map the urgent trial to this one or a similar variant later.
}

