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
    const context = { eventBus, gameState, rng };

    // Signal loading state to UI
    eventBus.emit("narrative:loading", { beatId: id });
    eventBus.emit("choices:update", { choices: [] }); // Clear choices while loading

    try {
      const { text, choices, phase } = await beat.enter(context);

      if (phase && phase in LOOP_PHASES) {
        gameState.narrative.phase = phase;
      }
      gameState.narrative.beatIndex += 1;
      gameState.narrative.pendingChoices = choices || [];

      // Track in history
      gameState.narrative.history.push({
        beatId: id,
        title: text.title || "",
        body: text.body || "",
        phase,
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
    const currentBeat = registry.get(gameState.narrative.lastBeatId);
    // Allow applying choices even if beat logic is simple (fallback)
    
    // Classify the choice
    const classifications = classifyChoice(choice);
    
    // Handle free-text "user-input" specifically if needed
    if (choice.id === "user-input") {
        // Inject the user's text into classification for context
        // (ChoiceClassifier handles text parsing)
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
    
    // Evaluate state after every choice
    evaluateState();
    
    // Evaluate railroad triggers
    let nextBeatId = null;
    if (gameState.railroadEngine) {
      const rails = gameState.railroadEngine.evaluateRails();
      if (rails.length > 0) {
        const rail = rails[0]; // Take the first/most severe rail
        gameState.railroadEngine.invokeRail(rail);
        
        // Railroad can override the next beat
        nextBeatId = getRailroadBeat(rail);
      }
    }

    // If no railroad override, use beat's natural progression
    if (!nextBeatId) {
      const context = { eventBus, gameState, rng };
      nextBeatId = currentBeat.applyChoice(choice, context);
    }

    if (nextBeatId) {
      runBeat(nextBeatId);
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