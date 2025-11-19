import { registerCallToAdventureBeat } from "./hero-journey/call-to-adventure.js";

export function registerCoreBeats({ beatOrchestrator, eventBus, gameState }) {
  registerCallToAdventureBeat({ beatOrchestrator, eventBus, gameState });
  // Future: register mid-journey, ordeal, return, ending beats in separate small files.
}