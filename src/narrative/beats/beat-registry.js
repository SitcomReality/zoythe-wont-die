import { registerPrologueBeat } from "./hero-journey/prologue.js";
import { registerCallToAdventureBeat } from "./hero-journey/call-to-adventure.js";
import { registerMeetingMentorBeat } from "./hero-journey/meeting-mentor.js";
import { registerRoadOfTestsBeat } from "./hero-journey/road-of-tests.js";
import { registerOrdealBeat } from "./hero-journey/ordeal.js";
import { registerRoadBackBeat } from "./hero-journey/road-back.js";
import { registerResurrectionBeat } from "./hero-journey/resurrection.js";
import { registerReturnWithElixirBeat } from "./hero-journey/return-with-elixir.js";

export function registerCoreBeats({ beatOrchestrator, eventBus, gameState, rng }) {
  registerPrologueBeat({ beatOrchestrator, gameState });
  registerCallToAdventureBeat({ beatOrchestrator, eventBus, gameState });
  registerMeetingMentorBeat({ beatOrchestrator, gameState });
  registerRoadOfTestsBeat({ beatOrchestrator, gameState, rng });
  registerOrdealBeat({ beatOrchestrator, gameState });
  registerRoadBackBeat({ beatOrchestrator, gameState });
  registerResurrectionBeat({ beatOrchestrator, gameState });
  registerReturnWithElixirBeat({ beatOrchestrator, gameState });
}

