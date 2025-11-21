/**
 * Terminology Thesaurus
 * Provides random synonyms for key concepts to vary LLM prompts
 * and reduce repetitive descriptions in generated narratives.
 */

const THESAURUS = {
  // Afterlife/Death Concepts
  afterlife: [
    "the realm beyond death",
    "the space between worlds",
    "this in-between existence",
    "the grey lands",
    "the liminal void",
    "the twilight plane",
    "the between-state",
    "this hollow place"
  ],

  glitch: [
    "malfunction",
    "corruption",
    "a tear in reality",
    "stuttering existence",
    "reality fractures",
    "temporal distortions",
    "dimensional instability",
    "a rip in the fabric",
    "cascading failures"
  ],

  broken: [
    "shattered",
    "fractured",
    "in disarray",
    "crumbling",
    "decayed",
    "corrupted",
    "unraveling",
    "collapsing",
    "twisted"
  ],

  dead_god: [
    "deceased deity",
    "fallen god",
    "expired divine being",
    "slain celestial",
    "extinguished god",
    "murdered divinity",
    "lifeless god",
    "vanquished eternal"
  ],

  murder_mystery: [
    "murder case",
    "killing",
    "assassination",
    "unlawful death",
    "homicide",
    "demise",
    "slaying",
    "death"
  ],

  investigate: [
    "uncover",
    "piece together",
    "examine",
    "probe",
    "search for answers",
    "dig into",
    "examine the evidence",
    "seek the truth"
  ],

  suspect: [
    "person of interest",
    "potential killer",
    "those around you",
    "the accused",
    "those under question",
    "the implicated",
    "those nearby"
  ],

  clue: [
    "evidence",
    "a thread to pull",
    "a piece of the puzzle",
    "a lead",
    "a hint",
    "a piece of truth",
    "a revelation",
    "a connection"
  ],

  memory: [
    "recollection",
    "fragment of awareness",
    "echoing moment",
    "buried knowledge",
    "sense memory",
    "remnant of self",
    "fading recall"
  ],

  strange: [
    "peculiar",
    "bizarre",
    "unsettling",
    "eerie",
    "wrong",
    "uncanny",
    "disquieting",
    "disconcerting"
  ],

  weapon: [
    "instrument of death",
    "killing implement",
    "tool of demise",
    "blade",
    "means of destruction",
    "deadly object",
    "instrument of harm"
  ],

  reality: [
    "the fabric of existence",
    "what is",
    "the world around you",
    "this place",
    "what remains",
    "existence itself",
    "the natural order"
  ],

  spirit: [
    "ghost",
    "shade",
    "wraith",
    "apparition",
    "phantom",
    "ethereal being",
    "specter"
  ],

  absurd: [
    "ridiculous",
    "darkly comedic",
    "tragicomic",
    "farcical",
    "ironic",
    "absurdist",
    "mockingly theatrical"
  ],

  existence_distress: [
    "confusing",
    "broken",
    "wrong",
    "fractured",
    "disorienting",
    "contradictory",
    "warped",
    "incoherent",
    "scattered"
  ],

  fragmenting_soul: [
    "unraveling",
    "dissolving",
    "coming apart",
    "dispersing",
    "scattering",
    "dissipating",
    "crumbling"
  ],

  numb_quiet: [
    "silent",
    "hushed",
    "muted",
    "soundless",
    "void-like",
    "quiet",
    "deafening in its silence"
  ],

  dreadful_tone: [
    "terrifyingly",
    "horrifyingly",
    "sickeningly",
    "appallingly",
    "dreadfully",
    "disturbingly"
  ],

  colorless_world: [
    "grey",
    "ashen",
    "colorless",
    "pallid",
    "drained",
    "washed-out",
    "bleached"
  ],

  sundered_state: [
    "shattered",
    "fractured",
    "splintered",
    "cracked",
    "sundered",
    "split"
  ]
};

/**
 * Get a random synonym for a term
 * @param {string} term - The concept key
 * @param {Object} rng - RNG instance
 * @returns {string} A random synonym, or the original term if not found
 */
export function getRandomTerminology(term, rng) {
  const synonyms = THESAURUS[term];
  if (!synonyms || synonyms.length === 0) {
    return term;
  }
  return rng.pick(synonyms);
}

/**
 * Build a terminology context object with random variants
 * Useful for passing to prompt generation
 * @param {Object} rng - RNG instance
 * @returns {Object} Object with randomized terminology
 */
export function generateTerminologyContext(rng) {
  const context = {};
  for (const [key, _] of Object.entries(THESAURUS)) {
    context[key] = getRandomTerminology(key, rng);
  }
  return context;
}

/**
 * Substitute terminology placeholders in a string
 * Format: ${terminology:term_name}
 * @param {string} text - Text with placeholders
 * @param {Object} terminologyContext - Context from generateTerminologyContext
 * @returns {string} Text with substitutions
 */
export function substituteTerminology(text, terminologyContext) {
  return text.replace(
    /\$\{terminology:(\w+)\}/g,
    (match, key) => terminologyContext[key] || match
  );
}