const SUSPECT_ROLES = {
  MENTOR: "mentor",
  LOVER: "lover",
  RIVAL: "rival",
  ZEALOT: "zealot",
  DIVINE_REMNANT: "divineRemnant",
  ALLY: "ally",
  ENEMY: "enemy",
  WITNESS: "witness"
};

const SUSPECT_TEMPLATES = {
  mentor: [
    {
      name: "Kael the Scarred",
      descriptor: "A grizzled warrior who survived a god's death",
      motive: "Believes you were destined to become a tyrant",
      alibi: {
        statement: "I was tending to the wounded at the temple",
        isTrue: false,
        breakCondition: "clue-temple-empty"
      }
    },
    {
      name: "The Hollow Sage",
      descriptor: "A nameless scholar who traded their identity for knowledge",
      motive: "Needed your death to complete a forbidden ritual",
      alibi: {
        statement: "I was in my study, as always",
        isTrue: true,
        breakCondition: null
      }
    }
  ],
  lover: [
    {
      name: "Lyra Dawnsong",
      descriptor: "A wandering bard seeking songs worth singing",
      motive: "You knew a secret that would destroy her reputation",
      alibi: {
        statement: "I was performing at the tavern all night",
        isTrue: false,
        breakCondition: "clue-tavern-witness"
      }
    },
    {
      name: "Echo",
      descriptor: "A divine remnant taking mortal form",
      motive: "Your soul was promised to a different god",
      alibi: {
        statement: "I don't experience time like you do",
        isTrue: true,
        breakCondition: null
      }
    }
  ],
  rival: [
    {
      name: "Zara the Ambitious",
      descriptor: "Another seeker of divine power, driven by pride",
      motive: "You stood between her and godhood",
      alibi: {
        statement: "I was meditating in the sacred grove",
        isTrue: false,
        breakCondition: "clue-grove-disturbed"
      }
    },
    {
      name: "Corvus",
      descriptor: "Your childhood friend turned bitter competitor",
      motive: "Years of resentment and jealousy",
      alibi: {
        statement: "We were friends. Why would I hurt you?",
        isTrue: false,
        breakCondition: "clue-old-letter"
      }
    }
  ],
  zealot: [
    {
      name: "The Ash Prophet",
      descriptor: "A zealot who believes the gods should die",
      motive: "Your death would hasten the divine collapse",
      alibi: {
        statement: "I was preaching at the market square",
        isTrue: true,
        breakCondition: null
      }
    },
    {
      name: "Sister Thalia",
      descriptor: "A healer fleeing her own dying temple",
      motive: "You were the chosen vessel for her god's resurrection",
      alibi: {
        statement: "I was gathering herbs in the forest",
        isTrue: false,
        breakCondition: "clue-forest-tracks"
      }
    }
  ],
  divineRemnant: [
    {
      name: "Aurelius, Echo of the Sun",
      descriptor: "The fading consciousness of a dead god",
      motive: "Your death could fuel its resurrection",
      alibi: {
        statement: "I exist beyond mortal time",
        isTrue: true,
        breakCondition: null
      }
    },
    {
      name: "Nyx, Fragment of Night",
      descriptor: "A shard of divinity seeking reunion",
      motive: "You carried a piece of its former self",
      alibi: {
        statement: "I was scattered across the void",
        isTrue: false,
        breakCondition: "clue-divine-essence"
      }
    }
  ],
  ally: [
    {
      name: "Finn Swiftfoot",
      descriptor: "A resourceful scout with a debt to repay",
      motive: "Was blackmailed into betraying you",
      alibi: {
        statement: "I was on patrol at the outer walls",
        isTrue: false,
        breakCondition: "clue-patrol-log"
      }
    }
  ],
  enemy: [
    {
      name: "Captain Vex",
      descriptor: "A mercenary captain hunting divine artifacts",
      motive: "You possessed something valuable",
      alibi: {
        statement: "I was in another realm entirely",
        isTrue: true,
        breakCondition: null
      }
    }
  ],
  witness: [
    {
      name: "Old Mara",
      descriptor: "A street oracle who sees too much",
      motive: "None—but knows who did it",
      alibi: {
        statement: "I saw nothing that night",
        isTrue: false,
        breakCondition: "clue-oracle-vision"
      }
    }
  ]
};

export function generateCohort({ rng, twistTemplate }) {
  const cohortSize = 4 + rng.int(0, 2); // 4-6 suspects
  const suspects = new Map();

  // Ensure required roles for the twist are present
  const requiredRoles = twistTemplate.requiredRoles || [];
  const selectedRoles = [...requiredRoles];

  // Fill remaining slots with random roles
  const allRoles = Object.values(SUSPECT_ROLES);
  while (selectedRoles.length < cohortSize) {
    const role = rng.pick(allRoles);
    selectedRoles.push(role);
  }

  // Generate suspects from templates
  for (let i = 0; i < selectedRoles.length; i++) {
    const role = selectedRoles[i];
    const templates = SUSPECT_TEMPLATES[role] || SUSPECT_TEMPLATES.ally;
    const template = rng.pick(templates);

    const suspect = {
      id: `suspect-${i + 1}`,
      name: template.name,
      descriptor: template.descriptor,
      role,
      motive: template.motive,
      alibi: { ...template.alibi },
      relationships: generateRelationships(i, selectedRoles.length, rng),
      suspicionLevel: 0
    };

    suspects.set(suspect.id, suspect);
  }

  return suspects;
}

function generateRelationships(suspectIndex, totalSuspects, rng) {
  const relationships = [];
  const relationshipTypes = [
    "secretLove",
    "resentment",
    "debt",
    "rivalry",
    "protection",
    "manipulation"
  ];

  // Each suspect has 0-2 relationships with other suspects
  const numRelationships = rng.int(0, 2);

  for (let i = 0; i < numRelationships; i++) {
    let targetIndex = rng.int(1, totalSuspects);
    // Avoid self-relationships
    if (targetIndex === suspectIndex + 1) {
      targetIndex = (targetIndex % totalSuspects) + 1;
    }

    relationships.push({
      targetId: `suspect-${targetIndex}`,
      type: rng.pick(relationshipTypes)
    });
  }

  return relationships;
}