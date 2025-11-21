import { LOOP_PHASES } from "../../config/constants.js";
import { classifyChoice, getChoiceDelta } from "../../systems/choice-classifier.js";
import { evaluateArchetype } from "../../systems/protagonist-archetype.js";
import { updateWorldTone } from "../../systems/tone-system.js";

export function initBeatOrchestrator({ eventBus, gameState, rng }) {
  const registry = new Map();

  function registerBeat(id, beat) {
    registry.set(id, beat);
  }

  function startIntroBeat() {
    runBeat("heroJourney:intro:prologue");
  }

  async function runBeat(id) {
    const beat = registry.get(id);
    if (!beat) {
      console.warn("[beat-orchestrator] missing beat", id);
      return;
    }

    gameState.narrative.lastBeatId = id;
    
    // Generate terminology context for this beat
    const { generateTerminologyContext } = await import("../../systems/terminology-thesaurus.js");
    const terminology = generateTerminologyContext(rng);
    
    const context = { 
      eventBus, 
      gameState, 
      rng, 
      terminology,
      beatRepeatCount: gameState.narrative.beatRepeatCount
    };

    // Signal loading state to UI
    eventBus.emit("narrative:loading", { beatId: id });
    eventBus.emit("choices:update", { choices: [] }); // Clear choices while loading

    try {
      const { text, choices, phase } = await beat.enter(context);

      if (phase && phase in LOOP_PHASES) {
        gameState.narrative.phase = phase;
      }
      
      // Only increment beatIndex when actually moving to a new beat
      if (gameState.narrative.lastBeatId !== id) {
        gameState.narrative.beatIndex += 1;
      }
      
      gameState.narrative.pendingChoices = choices || [];

      // Track in history
      gameState.narrative.history.push({
        beatId: id,
        title: text.title || "",
        body: text.body || "",
        phase,
        repeatCount: gameState.narrative.beatRepeatCount,
        timestamp: Date.now()
      });

      eventBus.emit("narrative:update", text);
      eventBus.emit("choices:update", { choices });
      eventBus.emit("history:update", { history: gameState.narrative.history });
      eventBus.emit("status:update", {});

    } catch (error) {
      console.error("[beat-orchestrator] beat execution failed", error);
      eventBus.emit("narrative:update", { 
        title: "The Weave Snaps", 
        body: "The threads of fate have tangled. (Generation Error)" 
      });
    }
  }

  function evaluateState() {
    const { player, world } = gameState;
    
    // Update archetype based on current stats
    const newArchetype = evaluateArchetype({ player });
    if (newArchetype !== player.archetype) {
      player.archetype = newArchetype;
      eventBus.emit("archetype:changed", { archetype: newArchetype });
    }
    
    // Update world tone
    updateWorldTone({ world, player });
    
    // Emit state update
    eventBus.emit("status:update", {});
  }

  function applyChoice(choice) {
    const currentBeatId = gameState.narrative.lastBeatId;
    const currentBeat = registry.get(currentBeatId);
    
    // Classify the choice
    const classifications = classifyChoice(choice);
    
    // Handle free-text "user-input" specifically if needed
    if (choice.id === "user-input") {
        console.log(`[Orchestrator] Processing user input: "${choice.label}" -> ${classifications.join(", ")}`);
    }

    // Get combined delta from explicit effects and inferred effects
    const delta = getChoiceDelta(choice, classifications);
    
    // Apply delta to state
    if (delta.player) {
      gameState.player.applyDelta(delta.player);
    }
    if (delta.world) {
      gameState.world.applyDelta(delta.world);
    }
    
    // Track choice in history
    gameState.narrative.addChoice(choice, classifications);
    
    // Check for refusals
    if (classifications.includes("refuseQuest")) {
      gameState.narrative.incrementRefusal();
    } else {
      // Non-refusal choice: still increment urgency if staying in beat
      gameState.narrative.incrementBeatRepeatCount();
    }
    
    // Evaluate state after every choice
    evaluateState();
    
    // Determine next beat
    let nextBeatId = null;
    let shouldForceAdvance = false;

    // Check if urgency threshold reached
    if (gameState.narrative.urgencyLevel >= gameState.narrative.urgencyThreshold) {
      shouldForceAdvance = true;
      console.log(`[Orchestrator] Urgency threshold reached (${gameState.narrative.urgencyLevel}). Forcing advancement.`);
    }

    // If urgency forcing advancement or beat logic returns a nextBeat, advance
    if (!shouldForceAdvance && currentBeat) {
      const context = { eventBus, gameState, rng };
      nextBeatId = currentBeat.applyChoice(choice, context);
    } else if (shouldForceAdvance && currentBeat) {
      // Even if beat doesn't want to advance, forced railroading applies
      const context = { eventBus, gameState, rng };
      nextBeatId = currentBeat.applyChoice(choice, context);
      // If beat still doesn't return next, we need a default fallback
      if (!nextBeatId) {
        console.warn(`[Orchestrator] Forced advancement but beat ${currentBeatId} has no applyChoice logic. Staying in beat.`);
      }
    }

    // If returning to same beat, increment repeat count
    if (!nextBeatId || nextBeatId === currentBeatId) {
      gameState.narrative.incrementBeatRepeatCount();
    } else {
      // Moving to new beat: reset repeat count and urgency
      gameState.narrative.resetBeatRepeatCount();
      gameState.narrative.beatIndex += 1;
    }

    if (nextBeatId) {
      runBeat(nextBeatId);
    } else {
      // Stay in current beat but re-run it with updated repeat count
      // This lets the beat provide new content for repeated iterations
      gameState.narrative.incrementBeatRepeatCount();
      runBeat(currentBeatId);
    }
  }

  function getRailroadBeat(rail) {
    // Map railroad types to forced beats
    const railroadMap = {
      "forced-departure": "heroJourney:intro:meetingMentor",
      "urgent-crisis": "heroJourney:tests:urgentTrial",
      "divine-curse": "heroJourney:tests:cursedTrial"
    };
    
    return railroadMap[rail.type] || null;
  }

  return {
    registerBeat,
    startIntroBeat,
    runBeat,
    applyChoice,
    evaluateState
  };
}