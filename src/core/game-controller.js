import { createGameLoop } from "./game-loop.js";
import { hasSavedGame, loadGame, saveGame, clearSave } from "./persistence.js";
import { createRng } from "./rng.js";
import { createGameState, hydrateGameState } from "../state/game-state.js";
import { initBeatOrchestrator } from "../narrative/engine/beat-orchestrator.js";
import { generateMacGuffin } from "../systems/macguffin-generator.js";
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
    
    // Hook up generic UI events that don't depend on specific game state instances
    // (or delegate them dynamically)
  }
  
  function showMainMenu() {
    if (loop) loop.stop();
    if (autoSaveInterval) clearInterval(autoSaveInterval);
    
    ui.showMainMenu({
      hasSave: hasSavedGame(),
      onContinue: continueGame,
      onNewGame: () => ui.showNewGame({ onStart: startNewGame, onCancel: showMainMenu }),
      onHistory: () => alert("Archives of previous timelines are currently sealed by the Interregnum.") // Placeholder
    });
  }

  function startNewGame(config) {
    const seed = config.seed ? config.seed : Date.now();
    const rng = createRng(seed);
    
    gameState = createGameState({ rng, config });
    
    // Procedural Gen Setup
    const macGuffinData = generateMacGuffin({ rng });
    gameState.world.homeThreat = macGuffinData.threat;
    gameState.world.primaryMacGuffin = macGuffinData.primary;
    gameState.world.backupMacGuffin = macGuffinData.backup;
    
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
    
    // Re-init RNG from saved state if we saved seed, or generic
    // Ideally we save seed in gameState.config or similar
    const seed = data.config?.seed || Date.now(); 
    const rng = createRng(seed);
    
    gameState = hydrateGameState(data, rng);
    launchGame();
    
    // Resume UI
    ui.renderText({ 
      title: gameState.narrative.history[gameState.narrative.history.length-1]?.title || "Resuming...", 
      body: gameState.narrative.history[gameState.narrative.history.length-1]?.body || "..."
    });
    ui.renderChoices({ choices: gameState.narrative.pendingChoices });
    ui.renderHistory({ history: gameState.narrative.history });
    ui.renderStatus({});
  }

  function launchGame() {
    // Setup Systems
    beatOrchestrator = initBeatOrchestrator({ eventBus, gameState, rng: gameState.rng });
    const railroadEngine = createRailroadEngine({ gameState, eventBus });
    gameState.railroadEngine = railroadEngine;
    
    registerCoreBeats({ beatOrchestrator, eventBus, gameState, rng: gameState.rng });
    initDesignDocHooks({ gameState, beatOrchestrator, eventBus });
    
    // Wire up events specific to this session
    // Note: We need to be careful not to duplicate listeners if we restart
    // For simplicity, eventBus clears listeners or we manage unique handlers.
    // In this simple bus implementation, we might need to clear old listeners?
    // Current eventBus doesn't support clearAll. 
    // We'll assume simple handlers for now.
    
    ui.showGame(gameState);
    
    // Start Loop
    loop = createGameLoop({
      tick: (ts) => { /* time based updates */ }
    });
    loop.start();
    
    // Auto-save on beat completion/choice
    autoSaveInterval = setInterval(() => {
      if(gameState) saveGame(gameState);
    }, 5000);
  }

  // Global Event Listeners
  eventBus.on("ui:choice:selected", choice => {
    if (!gameState || !beatOrchestrator) return;
    beatOrchestrator.applyChoice(choice);
    saveGame(gameState); // Save on turn
  });
  
  eventBus.on("narrative:update", payload => {
    ui.renderText(payload);
    ui.renderHistory({ history: gameState.narrative.history });
  });
  
  eventBus.on("choices:update", payload => ui.renderChoices(payload));
  eventBus.on("status:update", payload => ui.renderStatus(payload));

  return { init };
}

