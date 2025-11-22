/**
 * Trait Library
 * Pools of character traits for dynamic description generation
 */

const TRAIT_LIBRARY = {
  personality: {
    positive: [
      "cunning", "brave", "loyal", "clever", "compassionate", 
      "resilient", "noble", "wise", "witty", "steadfast",
      "honorable", "determined", "graceful", "articulate"
    ],
    negative: [
      "bitter", "cruel", "suspicious", "vengeful", "arrogant",
      "cowardly", "deceitful", "impulsive", "greedy", "paranoid",
      "volatile", "manipulative", "corrupt", "petulant"
    ],
    neutral: [
      "mysterious", "practical", "methodical", "eccentric", "reserved",
      "ambitious", "philosophical", "pragmatic", "cautious", "adventurous",
      "stoic", "whimsical", "analytical", "intuitive"
    ]
  },

  physical: [
    "scarred", "weathered", "pale", "grey-eyed", "gaunt",
    "broad-shouldered", "slight", "angular", "round-faced", "sharp-featured",
    "tattooed", "burnt", "limping", "graceful", "hunched",
    "wild-haired", "bald", "silver-eyed", "dark-skinned", "ghostly"
  ],

  background: [
    "a former warrior", "a disgraced priest", "a scholar of forgotten texts",
    "a traveling merchant", "a survivor of the old age", "an exiled noble",
    "a wandering doctor", "a circus performer", "a criminal turned informant",
    "a servant to the divine", "a betrayed companion", "a seeker of truth",
    "a hunter of secrets", "a keeper of dangerous knowledge",
    "someone who has seen too much", "a refugee from lost lands"
  ],

  motivation: [
    "seeking redemption", "hunting for answers", "protecting someone dear",
    "proving their worth", "reclaiming lost honor", "surviving another day",
    "pursuing vengeance", "seeking justice", "protecting a secret",
    "searching for a lost loved one", "running from their past",
    "trying to prevent catastrophe", "bound by obligation", "obsessed with truth"
  ]
};

/**
 * Select a random trait from a category
 * @param {Object} rng - RNG instance
 * @param {string} category - Trait category (personality, physical, background, motivation)
 * @param {string} subcategory - Optional subcategory (for personality: positive, negative, neutral)
 * @returns {string}
 */
export function selectTrait(rng, category, subcategory = null) {
  if (subcategory && TRAIT_LIBRARY[category] && TRAIT_LIBRARY[category][subcategory]) {
    return rng.pick(TRAIT_LIBRARY[category][subcategory]);
  }
  
  if (TRAIT_LIBRARY[category]) {
    const pool = Array.isArray(TRAIT_LIBRARY[category]) 
      ? TRAIT_LIBRARY[category]
      : Object.values(TRAIT_LIBRARY[category]).flat();
    return rng.pick(pool);
  }
  
  return "mysterious";
}

/**
 * Generate a descriptive phrase combining traits
 * @param {Object} rng - RNG instance
 * @param {string} name - Character name
 * @returns {string}
 */
export function generateTraitDescription(rng, name) {
  const personality = selectTrait(rng, "personality");
  const physical = selectTrait(rng, "physical");
  const background = selectTrait(rng, "background");
  const motivation = selectTrait(rng, "motivation");
  
  const templates = [
    `${name}: ${personality} and ${physical}, ${background}, ${motivation}.`,
    `${name} is ${personality} and ${physical}. ${background}. They are ${motivation}.`,
    `A ${physical} figure: ${name}. ${personality} nature. ${background}. ${motivation}.`,
    `${name}, ${personality} and ${physical}. Once ${background}, now ${motivation}.`
  ];
  
  return rng.pick(templates);
}

/**
 * Get list of available trait categories
 * @returns {string[]}
 */
export function getAvailableCategories() {
  return Object.keys(TRAIT_LIBRARY);
}

/**
 * Get all traits in a category
 * @param {string} category
 * @returns {string[]}
 */
export function getTraitsInCategory(category) {
  if (Array.isArray(TRAIT_LIBRARY[category])) {
    return TRAIT_LIBRARY[category];
  }
  if (TRAIT_LIBRARY[category]) {
    return Object.values(TRAIT_LIBRARY[category]).flat();
  }
  return [];
}