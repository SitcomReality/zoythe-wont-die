export const MENTOR_TYPES = {
  GHOST_ANCESTOR: "ghost_ancestor",
  MYSTERIOUS_STRANGER: "mysterious_stranger",
  RIVAL_INVESTIGATOR: "rival_investigator",
  DIVINE_FRAGMENT: "divine_fragment",
  FORMER_DETECTIVE: "former_detective",
  CRYPTIC_SUSPECT: "cryptic_suspect"
};

const MENTOR_DEFINITIONS = {
  [MENTOR_TYPES.GHOST_ANCESTOR]: {
    description: "a spectral figure bearing the faded crest of your own lineage",
    demeanor: "melancholy and authoritative",
    greetingStyle: "familial disappointment mixed with urgent concern",
    motivation: "restoring the family honor tarnished by your murder"
  },
  [MENTOR_TYPES.MYSTERIOUS_STRANGER]: {
    description: "a cloaked figure whose face is constantly obscured by shifting shadows",
    demeanor: "detached and enigmatic",
    greetingStyle: "riddles and observations about the fragility of existence",
    motivation: "maintaining the balance of the Interregnum"
  },
  [MENTOR_TYPES.RIVAL_INVESTIGATOR]: {
    description: "a sharp-eyed soul taking notes in a floating ledger",
    demeanor: "competitive and condescending",
    greetingStyle: "annoyance that you are interfering with their case",
    motivation: "solving the mystery before you do to prove superiority"
  },
  [MENTOR_TYPES.DIVINE_FRAGMENT]: {
    description: "a glowing shard of the Dead God that has taken vaguely humanoid shape",
    demeanor: "confused and overwhelming",
    greetingStyle: "an echoing chorus of voices speaking half-truths",
    motivation: "finding the missing pieces of itself (which might be clues)"
  },
  [MENTOR_TYPES.FORMER_DETECTIVE]: {
    description: "a weary soul smoking a cigarette that emits blue smoke",
    demeanor: "cynical and tired",
    greetingStyle: "noir tropes and world-weary advice",
    motivation: "finding peace by closing one last cold case"
  },
  [MENTOR_TYPES.CRYPTIC_SUSPECT]: {
    description: "someone who looks suspiciously like they just washed blood off their hands",
    demeanor: "nervous but helpful",
    greetingStyle: "overly friendly deflection",
    motivation: "guiding you away from the truth while pretending to help"
  }
};

/**
 * Enhances a base NPC with mentor-specific traits
 * @param {Object} npc - The base NPC object
 * @param {Object} rng - RNG instance
 * @returns {Object} The enhanced NPC
 */
export function enhanceMentorNPC(npc, rng) {
  // Pick a random type
  const type = rng.pick(Object.values(MENTOR_TYPES));
  const def = MENTOR_DEFINITIONS[type] || MENTOR_DEFINITIONS[MENTOR_TYPES.MYSTERIOUS_STRANGER];
  
  npc.mentorType = type;
  npc.descriptor = def.description; // Override base descriptor for specific flavor
  npc.personality = {
    demeanor: def.demeanor,
    greetingStyle: def.greetingStyle,
    motivation: def.motivation
  };
  
  return npc;
}