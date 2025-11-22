import { STORY_SCOPE } from "../config/constants.js";
import { generateUniqueName } from "./name-generator.js";

const LOCATION_TYPES = {
  intimate: ["Village", "Hamlet", "Manor", "Homestead", "Crossroads", "Isle"],
  regional: ["City", "Barony", "Valley", "Port", "Stronghold", "Province"],
  national: ["Kingdom", "Empire", "Dominion", "Wastes", "Union", "Theocracy"],
  cosmic: ["Plane", "Dimension", "Sphere", "Void", "Nexus", "Reality-Shard"]
};

const THEMES = [
  "decaying", "industrializing", "fanatical", "cursed", "forgotten", 
  "overgrown", "frozen", "burning", "sunken", "floating", "clockwork",
  "bone-carved", "shadow-drenched", "crystal-grown"
];

const FACTION_TEMPLATES = [
  "a dynastic family clinging to tradition",
  "a merchant guild obsessed with profit over survival",
  "a cult worshipping the silence left by dead gods",
  "a rebel militia armed with stolen divine artifacts",
  "a bureaucracy of ghosts continuing their paperwork",
  "a circle of mages trying to hack reality"
];

const DIVINE_CONTEXTS = [
  "The local deity has been dead for weeks, but the priests are faking miracles.",
  "The corpse of a god fell nearby, warping the local flora into crystal.",
  "Gravity is failing intermittently because the god of weight was murdered.",
  "Time skips forward randomly since the god of moments perished.",
  "People have stopped aging, but they haven't stopped decaying.",
  "Two rival demigods are tearing the sky apart fighting for succession."
];

export function generateSetting({ rng, scope }) {
  // 1. Generate Name & Type
  const name = generateUniqueName(rng, new Set(), scope);
  const type = rng.pick(LOCATION_TYPES[scope] || LOCATION_TYPES.regional);
  const locationName = `The ${type} of ${name}`;

  // 2. Generate Theme/Vibe
  const theme = rng.pick(THEMES);
  const divineContext = rng.pick(DIVINE_CONTEXTS);
  
  // 3. Generate Factions (2 distinct ones)
  const faction1 = rng.pick(FACTION_TEMPLATES);
  let faction2 = rng.pick(FACTION_TEMPLATES);
  while (faction1 === faction2) {
    faction2 = rng.pick(FACTION_TEMPLATES);
  }

  // 4. Generate Synopsis & Details based on Scope
  let synopsis = "";
  let primaryLocation = locationName;
  let originLocation = "";
  let deathLocation = "";
  
  const factions = [`The ${name} Faction (${faction1})`, `The Opposition (${faction2})`];

  switch(scope) {
    case STORY_SCOPE.INTIMATE:
      synopsis = `${locationName} is a ${theme} community where everyone knows everyone. A dark secret has surfaced, pitting ${faction1} against ${faction2}. The intimacy of the setting makes the betrayal sharper.`;
      originLocation = "the house at the edge of town where the wind never stops";
      deathLocation = "the old family cellar that smells of wet earth and secrets";
      break;
      
    case STORY_SCOPE.REGIONAL:
      synopsis = `${locationName} is a ${theme} hub of trade and politics. The local leadership is crumbling under the weight of the Interregnum. ${faction1.charAt(0).toUpperCase() + faction1.slice(1)} clashes with ${faction2} for control of the streets.`;
      originLocation = "the merchant quarter, noisy and desperate";
      deathLocation = "an alleyway behind the gilded theater where the elite laugh";
      break;
      
    case STORY_SCOPE.NATIONAL:
      synopsis = `${locationName} is a vast, ${theme} power spanning the continent. The death of the gods has thrown the royal court into chaos. ${faction1.charAt(0).toUpperCase() + faction1.slice(1)} is mobilizing against ${faction2} while the borders collapse.`;
      originLocation = "a border fortress, scarred by old wars";
      deathLocation = "the grand cathedral in the capital, beneath the silent bells";
      break;
      
    case STORY_SCOPE.COSMIC:
      synopsis = `${locationName} is a ${theme} reality-shard drifting in the void. Here, the laws of physics obey the whims of dying divinities. ${faction1.charAt(0).toUpperCase() + faction1.slice(1)} fights ${faction2} for the scraps of existence.`;
      originLocation = "a memory of a world that no longer exists";
      deathLocation = "the edge of existence, looking down into nothing";
      break;
      
    default:
      synopsis = `${locationName} is a place of shadows and silence.`;
  }

  // Append Divine Context to synopsis for flavor
  synopsis += ` ${divineContext}`;

  return {
    id: `setting-${Date.now()}`,
    scope: scope || STORY_SCOPE.REGIONAL,
    name: locationName,
    type: type.toLowerCase(),
    theme,
    primaryLocation,
    originLocation,
    deathLocation,
    factions,
    divineContext,
    synopsis
  };
}