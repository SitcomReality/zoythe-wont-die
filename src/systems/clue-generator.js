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

export function seedClues({ suspects, killerId, weapon, rng }) {
  const clues = new Map();
  const suspectList = Array.from(suspects.values());
  const killer = suspects.get(killerId);

  // Helper to add clue
  function addClue(data) {
    clues.set(data.id, data);
  }

  // 1. Weapon Clue (Tier 1)
  const weaponClueId = `clue-weapon-${rng.int(1000,9999)}`;
  addClue({
    id: weaponClueId,
    label: "The Murder Weapon",
    type: "PHYSICAL",
    description: `The weapon used to kill you: ${weapon.name}. ${weapon.description}.`,
    relatedSuspectIds: [], 
    truthValue: true,
    tier: 1
  });

  // 2. Killer Clue (Tier 2 - Direct Link)
  if (killer) {
    const killerClueId = `clue-killer-${rng.int(1000,9999)}`;
    addClue({
      id: killerClueId,
      label: "Incriminating Personal Item",
      type: "PHYSICAL",
      description: `An item belonging to ${killer.name} was found near where you died.`,
      relatedSuspectIds: [killerId],
      truthValue: true,
      tier: 2
    });

    // 3. Alibi Breaker (Tier 2 - Testimonial)
    const alibiClueId = `clue-alibi-${rng.int(1000,9999)}`;
    addClue({
      id: alibiClueId,
      label: "Witness Statement",
      type: "TESTIMONIAL",
      description: `A wandering spirit claims to have seen ${killer.name} at the scene, contradicting their alibi.`,
      relatedSuspectIds: [killerId],
      truthValue: true,
      tier: 2
    });
  }

  // 4. Red Herring (Tier 1)
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
      tier: 1
    });
  }

  // 5. Generic Atmosphere Clue
  const atmClueId = `clue-atm-${rng.int(1000,9999)}`;
  addClue({
    id: atmClueId,
    label: "Strange Residue",
    type: "PHYSICAL",
    description: "The area reeks of burnt ozone and regret.",
    relatedSuspectIds: [],
    truthValue: true,
    tier: 1
  });

  return { 
    all: clues, 
    discovered: new Set(), 
    knownSuspects: new Set() 
  };
}