import { NPC_ROLES, NPC_TYPES } from "../config/constants.js";

const NPC_TEMPLATES = {
  [NPC_ROLES.MENTOR]: [
    {
      name: "Kael the Scarred",
      descriptor: "A grizzled warrior who survived a god's death",
      initialType: NPC_TYPES.ALLY
    },
    {
      name: "Mira Starwhisper",
      descriptor: "An aging priestess who tends dying gods",
      initialType: NPC_TYPES.ALLY
    },
    {
      name: "The Hollow Sage",
      descriptor: "A nameless scholar who traded their identity for knowledge",
      initialType: NPC_TYPES.NEUTRAL
    }
  ],
  [NPC_ROLES.LOVE_INTEREST]: [
    {
      name: "Lyra Dawnsong",
      descriptor: "A wandering bard seeking songs worth singing",
      initialType: NPC_TYPES.LOVE_INTEREST
    },
    {
      name: "Darius Ironheart",
      descriptor: "A blacksmith's child with dreams of glory",
      initialType: NPC_TYPES.LOVE_INTEREST
    },
    {
      name: "Echo",
      descriptor: "A divine remnant taking mortal form",
      initialType: NPC_TYPES.LOVE_INTEREST
    }
  ],
  [NPC_ROLES.RIVAL]: [
    {
      name: "Zara the Ambitious",
      descriptor: "Another seeker of the MacGuffin, driven by pride",
      initialType: NPC_TYPES.ENEMY
    },
    {
      name: "Corvus",
      descriptor: "Your childhood friend turned bitter competitor",
      initialType: NPC_TYPES.NEUTRAL
    }
  ],
  [NPC_ROLES.ALLY]: [
    {
      name: "Finn Swiftfoot",
      descriptor: "A resourceful scout with a debt to repay",
      initialType: NPC_TYPES.ALLY
    },
    {
      name: "Sister Thalia",
      descriptor: "A healer fleeing her own dying temple",
      initialType: NPC_TYPES.ALLY
    }
  ],
  [NPC_ROLES.ENEMY]: [
    {
      name: "The Ash Prophet",
      descriptor: "A zealot who believes the gods should die",
      initialType: NPC_TYPES.ENEMY
    },
    {
      name: "Captain Vex",
      descriptor: "A mercenary captain hunting divine artifacts",
      initialType: NPC_TYPES.ENEMY
    }
  ],
  [NPC_ROLES.DIVINE_REMNANT]: [
    {
      name: "Aurelius, Echo of the Sun",
      descriptor: "The fading consciousness of a dead god",
      initialType: NPC_TYPES.NEUTRAL
    },
    {
      name: "Nyx, Fragment of Night",
      descriptor: "A shard of divinity seeking reunion",
      initialType: NPC_TYPES.NEUTRAL
    }
  ]
};

export function generateNPC({ rng, role }) {
  const templates = NPC_TEMPLATES[role] || [];
  if (templates.length === 0) {
    return null;
  }

  const template = rng.pick(templates);

  return {
    id: `${role}-${Date.now()}-${rng.int(1000, 9999)}`,
    name: template.name,
    descriptor: template.descriptor,
    role,
    type: template.initialType,
    score: 0,
    met: false,
    flags: {}
  };
}

export function generateNPCRoster({ rng, roles = [] }) {
  const roster = new Map();

  for (const role of roles) {
    const npc = generateNPC({ rng, role });
    if (npc) {
      roster.set(npc.id, npc);
    }
  }

  return roster;
}

export function getNPCsByRole(roster, role) {
  return Array.from(roster.values()).filter(npc => npc.role === role);
}

export function getNPCsByType(roster, type) {
  return Array.from(roster.values()).filter(npc => npc.type === type);
}