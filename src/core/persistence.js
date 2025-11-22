import { NPC_ROLES } from "../config/constants.js";

const STORAGE_KEY = "zoythe_save_v2"; // Bump version for Phase 4/5 compatibility

function serializeMap(map) {
  if (!map) return [];
  return Array.from(map.entries());
}

function deserializeMap(entries) {
  if (!entries) return new Map();
  return new Map(entries);
}

function serializeSet(set) {
  if (!set) return [];
  return Array.from(set);
}

function deserializeSet(arr) {
  if (!arr) return new Set();
  return new Set(arr);
}

export function saveGame(gameState) {
  try {
    // Handle narrative flags that are Sets (specific to Phase 4 features)
    const narrativeFlags = { ...gameState.narrative.flags };
    if (narrativeFlags["discoveredCluesInCTA"] instanceof Set) {
      narrativeFlags["discoveredCluesInCTA"] = serializeSet(narrativeFlags["discoveredCluesInCTA"]);
    }
    if (narrativeFlags["investigationMethodsUsed"] instanceof Set) {
      narrativeFlags["investigationMethodsUsed"] = serializeSet(narrativeFlags["investigationMethodsUsed"]);
    }

    const serialized = {
      player: {
        ...gameState.player,
        relationships: serializeMap(gameState.player.relationships)
      },
      world: {
        ...gameState.world,
      },
      narrative: {
        ...gameState.narrative,
        flags: narrativeFlags
      },
      memory: gameState.memory.serialize(),
      consequenceTracker: gameState.consequenceTracker.serialize(),
      foreshadowingTracker: gameState.foreshadowingTracker
        ? gameState.foreshadowingTracker.serialize()
        : [],
      npcRoster: serializeMap(gameState.npcRoster),
      // Serialize Mystery and its new Sets/Maps
      mystery: gameState.mystery ? {
        ...gameState.mystery,
        suspects: serializeMap(gameState.mystery.suspects),
        clues: {
            ...gameState.mystery.clues,
            all: serializeMap(gameState.mystery.clues.all),
            discovered: serializeSet(gameState.mystery.clues.discovered),
            knownSuspects: serializeSet(gameState.mystery.clues.knownSuspects),
            investigationMethods: serializeSet(gameState.mystery.clues.investigationMethods || new Set()),
            usedInChoices: serializeSet(gameState.mystery.clues.usedInChoices || new Set())
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
    
    // Hydrate Narrative Sets inside Flags
    if (data.narrative && data.narrative.flags) {
      if (Array.isArray(data.narrative.flags["discoveredCluesInCTA"])) {
        data.narrative.flags["discoveredCluesInCTA"] = deserializeSet(data.narrative.flags["discoveredCluesInCTA"]);
      }
      if (Array.isArray(data.narrative.flags["investigationMethodsUsed"])) {
        data.narrative.flags["investigationMethodsUsed"] = deserializeSet(data.narrative.flags["investigationMethodsUsed"]);
      }
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
            if (data.mystery.clues.usedInChoices) {
                data.mystery.clues.usedInChoices = deserializeSet(data.mystery.clues.usedInChoices);
            } else {
                data.mystery.clues.usedInChoices = new Set();
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

