import { createPlayerState } from "./player-state.js";
import { createWorldState } from "./world-state.js";
import { createNarrativeState } from "./narrative-state.js";
import { HERO_ARCHETYPES, STORY_SCOPE } from "../config/constants.js";
import { createMemoryContext } from "./memory-context.js";
import { createConsequenceTracker } from "../systems/consequence-tracker.js";
import { createForeshadowingTracker } from "../systems/foreshadowing-tracker.js";

export function createGameState({ rng, config = {} }) {
  const player = createPlayerState({ rng });
  const world = createWorldState({ rng });
  const narrative = createNarrativeState();
  const memory = createMemoryContext();
  const consequenceTracker = createConsequenceTracker();
  const foreshadowingTracker = createForeshadowingTracker();
  
  // Apply Config Overrides
  if (config.tone) {
    world.tone = config.tone;
  }
  
  // Apply scope (default to random if not provided)
  if (config.scope) {
    world.scope = config.scope;
  } else {
    // Pick random scope if none provided
    const scopes = Object.values(STORY_SCOPE);
    world.scope = rng.pick(scopes);
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
    memory,
    consequenceTracker,
    foreshadowingTracker,
    mystery: null, // Initialize mystery slot
    config // store initial config
  };
}

// Helper to hydrate loaded state
export function hydrateGameState(data, rng) {
  // Reconstruct method-bearing objects
  
  const fresh = createGameState({ rng });
  
  // Deep merge data into fresh state
  Object.assign(fresh.narrative, data.narrative);
  Object.assign(fresh.world, data.world);
  Object.assign(fresh.player, data.player);
  
  // Hydrate memory
  if (data.memory) {
    fresh.memory.deserialize(data.memory);
  }
  
  // Hydrate consequences
  if (data.consequenceTracker) {
    fresh.consequenceTracker.deserialize(data.consequenceTracker);
  }
  
  // Hydrate foreshadowing
  if (data.foreshadowingTracker) {
    fresh.foreshadowingTracker.deserialize(data.foreshadowingTracker);
  }
  
  // Hydrate mystery if present
  if (data.mystery) {
    fresh.mystery = data.mystery;
  }
  
  return fresh;
}

