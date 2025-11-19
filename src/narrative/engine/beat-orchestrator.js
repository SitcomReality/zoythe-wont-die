import { LOOP_PHASES } from "../../config/constants.js";
import { classifyChoice, getChoiceDelta } from "../../systems/choice-classifier.js";

export function initBeatOrchestrator({ eventBus, gameState, rng }) {
  const registry = new Map();

  function registerBeat(id, beat) {
    registry.set(id, beat);
  }

  function startIntroBeat() {
    runBeat("heroJourney:intro:callToAdventure");
  }

  function runBeat(id) {
    const beat = registry.get(id);
    if (!beat) {
      console.warn("[beat-orchestrator] missing beat", id);
      return;
    }

    gameState.narrative.lastBeatId = id;
    const context = { eventBus, gameState, rng };
    const { text, choices, phase } = beat.enter(context);

    if (phase && phase in LOOP_PHASES) {
      gameState.narrative.phase = phase;
    }
    gameState.narrative.beatIndex += 1;
    gameState.narrative.pendingChoices = choices || [];

    eventBus.emit("narrative:update", text);
    eventBus.emit("choices:update", { choices });
    eventBus.emit("status:update", {});
  }

  function applyChoice(choice) {
    const currentBeat = registry.get(gameState.narrative.lastBeatId);
    if (!currentBeat || !currentBeat.applyChoice) return;

    // Classify the choice
    const classifications = classifyChoice(choice);
    
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
    
    // Evaluate railroad triggers
    if (gameState.railroadEngine) {
      const rails = gameState.railroadEngine.evaluateRails();
      for (const rail of rails) {
        gameState.railroadEngine.invokeRail(rail);
      }
    }

    const context = { eventBus, gameState, rng };
    const nextBeatId = currentBeat.applyChoice(choice, context);

    if (nextBeatId) {
      runBeat(nextBeatId);
    }
  }

  return {
    registerBeat,
    startIntroBeat,
    runBeat,
    applyChoice
  };
}