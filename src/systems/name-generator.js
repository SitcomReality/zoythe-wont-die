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
  ],
  // Scope-specific additions
  intimate: [
    "Ma", "Pa", "Gran", "Uncle", "Aunt", "Cousin", "Neighbor",
    "Tom", "Beth", "Will", "Anne", "Henry", "Lucy", "John", "Mary",
    "Old Smith", "Young Ruth", "Father Ash", "Sister Mae"
  ],
  regional: [
    "Mayor Thorne", "Magistrate Crane", "Bishop Oswald", "Merchant Prince Vex",
    "Lady Isolde", "Lord Cassius", "Prelate Dorian", "Captain Rowan",
    "Goodwife Thalia", "Constable Miles", "Priestess Mara", "Earl Silas"
  ],
  national: [
    "King Darius", "Queen Aurora", "General Kael", "High Chancellor Orion",
    "Royal Executor Corvus", "Duchess Elara", "Duke Cassius", "General Vera",
    "Ambassador Caspian", "War Hero Lucian", "Supreme Judge Ysolde"
  ],
  cosmic: [
    "Aether", "Selene", "The First", "The Unmaker", "Cipher of Void",
    "Lune-the-Eternal", "The Fade", "Void's Echo", "The Reckoning",
    "Bastion-of-Worlds", "Xeno-the-Foreign", "Oracle-of-Ends"
  ]
};

/**
 * Get appropriate name pool for a scope
 * @param {string} scope - Story scope (intimate, regional, national, cosmic)
 * @returns {string[]}
 */
export function getNamePoolForScope(scope) {
  const scopePool = NAME_POOLS[scope];
  if (scopePool) return scopePool;
  
  // Fallback: intimate + western mix
  return [...NAME_POOLS.intimate, ...NAME_POOLS.western].slice(0, 24);
}

/**
 * Get a random name from a pool appropriate to scope
 * @param {Object} rng - RNG instance
 * @param {string} scope - Story scope
 * @returns {string}
 */
export function generateRandomNameForScope(rng, scope = "western") {
  if (scope && ["intimate", "regional", "national", "cosmic"].includes(scope)) {
    const pool = getNamePoolForScope(scope);
    return rng.pick(pool);
  }
  
  const pool = NAME_POOLS[scope] || NAME_POOLS.western;
  return rng.pick(pool);
}

/**
 * Generate a unique name appropriate to scope
 * @param {Object} rng - RNG instance
 * @param {Set} usedNames - Set of already-used names
 * @param {string} scope - Story scope
 * @returns {string}
 */
export function generateUniqueName(rng, usedNames = new Set(), scope = "western") {
  const pool = scope && ["intimate", "regional", "national", "cosmic"].includes(scope)
    ? getNamePoolForScope(scope)
    : (NAME_POOLS[scope] || NAME_POOLS.western);
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