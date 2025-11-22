import { NPC_ROLES } from "../config/constants.js";

const STORAGE_KEY = "zoythe_save_v1";

function serializeMap(map) {
  return Array.from(map.entries());
}

function deserializeMap(entries) {
  return new Map(entries);
}

function serializeSet(set) {
  return Array.from(set);
}

function deserializeSet(arr) {
  return new Set(arr);
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
      },
      narrative: {
        ...gameState.narrative
      },
      memory: gameState.memory.serialize(),
      consequenceTracker: gameState.consequenceTracker.serialize(),
      npcRoster: serializeMap(gameState.npcRoster),
      // Serialize Mystery
      mystery: gameState.mystery ? {
        ...gameState.mystery,
        suspects: serializeMap(gameState.mystery.suspects),
        clues: {
            ...gameState.mystery.clues,
            all: serializeMap(gameState.mystery.clues.all),
            discovered: serializeSet(gameState.mystery.clues.discovered),
            knownSuspects: serializeSet(gameState.mystery.clues.knownSuspects),
            investigationMethods: serializeSet(gameState.mystery.clues.investigationMethods || new Set())
        }
      } : null,
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
    
    // Hydrate Mystery Maps/Sets
    if (data.mystery) {
        if (data.mystery.suspects) {
            data.mystery.suspects = deserializeMap(data.mystery.suspects);
        }
        if (data.mystery.clues) {
            if (data.mystery.clues.all) {
                data.mystery.clues.all = deserializeMap(data.mystery.clues.all);
            }
            if (data.mystery.clues.discovered) {
                data.mystery.clues.discovered = deserializeSet(data.mystery.clues.discovered);
            }
            if (data.mystery.clues.knownSuspects) {
                data.mystery.clues.knownSuspects = deserializeSet(data.mystery.clues.knownSuspects);
            }
            if (data.mystery.clues.investigationMethods) {
                data.mystery.clues.investigationMethods = deserializeSet(data.mystery.clues.investigationMethods);
            }
        }
    }

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

