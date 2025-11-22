import { selectTrait } from "./trait-library.js";

export const DEATH_SCENARIOS = {
  WEAPON_EMBEDDED: "weaponEmbedded",
  FALL: "fall",
  POISON: "poison",
  DROWNING: "drowning",
  RITUAL: "ritual",
  STRANGLING: "strangling",
  BURNING: "burning",
  DIVINE_DISSOLUTION: "divineDissolution"
};

const SCENARIO_DETAILS = {
  [DEATH_SCENARIOS.WEAPON_EMBEDDED]: {
    name: "Weapon Embedded",
    initialVisibility: "immediate",
    weaponVisible: true,
    methodVisible: true,
    description: "A weapon protrudes from your body. The manner of death is brutally clear.",
    investigationLevel: 0,
    possibleWeapons: ["dagger", "blade", "spear", "arrow"],
    cluePatterns: ["physical-weapon", "blood-trail"],
    locations: ["chamber", "hall", "throne-room", "courtyard"]
  },
  [DEATH_SCENARIOS.FALL]: {
    name: "Fall",
    initialVisibility: "partial",
    weaponVisible: false,
    methodVisible: false,
    description: "Your body lies broken at the bottom. A long fall, perhaps. But who pushed?",
    investigationLevel: 1,
    possibleWeapons: null, // No weapon, method is the fall itself
    cluePatterns: ["positional", "height-evidence", "hands"],
    locations: ["tower", "cliff", "bridge", "high-place"],
    discoveryPath: "Examine the surroundings to reveal fall signs."
  },
  [DEATH_SCENARIOS.POISON]: {
    name: "Poison",
    initialVisibility: "hidden",
    weaponVisible: false,
    methodVisible: false,
    description: "Your body is intact but strange. No obvious wound. The cause of death remains mysterious.",
    investigationLevel: 2,
    possibleWeapons: ["poison", "toxin", "venom", "elixir"],
    cluePatterns: ["botanical", "taste", "residue"],
    locations: ["feast-hall", "apothecary", "garden", "cellar"],
    discoveryPath: "Investigate your body closely to discover poison or toxins."
  },
  [DEATH_SCENARIOS.DROWNING]: {
    name: "Drowning",
    initialVisibility: "partial",
    weaponVisible: false,
    methodVisible: false,
    description: "Water fills your lungs. Your body floats in an impossible space.",
    investigationLevel: 1,
    possibleWeapons: null,
    cluePatterns: ["water-evidence", "recovery-items", "salt-marks"],
    locations: ["river", "well", "lake", "chamber-with-water"],
    discoveryPath: "Examine the water and surroundings for clues to drowning."
  },
  [DEATH_SCENARIOS.RITUAL]: {
    name: "Ritual",
    initialVisibility: "immediate",
    weaponVisible: true,
    methodVisible: true,
    description: "You lie in the center of a sacred geometry. Symbols burned into the floor. This was deliberate.",
    investigationLevel: 0,
    possibleWeapons: ["ritual-dagger", "ceremonial-blade"],
    cluePatterns: ["symbolic", "ritualistic", "divine-resonance"],
    locations: ["temple", "sanctum", "altar", "circle"],
    discoveryPath: "The ritual nature is obvious; clues lie in the details."
  },
  [DEATH_SCENARIOS.STRANGLING]: {
    name: "Strangling",
    initialVisibility: "partial",
    weaponVisible: false,
    methodVisible: false,
    description: "Marks around your neck. Bruises on your wrists. A struggle, quickly overcome.",
    investigationLevel: 1,
    possibleWeapons: ["rope", "cord", "hands", "cloth"],
    cluePatterns: ["neck-marks", "struggle-signs", "fiber-evidence"],
    locations: ["chamber", "alcove", "dark-place", "isolation"],
    discoveryPath: "Examine the marks closely; fiber evidence or residue may reveal the weapon."
  },
  [DEATH_SCENARIOS.BURNING]: {
    name: "Burning",
    initialVisibility: "partial",
    weaponVisible: false,
    methodVisible: false,
    description: "Charred flesh. The acrid smell of burning. Yet the fire did not consume you entirely.",
    investigationLevel: 1,
    possibleWeapons: ["fire", "flame", "alchemical-reagent"],
    cluePatterns: ["char-patterns", "burn-source", "ash-residue"],
    locations: ["furnace", "pyre", "alchemical-chamber", "ritual-fire"],
    discoveryPath: "Investigate the burn patterns to find clues to the fire's source."
  },
  [DEATH_SCENARIOS.DIVINE_DISSOLUTION]: {
    name: "Divine Dissolution",
    initialVisibility: "immediate",
    weaponVisible: true,
    methodVisible: true,
    description: "Reality itself seems fractured around you. Your edges blur into the void. Divine unmade you.",
    investigationLevel: 0,
    possibleWeapons: ["divine-word", "god-touch", "cosmic-weapon"],
    cluePatterns: ["divine-resonance", "void-echo", "celestial-scar"],
    locations: ["god-space", "void-realm", "celestial-chamber", "reality-fold"],
    discoveryPath: "The divine method is evident; investigation reveals the killer's identity."
  }
};

const LOCATION_POOLS = {
  intimate: [
    "your bedroom", "the family hearth", "the garden wall", "the well",
    "the cellar", "the attic", "the back room"
  ],
  regional: [
    "the temple square", "the marketplace", "the manor grounds", "the bridge",
    "the tavern", "the priest's chamber", "the town hall"
  ],
  national: [
    "the throne room", "the palace grounds", "the cathedral", "the war room",
    "the royal garden", "the fortress tower", "the council chamber"
  ],
  cosmic: [
    "the celestial sanctum", "the void between worlds", "the god's chamber",
    "the astral plane", "the divine throne", "the reality fracture", "the cosmic stage"
  ]
};

/**
 * Generate a death scenario for a mystery
 * @param {Object} rng - RNG instance
 * @param {string} scope - Story scope (intimate, regional, national, cosmic)
 * @returns {Object} Death scenario with all details
 */
export function generateDeathScenario({ rng, scope = "regional" }) {
  // Pick random scenario type
  const scenarioType = rng.pick(Object.values(DEATH_SCENARIOS));
  const details = SCENARIO_DETAILS[scenarioType];

  // Pick location based on scope
  const locationPool = LOCATION_POOLS[scope] || LOCATION_POOLS.regional;
  const location = rng.pick(locationPool);

  // Generate weapon if applicable
  let weapon = null;
  if (details.possibleWeapons && details.possibleWeapons.length > 0) {
    weapon = rng.pick(details.possibleWeapons);
  }

  return {
    type: scenarioType,
    name: details.name,
    location,
    initialVisibility: details.initialVisibility,
    weaponVisible: details.weaponVisible,
    methodVisible: details.methodVisible,
    methodDescription: details.description,
    investigationLevel: details.investigationLevel,
    weapon,
    cluePatterns: details.cluePatterns,
    discoveryPath: details.discoveryPath || null,
    baseWeapon: details.possibleWeapons ? rng.pick(details.possibleWeapons) : null
  };
}

/**
 * Get all available death scenario types
 * @returns {string[]}
 */
export function getScenarioTypes() {
  return Object.values(DEATH_SCENARIOS);
}

/**
 * Get details for a specific scenario type
 * @param {string} type - Scenario type
 * @returns {Object}
 */
export function getScenarioDetails(type) {
  return SCENARIO_DETAILS[type] || null;
}

/**
 * Check if scenario type requires investigation to reveal method
 * @param {string} type - Scenario type
 * @returns {boolean}
 */
export function requiresInvestigation(type) {
  const details = SCENARIO_DETAILS[type];
  return details && details.investigationLevel > 0;
}