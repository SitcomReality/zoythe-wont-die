import { createEventBus } from "./core/event-bus.js";
import { createRng } from "./core/rng.js";
import { createGameState } from "./state/game-state.js";
import { createGameController } from "./core/game-controller.js";
import { mountLayout } from "./ui/layout.js";
import { initBeatOrchestrator } from "./narrative/engine/beat-orchestrator.js";
import { registerCoreBeats } from "./narrative/beats/beat-registry.js";
import { initDesignDocHooks } from "./integration/design-doc-hooks.js";
import { generateMacGuffin } from "./systems/macguffin-generator.js";
import { generateNPCRoster } from "./systems/npc-manager.js";
import { createRailroadEngine } from "./systems/railroad-engine.js";
import { NPC_ROLES } from "./config/constants.js";

const eventBus = createEventBus();
const rng = createRng();
const gameState = createGameState({ rng });

// Generate initial MacGuffin and threat
const macGuffinData = generateMacGuffin({ rng });
gameState.world.homeThreat = macGuffinData.threat;
gameState.world.primaryMacGuffin = macGuffinData.primary;
gameState.world.backupMacGuffin = macGuffinData.backup;

// Generate initial NPC roster
const npcRoster = generateNPCRoster({ 
  rng, 
  roles: [NPC_ROLES.MENTOR, NPC_ROLES.ALLY] 
});
gameState.npcRoster = npcRoster;

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

const railroadEngine = createRailroadEngine({ gameState, eventBus });
gameState.railroadEngine = railroadEngine;

registerCoreBeats({ beatOrchestrator, eventBus, gameState, rng });
initDesignDocHooks({ gameState, beatOrchestrator, eventBus });

const controller = createGameController({
  eventBus,
  gameState,
  beatOrchestrator,
  ui
});

controller.start();

