import { createEventBus } from "./core/event-bus.js";
import { createRng } from "./core/rng.js";
import { createGameState } from "./state/game-state.js";
import { createGameController } from "./core/game-controller.js";
import { mountLayout } from "./ui/layout.js";
import { initBeatOrchestrator } from "./narrative/engine/beat-orchestrator.js";
import { registerCoreBeats } from "./narrative/beats/beat-registry.js";
import { initDesignDocHooks } from "./integration/design-doc-hooks.js";

const eventBus = createEventBus();
const rng = createRng();
const gameState = createGameState({ rng });

const ui = mountLayout({
  statusRoot: document.getElementById("ui-status"),
  textRoot: document.getElementById("ui-text"),
  choicesRoot: document.getElementById("ui-choices"),
  eventBus,
  gameState
});

const beatOrchestrator = initBeatOrchestrator({
  eventBus,
  gameState,
  rng
});

registerCoreBeats({ beatOrchestrator, eventBus, gameState });
initDesignDocHooks({ gameState, beatOrchestrator, eventBus });

const controller = createGameController({
  eventBus,
  gameState,
  beatOrchestrator,
  ui
});

controller.start();

