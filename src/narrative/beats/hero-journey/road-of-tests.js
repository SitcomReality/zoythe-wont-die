import { LOOP_PHASES, CHOICE_CLASSIFICATIONS } from "../../../config/constants.js";
import { generateBeatContent } from "../../engine/llm-service.js";

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
    async enter({ gameState, rng }) {
      const clue = getUndiscoveredClue(gameState.mystery);
      
      let instructions = "";
      if (clue) {
        instructions = `
          This is an Investigation Scene.
          The protagonist is exploring the glitching world/memories.
          Hidden here is a clue: "${clue.label}" - ${clue.description}.
          Describe the location (e.g., a memory fragment, a ruined temple, a digital void).
          The player must choose how to interact to find the truth.
          Provide 2-3 choices:
          - Investigate closely (Risk/Reward) -> Will reveal clue.
          - Ask a nearby spirit/NPC (Social) -> Might reveal clue.
          - Ignore it/Focus on survival (Caution) -> Misses clue.
        `;
        // Temporarily store the clue ID on the beat state or gamestate to retrieve in applyChoice
        // For simplicity, we'll look it up again or assume positive choices find it.
        gameState.narrative.pendingClueId = clue.id;
      } else {
        instructions = `
          This is a transition scene. The trail has gone cold for a moment.
          The world glitches violently.
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
      // We use the classifier to see if they investigated/analyzed/interrogated
      // Or if the choice effects explicitly say so (Phase 4 feature).
      // For now, map affirmative actions to discovery.
      
      const { pendingClueId } = gameState.narrative;
      
      // We'll assume any "Advance", "Investigate", "Analyze", "Interrogate" type works.
      // Using the classifier from the orchestrator pass would be ideal, but we can re-infer here or trust the intent.
      // Since we don't have the classification handy in arguments easily without re-importing, let's assume positive action.
      
      const isPassive = choice.id.includes("ignore") || choice.id.includes("flee") || choice.id.includes("rest");
      
      if (pendingClueId && !isPassive) {
        gameState.mystery.clues.discovered.add(pendingClueId);
        // Optionally notify player via a status message or event?
        // For now, the dossier update will show it.
      }

      // Loop back to tests or move to Ordeal if enough clues?
      // Simplified logic: 3 tests then Ordeal.
      // We can use beatIndex to track local progress roughly.
      
      // For this demo, let's just ping-pong or move to Ordeal after a few steps.
      if (gameState.mystery.clues.discovered.size >= 3) {
        return "heroJourney:ordeal:heartOfInterregnum";
      }

      // Otherwise, keep investigating (or maybe trigger an urgent rail)
      return firstTrialId; 
    }
  };

  beatOrchestrator.registerBeat(firstTrialId, investigationBeat);
  
  // Re-register others if needed, but mainly we want the loop to be investigation focused now.
  // We'll map the urgent trial to this one or a similar variant later.
}

