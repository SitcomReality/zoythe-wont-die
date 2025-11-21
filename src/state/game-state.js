import { createPlayerState } from "./player-state.js";
import { createWorldState } from "./world-state.js";
import { createNarrativeState } from "./narrative-state.js";
import { HERO_ARCHETYPES } from "../config/constants.js";

export function createGameState({ rng, config = {} }) {
  const player = createPlayerState({ rng });
  const world = createWorldState({ rng });
  const narrative = createNarrativeState();
  
  // Apply Config Overrides
  if (config.tone) {
    world.tone = config.tone;
  }
  
  if (config.archetype) {
    player.archetype = config.archetype;
    // Boost stats relevant to archetype to ensure sticky bias
    switch(config.archetype) {
      case HERO_ARCHETYPES.EPIC: player.stats.ambition += 2; break;
      case HERO_ARCHETYPES.REDEMPTIVE: player.stats.compassion += 2; break;
      case HERO_ARCHETYPES.RELUCTANT: player.stats.doubt += 2; break;
      // etc
    }
  }
  
  if (config.railStrictness) {
    world.flags['railStrictness'] = config.railStrictness;
  }

  return {
    rng,
    player,
    world,
    narrative,
    mystery: null, // Will be populated during game initialization
    config // store initial config
  };
}

// Helper to hydrate loaded state
export function hydrateGameState(data, rng) {
  // Reconstruct method-bearing objects
  // In a real app, we'd probably use classes or prototype injection, 
  // but here we'll just re-create the closures and copy data over.
  
  const fresh = createGameState({ rng });
  
  // Deep merge data into fresh state
  Object.assign(fresh.narrative, data.narrative);
  Object.assign(fresh.world, data.world);
  Object.assign(fresh.player, data.player);
  
  // Hydrate mystery state
  if (data.mystery) {
    fresh.mystery = {
      ...data.mystery,
      suspects: new Map(data.mystery.suspects),
      clues: {
        all: new Map(data.mystery.clues.all),
        discovered: new Set(data.mystery.clues.discovered),
        knownSuspects: new Set(data.mystery.clues.knownSuspects)
      }
    };
  }
  
  // Fix nested objects if needed (e.g. stats are object, they copy fine)
  // Flags are object, copy fine.
  // Relationships (Map) should have been handled by persistence layer loading.
  
  return fresh;
}

