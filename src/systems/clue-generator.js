const CLUE_TIERS = {
  EARLY: 1,
  MID: 2,
  LATE: 3
};

const CLUE_TYPES = {
  PHYSICAL: "physical",
  TESTIMONIAL: "testimonial",
  CIRCUMSTANTIAL: "circumstantial"
};

export function seedClues({ suspects, killerId, weapon, rng, twistTemplate }) {
  const clues = new Map();
  let clueId = 1;

  // Helper to create a clue
  function createClue({ tier, type, label, description, relatedSuspectIds, truthValue = true }) {
    const id = `clue-${clueId++}`;
    clues.set(id, {
      id,
      tier,
      type,
      label,
      description,
      relatedSuspectIds,
      truthValue
    });
    return id;
  }

  // TIER 1: Early/Physical clues (4-5 clues)
  // The murder weapon or traces of it
  createClue({
    tier: CLUE_TIERS.EARLY,
    type: CLUE_TYPES.PHYSICAL,
    label: "The Murder Weapon",
    description: `You find traces of ${weapon.name}: ${weapon.description}`,
    relatedSuspectIds: [], // Generic, doesn't point to anyone yet
    truthValue: true
  });

  // Physical evidence at the scene
  const bodyLocationClues = [
    "A torn piece of cloth",
    "Footprints in the ash",
    "A broken amulet",
    "Bloodstains leading away"
  ];
  createClue({
    tier: CLUE_TIERS.EARLY,
    type: CLUE_TYPES.PHYSICAL,
    label: rng.pick(bodyLocationClues),
    description: "Found near your body, it suggests someone was in a hurry",
    relatedSuspectIds: [killerId],
    truthValue: true
  });

  // A red herring physical clue
  const innocentSuspects = Array.from(suspects.keys()).filter(id => id !== killerId);
  if (innocentSuspects.length > 0) {
    createClue({
      tier: CLUE_TIERS.EARLY,
      type: CLUE_TYPES.PHYSICAL,
      label: "A misleading token",
      description: "An item that seems incriminating but was planted or coincidental",
      relatedSuspectIds: [rng.pick(innocentSuspects)],
      truthValue: false // Red herring
    });
  }

  // TIER 2: Mid/Testimonial clues (4-5 clues)
  // Contradictory alibis
  const suspectsArray = Array.from(suspects.values());
  for (const suspect of suspectsArray) {
    if (!suspect.alibi.isTrue && suspect.alibi.breakCondition) {
      createClue({
        tier: CLUE_TIERS.MID,
        type: CLUE_TYPES.TESTIMONIAL,
        label: `${suspect.name}'s Broken Alibi`,
        description: `Evidence that contradicts ${suspect.name}'s alibi: "${suspect.alibi.statement}"`,
        relatedSuspectIds: [suspect.id],
        truthValue: true
      });
    }
  }

  // Witness testimony
  const witnessPool = suspectsArray.filter(s => s.role === "witness" || rng.next() > 0.7);
  if (witnessPool.length > 0) {
    const witness = rng.pick(witnessPool);
    createClue({
      tier: CLUE_TIERS.MID,
      type: CLUE_TYPES.TESTIMONIAL,
      label: `${witness.name}'s Testimony`,
      description: `${witness.name} reveals they saw something significant that night`,
      relatedSuspectIds: [killerId],
      truthValue: true
    });
  }

  // Motive revelation
  const killer = suspects.get(killerId);
  if (killer) {
    createClue({
      tier: CLUE_TIERS.MID,
      type: CLUE_TYPES.CIRCUMSTANTIAL,
      label: "Motive Uncovered",
      description: `You discover why ${killer.name} wanted you dead: ${killer.motive}`,
      relatedSuspectIds: [killerId],
      truthValue: true
    });
  }

  // TIER 3: Late/Revelation clues (3-4 clues)
  // The smoking gun - weapon usage
  createClue({
    tier: CLUE_TIERS.LATE,
    type: CLUE_TYPES.PHYSICAL,
    label: "Weapon's Origin",
    description: `${weapon.linkToDeathGod}. Only someone with specific knowledge could have used it.`,
    relatedSuspectIds: [killerId],
    truthValue: true
  });

  // Twist revelation
  createClue({
    tier: CLUE_TIERS.LATE,
    type: CLUE_TYPES.CIRCUMSTANTIAL,
    label: "The Truth Unveiled",
    description: `The full picture emerges: ${twistTemplate.description}`,
    relatedSuspectIds: [killerId],
    truthValue: true
  });

  // Final damning evidence
  if (killer) {
    createClue({
      tier: CLUE_TIERS.LATE,
      type: CLUE_TYPES.PHYSICAL,
      label: "Undeniable Proof",
      description: `Physical evidence that conclusively links ${killer.name} to the murder`,
      relatedSuspectIds: [killerId],
      truthValue: true
    });
  }

  return clues;
}