import { LOOP_PHASES, CHOICE_CLASSIFICATIONS } from "../../../config/constants.js";
import { generateBeatContent } from "../../engine/llm-service.js";
import roadOfTestsPrompt from "../../../prompts/hero/roadOfTests.js";

export function registerRoadOfTestsBeat({ beatOrchestrator, gameState, rng }) {
  const firstTrialId = "heroJourney:tests:firstTrial";
  
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
    async enter({ gameState, beatRepeatCount, previousPage, previousChoice }) {
      const clue = getUndiscoveredClue(gameState.mystery);
      const isRepeat = beatRepeatCount > 0;
      const location = gameState.mystery?.deathScenario?.location || "the void";
      
      let instructions = "";
      
      if (clue) {
        // Use the dynamic prompt function with specific details (Step 3.3)
        // and terminology tags (Step 3.2)
        instructions = roadOfTestsPrompt({
          iteration: beatRepeatCount + 1,
          clue,
          location
        });
        
        gameState.narrative.pendingClueId = clue.id;
      } else {
        instructions = `
          This is a transition scene in the ${location}. The trail has gone cold for a moment.
          The world \${terminology:glitch}es violently.
          ${isRepeat ? `This is attempt ${beatRepeatCount + 1}. The environment is degrading.` : ""}
          The player has found all currently available clues here.
          Provide choices to travel to a new location or rest. At least one of these paths can feel like a tempting but ultimately misleading lead that mainly wastes time (increasing pressure) without revealing new true evidence.
        `;
        gameState.narrative.pendingClueId = null;
      }

      const content = await generateBeatContent({
        gameState,
        instructions,
        beatId: firstTrialId,
        previousPage,
        previousChoice
      });

      const choices = content.choices.map(c => ({
        ...c,
        id: `${firstTrialId}:${c.id}`
      }));

      return {
        phase: LOOP_PHASES.ASCENT,
        text: { title: content.title, body: content.body },
        shouldAdvance: content.shouldAdvance,
        choices
      };
    },

    applyChoice(choice, { gameState }) {
      // Check if choice leads to clue discovery
      const { pendingClueId } = gameState.narrative;
      const idLower = choice.id.toLowerCase();
      const isPassive = idLower.includes("ignore") || idLower.includes("flee") || idLower.includes("rest") || idLower.includes("leave");
      
      if (pendingClueId && !isPassive) {
        const clue = gameState.mystery.clues.all.get(pendingClueId);
        gameState.mystery.clues.discovered.add(pendingClueId);

        // If this newly discovered clue is a red herring, treat it as wasted time by nudging urgency upward
        if (clue && clue.truthValue === false) {
          gameState.narrative.urgencyLevel = Math.min(
            gameState.narrative.urgencyLevel + 1,
            gameState.narrative.urgencyThreshold + 1
          );
        }
      }

      // Decide whether to advance or stay
      const cluesFound = gameState.mystery.clues.discovered.size;
      const totalClues = gameState.mystery.clues.all.size;
      
      // After finding enough clues (majority), advance to Ordeal
      if (cluesFound >= Math.max(3, Math.ceil(totalClues * 0.6))) {
        return "heroJourney:ordeal:heartOfInterregnum";
      }

      // Check AI recommendation (stored in gameState by orchestrator)
      const aiWantsAdvance = gameState.narrative.aiShouldAdvance !== false;
      
      // If AI says stay and we haven't hit clue threshold, return null to stay
      // But if we found a clue this turn, maybe prompt to move or stay? 
      // For now, standard logic:
      if (!aiWantsAdvance) {
        return null;
      }

      // If we have no pending clue (trail cold), we probably should advance or loop explicitly
      if (!pendingClueId) {
         // If no clues left, force advance
         return "heroJourney:ordeal:heartOfInterregnum";
      }

      // Otherwise, return null to stay in this beat (will repeat with new iteration count)
      return null;
    }
  };

  beatOrchestrator.registerBeat(firstTrialId, investigationBeat);
}

