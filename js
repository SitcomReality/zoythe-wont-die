export default function getRoadOfTestsPrompt({ iteration, clue }) {
  return `
This is an Investigation Scene (iteration ${iteration}).
The protagonist is exploring the glitching \${terminology:afterlife} and fragments of their own \${terminology:memory}.
Hidden here is a \${terminology:clue}: "${clue.label}" - ${clue.description}.
Describe the specific \${terminology:location_type} or memory-space where this clue lingers.
Make the environment feel shaped by the death scenario and previous beats.

The player must choose how to \${terminology:investigation_action} in order to find the truth.

Provide 2-3 choices such as:
- Use a focused \${terminology:investigation_action} to study the clue up close (Risk/Reward) -> likely \${terminology:clue_discovery}.
- Ask a nearby \${terminology:spirit} or echoing NPC for context (Social) -> might \${terminology:clue_discovery} or add a red herring.
- Ignore it / focus on survival (Caution) -> miss this clue but maybe gain some other small benefit.

If this is a repeat visit (iteration > 1), note that the environment has shifted, degraded, or grown stranger.
If iteration 3+, the world should start insisting they leave or accept what they've found (subtle pressure, not hard railroading).
`;
}

import { LOOP_PHASES, CHOICE_CLASSIFICATIONS } from "../../../config/constants.js";
import { generateBeatContent } from "../../engine/llm-service.js";
import getRoadOfTestsPrompt from "../../../prompts/hero/roadOfTests.js";

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
    async enter({ gameState, rng, beatRepeatCount, previousPage, previousChoice }) {
      const clue = getUndiscoveredClue(gameState.mystery);
      
      // Vary instructions based on repetition
      let instructions = "";
      const isRepeat = beatRepeatCount > 0;
      
      if (clue) {
        instructions = getRoadOfTestsPrompt({
          iteration: beatRepeatCount + 1,
          clue
        });
        
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

      // Check AI recommendation (stored in gameState by orchestrator)
      const aiWantsAdvance = gameState.narrative.aiShouldAdvance !== false;
      
      // If AI says stay and we haven't hit clue threshold, return null to stay
      if (!aiWantsAdvance) {
        return null;
      }

      // Otherwise, return null to stay in this beat (will repeat with new iteration count)
      return null;
    }
  };

  beatOrchestrator.registerBeat(firstTrialId, investigationBeat);
  
  // Re-register others if needed, but mainly we want the loop to be investigation focused now.
  // We'll map the urgent trial to this one or a similar variant later.
}

