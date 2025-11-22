import { STORY_SCOPE } from "../config/constants.js";
import { generateUniqueName } from "./name-generator.js";

const LOCATION_TYPES = {
  intimate: ["Village", "Hamlet", "Manor", "Homestead", "Crossroads"],
  regional: ["City", "Barony", "Valley", "Port", "Stronghold"],
  national: ["Kingdom", "Empire", "Dominion", "Wastes", "Union"],
  cosmic: ["Plane", "Dimension", "Sphere", "Void", "Nexus"]
};

const THEMES = [
  "decaying", "industrializing", "fanatical", "cursed", "forgotten", 
  "overgrown", "frozen", "burning", "sunken", "floating"
];

export function generateSetting({ rng, scope }) {
  // 1. Generate Name
  const name = generateUniqueName(rng, new Set(), scope);
  const type = rng.pick(LOCATION_TYPES[scope] || LOCATION_TYPES.regional);
  const locationName = `The ${type} of ${name}`;

  // 2. Generate Theme/Vibe
  const theme = rng.pick(THEMES);
  
  // 3. Generate Synopsis
  let synopsis = "";
  let factions = [];
  let primaryLocation = locationName;
  let originLocation = "";
  let deathLocation = "";

  switch(scope) {
    case STORY_SCOPE.INTIMATE:
      synopsis = `${locationName} is a ${theme} community where everyone knows everyone. A dark secret has recently surfaced, turning neighbors against one another.`;
      originLocation = "the house at the edge of town";
      deathLocation = "the old family cellar";
      break;
    case STORY_SCOPE.REGIONAL:
      synopsis = `${locationName} is a ${theme} hub of trade and politics. The local leadership is crumbling under the weight of the Interregnum, and rival factions are vying for control.`;
      originLocation = "the merchant quarter";
      deathLocation = "an alleyway behind the gilded theater";
      factions = ["The Town Council", "The Shadow Guild"];
      break;
    case STORY_SCOPE.NATIONAL:
      synopsis = `${locationName} is a vast, ${theme} power spanning the continent. The death of the gods has thrown the royal court into chaos, and armies are mobilizing.`;
      originLocation = "a border fortress";
      deathLocation = "the grand cathedral in the capital";
      break;
    case STORY_SCOPE.COSMIC:
      synopsis = `${locationName} is a ${theme} reality-shard drifting in the void. Here, the laws of physics obey the whims of dying divinities.`;
      originLocation = "a memory of earth";
      deathLocation = "the edge of existence";
      break;
    default:
      synopsis = `${locationName} is a place of shadows and silence.`;
  }

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
    synopsis
  };
}