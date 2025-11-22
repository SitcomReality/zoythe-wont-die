/**
 * Name Generator
 * Provides randomized name pools organized by culture/type
 */

const NAME_POOLS = {
  // Western/Ancient culture names
  western: [
    "Kael", "Mira", "Zara", "Morglet", "Corvus", "Thalia", "Vex", "Orion", 
    "Lyra", "Darius", "Elara", "Cassius", "Vera", "Silas", "Nyx", "Aurora",
    "Caspian", "Isolde", "Lucian", "Aria", "Rowan", "Vale", "Dorian", "Sera"
  ],
  // Mystical/Fantasy names
  mystical: [
    "Aether", "Selene", "Bastion", "Cipher", "Echo", "Fae", "Grim", "Hex",
    "Indie", "Jace", "Kessra", "Lune", "Mystic", "Nil", "Oracle", "Pyx",
    "Raven", "Sable", "Thorn", "Umber", "Vale", "Whisper", "Xeno", "Ysolde"
  ],
  // Common/Ordinary names
  common: [
    "Mara", "Jorn", "Bess", "Tam", "Kit", "Ren", "Moss", "Dale",
    "Iris", "Edith", "Grant", "Shaw", "Blake", "Drew", "Casey", "Morgan",
    "Riley", "Sage", "Quinn", "River", "Alex", "Jordan", "Parker", "Bailey"
  ]
};

/**
 * Get a random name from a pool
 * @param {Object} rng - RNG instance
 * @param {string} culture - Pool name (western, mystical, common)
 * @returns {string}
 */
export function generateRandomName(rng, culture = "western") {
  const pool = NAME_POOLS[culture] || NAME_POOLS.western;
  return rng.pick(pool);
}

/**
 * Generate a unique name, ensuring it hasn't been used
 * @param {Object} rng - RNG instance
 * @param {Set} usedNames - Set of already-used names
 * @param {string} culture - Pool name
 * @returns {string}
 */
export function generateUniqueName(rng, usedNames = new Set(), culture = "western") {
  const pool = NAME_POOLS[culture] || NAME_POOLS.western;
  let attempts = 0;
  let name = rng.pick(pool);
  
  while (usedNames.has(name) && attempts < 20) {
    name = rng.pick(pool);
    attempts++;
  }
  
  usedNames.add(name);
  return name;
}

/**
 * Generate an epithet/title for a name
 * @param {Object} rng - RNG instance
 * @param {string} name - Character name
 * @returns {string}
 */
export function generateEpithet(rng, name) {
  const epithets = [
    "the Scarred",
    "the Pale",
    "the Silent",
    "the Restless",
    "the Weary",
    "the Keen",
    "the Void-touched",
    "the Spirited",
    "the Lost",
    "the Fading",
    "the Grey",
    "the Hollow"
  ];
  
  const epithet = rng.pick(epithets);
  return `${name} ${epithet}`;
}

/**
 * Get all available pools
 * @returns {string[]}
 */
export function getAvailablePoolNames() {
  return Object.keys(NAME_POOLS);
}