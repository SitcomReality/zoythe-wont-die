import { NPC_ROLES } from "../config/constants.js";

const STORAGE_KEY = "zoythe_save_v1";

function serializeMap(map) {
  return Array.from(map.entries());
}

function deserializeMap(entries) {
  return new Map(entries);
}

export function saveGame(gameState) {
  try {
    const serialized = {
      player: {
        ...gameState.player,
        relationships: serializeMap(gameState.player.relationships)
      },
      world: {
        ...gameState.world,
        // activeEffects might be complex objects, but they are likely POJOs from generators
      },
      narrative: {
        ...gameState.narrative
      },
      npcRoster: serializeMap(gameState.npcRoster),
      timestamp: Date.now()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized));
    return true;
  } catch (e) {
    console.error("Failed to save game:", e);
    return false;
  }
}

export function loadGame() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const data = JSON.parse(raw);

    // Hydrate Maps
    if (data.player && data.player.relationships) {
      data.player.relationships = deserializeMap(data.player.relationships);
    }
    if (data.npcRoster) {
      data.npcRoster = deserializeMap(data.npcRoster);
    }

    // Re-attach methods (hydration) is tricky in FP. 
    // We will rely on state-creation functions to re-wrap these data objects 
    // or designing the state system to accept plain objects as initial state.
    // For now, we'll return the raw data and let the GameController handle hydration/merging.
    return data;
  } catch (e) {
    console.error("Failed to load game:", e);
    return null;
  }
}

export function hasSavedGame() {
  return !!localStorage.getItem(STORAGE_KEY);
}

export function clearSave() {
  localStorage.removeItem(STORAGE_KEY);
}