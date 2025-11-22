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
    
    // Get previous page and choice for continuity
    const previousPage = gameState.narrative.history.length > 0 
      ? gameState.narrative.history[gameState.narrative.history.length - 1]
      : null;
    const previousChoice = gameState.narrative.choiceHistory.length > 0
      ? gameState.narrative.choiceHistory[gameState.narrative.choiceHistory.length - 1].choice
      : null;
    
    const context = { 
      eventBus, 
      gameState, 
      rng, 
      terminology,
      beatRepeatCount: gameState.narrative.beatRepeatCount,
      previousPage,
      previousChoice
    };

    // --- NEW: expose the prompt context for debugging / dev UI ---
    try {
      // We do not expose the whole gameState object (methods etc.) — serialize the useful parts
      const serializable = {
        player: {
          archetype: gameState.player.archetype,
          heroism: gameState.player.heroism,
          stats: gameState.player.stats,
        },
        world: {
          tone: gameState.world.tone,
          tags: gameState.world.tags
        },
        narrative: {
          beatRepeatCount: gameState.narrative.beatRepeatCount,
          urgencyLevel: gameState.narrative.urgencyLevel,
          flags: gameState.narrative.flags
        },
        mystery: gameState.mystery ? {
          twist: gameState.mystery.twist,
          weapon: gameState.mystery.weapon,
          killerId: gameState.mystery.killerId,
          progress: gameState.mystery.progress
        } : null,
        terminology,
        previousPage: previousPage ? { title: previousPage.title, body: previousPage.body } : null,
        previousChoice: previousChoice ? { label: previousChoice.label, id: previousChoice.id } : null,
        beatId: id
      };

      eventBus.emit("prompt:context", serializable);
    } catch (err) {
      console.warn("[beat-orchestrator] failed to emit prompt context", err);
    }
    // --- END NEW ---
    
    // Signal loading state to UI
    eventBus.emit("narrative:loading", { beatId: id });
    eventBus.emit("choices:update", { choices: [] }); // Clear choices while loading

    try {
      const result = await beat.enter(context);
      const { text, choices, phase, shouldAdvance } = result;

      if (phase && phase in LOOP_PHASES) {
        gameState.narrative.phase = phase;
      }
      
      // Store shouldAdvance recommendation from AI
      gameState.narrative.aiShouldAdvance = shouldAdvance !== undefined ? shouldAdvance : true;
      
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
    }
    
    // Register consequences if they exist in choice
    if (choice.consequences && gameState.consequenceTracker) {
      for (const consequence of choice.consequences) {
        gameState.consequenceTracker.registerConsequence({
          id: `${choice.id}-consequence-${Date.now()}`,
          type: consequence.type,
          sourceChoice: choice.id,
          sourceBeat: currentBeatId,
          description: consequence.description,
          triggerBeat: consequence.triggerBeat || null,
          triggerCondition: consequence.triggerCondition || null,
          manifestation: consequence.manifestation || null,
          severity: consequence.severity || "minor",
          relatedNpc: consequence.relatedNpc || null,
          relatedClue: consequence.relatedClue || null,
          chainNext: consequence.chainNext || null
        });
      }
    }
    
    // Evaluate state after every choice
    evaluateState();
    
    // Determine next beat based on AI recommendation and urgency
    let nextBeatId = null;
    const aiShouldAdvance = gameState.narrative.aiShouldAdvance !== undefined 
      ? gameState.narrative.aiShouldAdvance 
      : true;
    const urgencyForced = gameState.narrative.urgencyLevel >= gameState.narrative.urgencyThreshold;

    // Get beat's desired next beat
    if (currentBeat && currentBeat.applyChoice) {
      const context = { eventBus, gameState, rng };
      nextBeatId = currentBeat.applyChoice(choice, context);
    }

    // Decision logic:
    // 1. If urgency threshold reached, MUST advance (overrides AI and beat)
    // 2. If AI says don't advance (shouldAdvance=false), stay in beat UNLESS urgency forces
    // 3. If AI says advance (shouldAdvance=true), use beat's nextBeatId or stay

    if (urgencyForced) {
      // Urgency forces advancement
      console.log(`[Orchestrator] Urgency forcing advancement (${gameState.narrative.urgencyLevel}/${gameState.narrative.urgencyThreshold})`);
      // If beat didn't provide next, force it anyway (or keep nextBeatId if it exists)
      if (!nextBeatId) {
        console.warn(`[Orchestrator] Urgency forcing but no next beat defined. Staying in ${currentBeatId}.`);
      }
    } else if (!aiShouldAdvance) {
      // AI wants to stay in current beat for more exploration
      console.log(`[Orchestrator] AI recommends staying in beat for narrative flow.`);
      nextBeatId = null; // Override any beat transition
    }

    // If returning to same beat or no next beat, increment repeat count
    if (!nextBeatId || nextBeatId === currentBeatId) {
      gameState.narrative.incrementBeatRepeatCount();
      gameState.narrative.incrementBeatRepeatCount(); // Increment urgency too
    } else {
      // Moving to new beat: reset repeat count and urgency
      gameState.narrative.resetBeatRepeatCount();
      gameState.narrative.beatIndex += 1;
    }

    if (nextBeatId) {
      runBeat(nextBeatId);
    } else {
      // Stay in current beat but re-run it with updated repeat count
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