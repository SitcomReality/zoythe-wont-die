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

  function start() {
    loop.start();
    beatOrchestrator.startIntroBeat();
  }

  return { start };
}