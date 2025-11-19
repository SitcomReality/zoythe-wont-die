import { createPlayerState } from "./player-state.js";
import { createWorldState } from "./world-state.js";
import { createNarrativeState } from "./narrative-state.js";

export function createGameState({ rng }) {
  const player = createPlayerState({ rng });
  const world = createWorldState({ rng });
  const narrative = createNarrativeState();

  return {
    rng,
    player,
    world,
    narrative
  };
}

