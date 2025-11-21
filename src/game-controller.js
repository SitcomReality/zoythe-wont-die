import { createGameLoop } from "./game-loop.js";

export function createGameController({ eventBus, gameState, beatOrchestrator, ui }) {
  const loop = createGameLoop({
    tick() {
      // Reserved for time-based effects; core loop is event-driven for now.
    }
  });

  eventBus.on("ui:choice:selected", choice => {
    if (!choice) return;
    beatOrchestrator.applyChoice(choice);
  });

  eventBus.on("narrative:loading", () => {
    ui.renderLoading();
  });

  eventBus.on("narrative:update", payload => {
    ui.renderText(payload);
    ui.renderHistory(payload); // Add history tracking
  });

  eventBus.on("choices:update", payload => {
    ui.renderChoices(payload);
  });

  eventBus.on("status:update", payload => {
    ui.renderStatus(payload);
  });

  function startNewGame(config) {
    const seed = config.seed ? config.seed : Date.now();
    const rng = createRng(seed);
    
    gameState = createGameState({ rng, config });
    
    // Mystery setup (primary system now)
    gameState.mystery = createMystery({ rng });
    
    const npcRoster = generateNPCRoster({ 
      rng, 
      roles: [NPC_ROLES.MENTOR, NPC_ROLES.ALLY, NPC_ROLES.ENEMY, NPC_ROLES.RIVAL] 
    });
    gameState.npcRoster = npcRoster;
    
    launchGame();
    beatOrchestrator.startIntroBeat();
  }

  function start() {
    loop.start();
    beatOrchestrator.startIntroBeat();
  }

  return { start };
}