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
    locations: ["chamber", "hall", "throne-room", "courtyard"],
    hiddenAspects: [
      "Who wielded the weapon",
      "The weapon's origin or history",
      "Defensive wounds that might indicate struggle",
      "Bloodstain pattern details"
    ],
    investigationActions: [
      "Examine the weapon closely",
      "Check hands/arms for defensive wounds",
      "Analyze blood patterns",
      "Ask who last touched the weapon"
    ],
    clueRules: "Weapon type and positioning provide immediate clues. Blood analysis requires investigation. Defensive wounds surface upon corpse examination.",
    weaponMethodRelation: "Weapon is both method and primary evidence. Killer cannot hide the weapon; must rely on alibi or misdirection.",
    discoveryPath: null
  },

  [DEATH_SCENARIOS.FALL]: {
    name: "Fall",
    initialVisibility: "partial",
    weaponVisible: false,
    methodVisible: false,
    description: "Your body lies broken at the bottom. A long fall, perhaps. But who pushed?",
    investigationLevel: 1,
    possibleWeapons: null,
    cluePatterns: ["positional", "height-evidence", "hands"],
    locations: ["tower", "cliff", "bridge", "high-place"],
    hiddenAspects: [
      "Whether fall was accidental or intentional",
      "Height fallen from",
      "Push marks or signs of struggle at fall point",
      "Motive for murder vs accident"
    ],
    investigationActions: [
      "Examine location above (where you fell from)",
      "Look for scuff marks or struggle signs",
      "Check if you have climbing gear or wounds suggesting struggle",
      "Ask about who was near the high place",
      "Find witnesses to the actual moment"
    ],
    clueRules: "Position of body relative to cliff/tower suggests height. Broken bones indicate fall distance. Bruises on arms suggest defensive struggle.",
    weaponMethodRelation: "No weapon—gravity is method. Killer must push or trick victim to edge. Physical evidence includes body position and location details.",
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
    hiddenAspects: [
      "That poison was used at all",
      "Type of poison (plant, mineral, alchemical)",
      "How poison was administered (food, drink, skin contact)",
      "Symptoms of poisoning on corpse",
      "Who had access to poison source"
    ],
    investigationActions: [
      "Examine your body for discoloration or smell",
      "Check mouth/lips for residue",
      "Ask about last meal or drink",
      "Search for poison source in location",
      "Smell the air for botanical clues",
      "Find remnants of food/drink you consumed"
    ],
    clueRules: "Poison victim shows no obvious wound. Residue/color/smell clues only surface with direct corpse investigation. Food/drink remnants are primary evidence.",
    weaponMethodRelation: "Poison is both weapon and method, but invisible. Killer needs access to victim's food/drink and knowledge of poison. No physical evidence at murder site unless poison container left behind.",
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
    hiddenAspects: [
      "Whether you fell in or were held under",
      "Duration underwater",
      "Restraints or weights holding you down",
      "Who was present when you entered water",
      "Whether you could swim"
    ],
    investigationActions: [
      "Check lungs/mouth for water type (fresh, salt, magical)",
      "Look for rope marks on wrists/ankles",
      "Search for weights or stones in pockets",
      "Examine location for entry point",
      "Ask who knew you'd be near water",
      "Find witnesses to your entry into water"
    ],
    clueRules: "Water in lungs confirms drowning. Rope marks indicate restraint/foul play. Heavy items in pockets suggest intentional drowning. Water type narrows location.",
    weaponMethodRelation: "Water is method. Weapon might be rope/weights to keep victim submerged. Killer requires physical strength or elaborate setup.",
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
    hiddenAspects: [
      "The ritual's true purpose",
      "Who performed the ritual",
      "What power was sought or bargained for",
      "Whether you were willing or unwilling sacrifice",
      "Ritual completion status"
    ],
    investigationActions: [
      "Decipher the ritual symbols",
      "Ask knowledgeable NPCs about ritual meaning",
      "Look for ritual implements or ingredients",
      "Find references to ritual in texts or scrolls",
      "Ask who has knowledge of such rituals",
      "Examine weapon for ritual markings"
    ],
    clueRules: "Ritual setup is obvious; killer wants ritual known. Symbols point to specific deity/faction. Ritual ingredients and tools scattered nearby. Weapon bears ritual marks.",
    weaponMethodRelation: "Ritual dagger/blade is both instrument and signature. Killer's knowledge of ritual is the real clue. Weapon identifies killer's faction or religious affiliation.",
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
    hiddenAspects: [
      "What was used to strangle (hands, rope, cloth)",
      "Whether victim fought back",
      "Duration of strangling",
      "Physical strength required (suggests killer type)",
      "Why no one heard struggle"
    ],
    investigationActions: [
      "Examine marks on neck for pattern (rope vs hands)",
      "Look for fiber evidence (wool, silk, hemp)",
      "Check fingers/nails for attacker's skin/blood",
      "Look for broken furniture or signs of struggle",
      "Find the murder weapon (rope/cloth) if discarded",
      "Ask about who is strong enough for this"
    ],
    clueRules: "Neck marks reveal weapon type (hands = unique fingerprints possible, rope = fiber type). Fiber evidence is critical. Attacker's scratches/blood on victim's nails.",
    weaponMethodRelation: "Weapon is cord/rope or killer's own hands. Hands leave unique marks; rope leaves fiber evidence. Killer needs physical proximity and strength.",
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
    hiddenAspects: [
      "Heat source (forge, alchemical flame, magic)",
      "Whether burned alive or post-mortem",
      "Type of fire/fuel used",
      "How long body was burned",
      "Access to fire source"
    ],
    investigationActions: [
      "Examine char pattern (where hottest)",
      "Identify ash residue type",
      "Look for alchemical remnants",
      "Find burn source in location",
      "Ask who has access to furnace/fire",
      "Check lungs for smoke inhalation (burned alive indicator)"
    ],
    clueRules: "Char patterns show burn direction/intensity. Ash type identifies fire source. Smoke in lungs = burned alive. Burn severity suggests fuel type.",
    weaponMethodRelation: "Fire is both method and weapon. Killer needs access to heat source and time to execute. Restraints might be evidence if killer pinned victim in fire.",
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
    hiddenAspects: [
      "Which divine being or faction was responsible",
      "Why you were chosen for dissolution",
      "Whether this was punishment or mercy",
      "Cost paid by killer to wield divine power",
      "Whether reversal is possible"
    ],
    investigationActions: [
      "Read divine resonance (magic perception)",
      "Ask divine-touched NPCs what they sense",
      "Find references in celestial texts or records",
      "Determine which faction uses this method",
      "Sense lingering divine presence",
      "Calculate the power required (points to powerful killer)"
    ],
    clueRules: "Divine resonance is immediate and obvious clue. Celestial scars point to specific god/faction. Power requirement narrows suspects to divine-touched only.",
    weaponMethodRelation: "Weapon is divine power itself. Killer must be immortal, god-touched, or god directly. No physical evidence except reality distortion.",
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