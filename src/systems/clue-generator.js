const PHYSICAL_CLUES = [
  "A bloody shard of glass reflecting no light.",
  "A torn piece of silk from a specific robe.",
  "A scorched mark on the floor in the shape of a rune.",
  "A discarded ceremonial dagger.",
  "Muddy footprints leading away from the body."
];

const TESTIMONIAL_CLUES = [
  "A witness saw a shadowed figure fleeing.",
  "Contradictory timelines in the suspect's story.",
  "An overheard argument about 'the necessary sacrifice'.",
  "A secret diary entry mentioning a meeting at the murder hour."
];

const INVESTIGATION_METHODS = {
  IMMEDIATE: "immediate",      // Visible without action
  BODY_EXAMINATION: "bodyExamination",
  SURROUNDINGS: "surroundings",
  MEMORY_RECALL: "memoryRecall"
};

export function seedClues({ suspects, killerId, weapon, rng, twistTemplate, deathScenario }) {
  const clues = new Map();
  const suspectList = Array.from(suspects.values());
  const killer = suspects.get(killerId);

  // Helper to add clue
  function addClue(data) {
    clues.set(data.id, data);
  }

  // 1. Weapon Clue (Tier 1, visibility depends on scenario)
  const weaponClueId = `clue-weapon-${rng.int(1000,9999)}`;
  const weaponVisibility = (deathScenario && !deathScenario.weaponVisible) 
    ? INVESTIGATION_METHODS.BODY_EXAMINATION 
    : INVESTIGATION_METHODS.IMMEDIATE;
  
  addClue({
    id: weaponClueId,
    label: "The Murder Weapon",
    type: "PHYSICAL",
    description: weapon ? `${weapon.name}. ${weapon.description}.` : "An unknown method of death.",
    relatedSuspectIds: [], 
    truthValue: true,
    tier: 1,
    discoveryMethod: weaponVisibility,
    context: deathScenario ? deathScenario.name : "unknown"
  });

  // 2. Method Clue (scenario-specific)
  if (deathScenario) {
    const methodClueId = `clue-method-${rng.int(1000,9999)}`;
    const methodVisibility = deathScenario.methodVisible 
      ? INVESTIGATION_METHODS.IMMEDIATE 
      : INVESTIGATION_METHODS.BODY_EXAMINATION;
    
    addClue({
      id: methodClueId,
      label: "Manner of Death",
      type: "PHYSICAL",
      description: deathScenario.methodDescription,
      relatedSuspectIds: [],
      truthValue: true,
      tier: 1,
      discoveryMethod: methodVisibility,
      context: deathScenario.name
    });
  }

  // 3. Killer Clue (Tier 2 - Direct Link)
  if (killer) {
    const killerClueId = `clue-killer-${rng.int(1000,9999)}`;
    addClue({
      id: killerClueId,
      label: "Incriminating Personal Item",
      type: "PHYSICAL",
      description: `An item belonging to ${killer.name} was found near where you died.`,
      relatedSuspectIds: [killerId],
      truthValue: true,
      tier: 2,
      discoveryMethod: INVESTIGATION_METHODS.SURROUNDINGS,
      context: "evidence"
    });

    // 4. Alibi Breaker (Tier 2 - Testimonial)
    const alibiClueId = `clue-alibi-${rng.int(1000,9999)}`;
    addClue({
      id: alibiClueId,
      label: "Witness Statement",
      type: "TESTIMONIAL",
      description: `A wandering spirit claims to have seen ${killer.name} at the scene, contradicting their alibi.`,
      relatedSuspectIds: [killerId],
      truthValue: true,
      tier: 2,
      discoveryMethod: INVESTIGATION_METHODS.MEMORY_RECALL,
      context: "testimony"
    });
  }

  // 5. Red Herring (Tier 1)
  const innocent = rng.pick(suspectList.filter(s => s.id !== killerId));
  if (innocent) {
    const herringId = `clue-herring-${rng.int(1000,9999)}`;
    addClue({
      id: herringId,
      label: "Misleading Circumstance",
      type: "CIRCUMSTANTIAL",
      description: `${innocent.name} was seen arguing with you shortly before your death.`,
      relatedSuspectIds: [innocent.id],
      truthValue: false,
      tier: 1,
      discoveryMethod: INVESTIGATION_METHODS.IMMEDIATE,
      context: "red-herring"
    });
  }

  // 6. Generic Atmosphere Clue
  const atmClueId = `clue-atm-${rng.int(1000,9999)}`;
  addClue({
    id: atmClueId,
    label: "Strange Residue",
    type: "PHYSICAL",
    description: "The area reeks of burnt ozone and regret.",
    relatedSuspectIds: [],
    truthValue: true,
    tier: 1,
    discoveryMethod: INVESTIGATION_METHODS.SURROUNDINGS,
    context: "atmosphere"
  });

  // 7. Memory/Recall Clue (victim's last moment)
  const memoryClueId = `clue-memory-${rng.int(1000,9999)}`;
  const lastMoments = [
    "You remember a shadow moving quickly.",
    "A voice you almost recognized, twisted with emotion.",
    "The sensation of betrayal. Someone you trusted.",
    "A flash of something sharp and bright.",
    "The taste of something bitter.",
    "Cold hands. Surprising strength."
  ];
  addClue({
    id: memoryClueId,
    label: "Fragmented Memory",
    type: "MEMORY",
    description: rng.pick(lastMoments),
    relatedSuspectIds: [],
    truthValue: true,
    tier: 1,
    discoveryMethod: INVESTIGATION_METHODS.MEMORY_RECALL,
    context: "memory"
  });

  return { 
    all: clues, 
    discovered: new Set(), 
    knownSuspects: new Set(),
    investigationMethods: new Set() // Track which investigation types player has used
  };
}

export function getCluesByMethod(cluesMap, method) {
  return Array.from(cluesMap.values()).filter(c => c.discoveryMethod === method);
}

export function getImmediateClues(cluesMap) {
  return getCluesByMethod(cluesMap, INVESTIGATION_METHODS.IMMEDIATE);
}