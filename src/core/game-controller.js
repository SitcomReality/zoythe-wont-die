import { createGameLoop } from "./game-loop.js";
import { hasSavedGame, loadGame, saveGame, clearSave } from "./persistence.js";
import { createRng } from "./rng.js";
import { createGameState, hydrateGameState } from "../state/game-state.js";
import { initBeatOrchestrator } from "../narrative/engine/beat-orchestrator.js";
import { generateMacGuffin } from "../systems/macguffin-generator.js";
import { createMystery } from "../systems/mystery-generator.js"; 
import { generateNPCRoster } from "../systems/npc-manager.js";
import { createRailroadEngine } from "../systems/railroad-engine.js";
import { registerCoreBeats } from "../narrative/beats/beat-registry.js";
import { initDesignDocHooks } from "../integration/design-doc-hooks.js";
import { NPC_ROLES } from "../config/constants.js";

export function createGameController({ eventBus, ui }) {
  let gameState = null;
  let beatOrchestrator = null;
  let loop = null;
  let autoSaveInterval = null;

  function init() {
    showMainMenu();
  }
  
  function showMainMenu() {
    if (loop) loop.stop();
    if (autoSaveInterval) clearInterval(autoSaveInterval);
    
    ui.showMainMenu({
      hasSave: hasSavedGame(),
      onContinue: continueGame,
      onNewGame: () => ui.showNewGame({ onStart: startNewGame, onCancel: showMainMenu }),
      onHistory: () => alert("Archives are sealed.") 
    });
  }

  function startNewGame(config) {
    const seed = config.seed ? config.seed : Date.now();
    const rng = createRng(seed);
    
    gameState = createGameState({ rng, config });
    
    // Legacy setup
    const macGuffinData = generateMacGuffin({ rng });
    gameState.world.homeThreat = macGuffinData.threat;
    gameState.world.primaryMacGuffin = macGuffinData.primary;
    gameState.world.backupMacGuffin = macGuffinData.backup;
    
    // Mystery setup
    gameState.mystery = createMystery({ rng });
    
    const npcRoster = generateNPCRoster({ 
      rng, 
      roles: [NPC_ROLES.MENTOR, NPC_ROLES.ALLY] 
    });
    gameState.npcRoster = npcRoster;
    
    launchGame();
    beatOrchestrator.startIntroBeat();
  }

  function continueGame() {
    const data = loadGame();
    if (!data) {
      showMainMenu();
      return;
    }
    
    const seed = data.config?.seed || Date.now(); 
    const rng = createRng(seed);
    
    gameState = hydrateGameState(data, rng);
    launchGame();
    
    // Restore UI state
    if (gameState.narrative.history.length > 0) {
        const lastEntry = gameState.narrative.history[gameState.narrative.history.length-1];
        ui.renderText({ title: lastEntry.title, body: lastEntry.body });
    } else {
        ui.renderText({ title: "...", body: "..." });
    }

    ui.renderChoices({ choices: gameState.narrative.pendingChoices });
    ui.renderHistory({ history: gameState.narrative.history, choiceHistory: gameState.narrative.choiceHistory });
    ui.renderStatus({});
    if (gameState.mystery) ui.renderDossier({ mystery: gameState.mystery });
  }

  function launchGame() {
    beatOrchestrator = initBeatOrchestrator({ eventBus, gameState, rng: gameState.rng });
    const railroadEngine = createRailroadEngine({ gameState, eventBus });
    gameState.railroadEngine = railroadEngine;
    
    registerCoreBeats({ beatOrchestrator, eventBus, gameState, rng: gameState.rng });
    initDesignDocHooks({ gameState, beatOrchestrator, eventBus });
    
    ui.showGame(gameState);
    
    loop = createGameLoop({
      tick: (ts) => { /* time based updates */ }
    });
    loop.start();
    
    autoSaveInterval = setInterval(() => {
      if(gameState) saveGame(gameState);
    }, 5000);
  }

  // Event Listeners
  eventBus.on("ui:choice:selected", choice => {
    if (!gameState || !beatOrchestrator) return;
    beatOrchestrator.applyChoice(choice);
    saveGame(gameState);
  });
  
  // Handle free-text input
  eventBus.on("ui:input:submit", text => {
    if (!gameState || !beatOrchestrator) return;
    
    // For Phase 2, we map the input to a generic "direct" choice
    // Phase 3 will add intent classification
    const pseudoChoice = {
      id: "user-input",
      label: text,
      classification: ["direct"], // Fallback
      effects: {}
    };
    
    // We pass this to the orchestrator. 
    // Note: Current orchestrator.applyChoice expects a choice object that might trigger next beat.
    // We might need to handle this carefully if the current beat doesn't know how to handle generic inputs.
    // For now, we rely on the beat's next step logic or railroad.
    
    // To make this work without breaking logic, we treat it as a valid choice.
    // The orchestrator will log it in history.
    beatOrchestrator.applyChoice(pseudoChoice);
    saveGame(gameState);
  });

  eventBus.on("ui:regenerate:beat", () => {
    if (!gameState || !beatOrchestrator) return;
    try {
      const currentSeed = Number(gameState.rng?.seed) || Date.now();
      const newSeed = Number(currentSeed) + 1;
      gameState.rng = createRng(newSeed);
      const lastBeat = gameState.narrative.lastBeatId;
      if (lastBeat) beatOrchestrator.runBeat(lastBeat);
    } catch (err) {
      console.error("Regenerate failed:", err);
    }
  });
  
  eventBus.on("narrative:update", payload => {
    ui.renderText(payload);
    ui.renderHistory({ history: gameState.narrative.history, choiceHistory: gameState.narrative.choiceHistory });
    // Also update dossier in case beat revealed clues
    if (gameState.mystery) ui.renderDossier({ mystery: gameState.mystery });
  });
  
  eventBus.on("choices:update", payload => ui.renderChoices(payload));
  eventBus.on("status:update", payload => ui.renderStatus(payload));

  return { init };
}

