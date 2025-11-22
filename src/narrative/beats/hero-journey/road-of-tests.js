import { LOOP_PHASES, CHOICE_CLASSIFICATIONS } from "../../../config/constants.js";
import { generateBeatContent } from "../../engine/llm-service.js";
import roadOfTestsPrompt from "../../../prompts/hero/roadOfTests.js";
import { generateInterregnumEffect } from "../../../systems/interregnum-effects.js";

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

  // Helper to find a relevant NPC to encounter
  function getEncounterNpc(gameState) {
    if (!gameState.npcRoster) return null;
    const roster = Array.from(gameState.npcRoster.values());
    
    // Prioritize unmet NPCs to flesh out the cast
    const unmet = roster.filter(n => !n.met);
    if (unmet.length > 0) {
      return gameState.rng.pick(unmet);
    }
    
    // Otherwise pick anyone except the killer (unless we want to hint at them)
    // For now, just random pick to keep world alive
    return gameState.rng.pick(roster);
  }

  // The Investigation Beat
  const investigationBeat = {
    id: firstTrialId,
    async enter({ gameState, beatRepeatCount, previousPage, previousChoice }) {
      const clue = getUndiscoveredClue(gameState.mystery);
      const isRepeat = beatRepeatCount > 0;
      const location = gameState.mystery?.deathScenario?.location || "the void";
      
      // 1. Atmosphere Check (High Urgency = Bad Weather)
      let atmosphericEffect = null;
      if (gameState.narrative.urgencyLevel >= 2) {
        // Check if world already has active effects, otherwise generate ephemeral one
        if (gameState.world.activeEffects.length > 0) {
          atmosphericEffect = gameState.world.activeEffects[gameState.world.activeEffects.length - 1];
        } else {
          // Generate a temporary effect for this scene based on faction context if possible
          // We assume faction is unknown or generic here, but could pull from mystery suspects
          atmosphericEffect = generateInterregnumEffect({ rng: gameState.rng, severity: Math.min(3, Math.floor(gameState.narrative.urgencyLevel / 2)) });
        }
      }

      // 2. NPC Encounter Check (Random chance or if clue relates to them)
      // 30% chance of random encounter, or higher if clue is related
      let npc = null;
      if (gameState.rng.next() < 0.4) {
        npc = getEncounterNpc(gameState);
        if (npc) {
          // Mark as met
          if (!npc.met) {
            npc.met = true;
            gameState.player.addRelationship(npc);
          }
        }
      }

      let instructions = "";
      
      if (clue) {
        // Use the dynamic prompt function with specific details (Step 3.3)
        // and terminology tags (Step 3.2)
        instructions = roadOfTestsPrompt({
          iteration: beatRepeatCount + 1,
          clue,
          location,
          atmosphericEffect,
          npc
        });
        
        gameState.narrative.pendingClueId = clue.id;
      } else {
        instructions = `
          This is a transition scene in the ${location}. The trail has gone cold for a moment.
          The world \${terminology:glitch}es violently.
          ${atmosphericEffect ? `Effect active: ${atmosphericEffect.name}.` : ""}
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

