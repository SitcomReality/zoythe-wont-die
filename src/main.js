import { createEventBus } from "./core/event-bus.js";
import { createGameController } from "./core/game-controller.js";
import { mountLayout } from "./ui/layout.js";

// Initialize core infrastructure
const eventBus = createEventBus();

// Mount UI skeleton
const ui = mountLayout({
  rootSelector: "#app-root",
  eventBus
});

// Initialize Controller
const controller = createGameController({
  eventBus,
  ui
});

// Start Application
controller.init();

