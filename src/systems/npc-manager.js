import { NPC_ROLES, NPC_TYPES } from "../config/constants.js";
import { generateUniqueName } from "./name-generator.js";
import { generateTraitDescription } from "./trait-library.js";

const NPC_ROLE_TEMPLATES = {
  [NPC_ROLES.MENTOR]: [
    { role: NPC_ROLES.MENTOR, initialType: NPC_TYPES.ALLY },
    { role: NPC_ROLES.MENTOR, initialType: NPC_TYPES.ALLY }
  ],
  [NPC_ROLES.LOVE_INTEREST]: [
    { role: NPC_ROLES.LOVE_INTEREST, initialType: NPC_TYPES.LOVE_INTEREST },
    { role: NPC_ROLES.LOVE_INTEREST, initialType: NPC_TYPES.LOVE_INTEREST }
  ],
  [NPC_ROLES.RIVAL]: [
    { role: NPC_ROLES.RIVAL, initialType: NPC_TYPES.ENEMY }
  ],
  [NPC_ROLES.ALLY]: [
    { role: NPC_ROLES.ALLY, initialType: NPC_TYPES.ALLY }
  ],
  [NPC_ROLES.ENEMY]: [
    { role: NPC_ROLES.ENEMY, initialType: NPC_TYPES.ENEMY }
  ],
  [NPC_ROLES.DIVINE_REMNANT]: [
    { role: NPC_ROLES.DIVINE_REMNANT, initialType: NPC_TYPES.NEUTRAL }
  ]
};

export function generateNPC({ rng, role, scope = "regional" }) {
  const templates = NPC_ROLE_TEMPLATES[role] || [];
  if (templates.length === 0) {
    return null;
  }

  const template = rng.pick(templates);
  const name = generateUniqueName(rng, new Set(), scope);
  const descriptor = generateTraitDescription(rng, name);

  return {
    id: `${role}-${Date.now()}-${rng.int(1000, 9999)}`,
    name,
    descriptor,
    role,
    type: template.initialType,
    score: 0,
    met: false,
    flags: {},
    scope
  };
}

export function generateNPCRoster({ rng, roles = [], scope = "regional" }) {
  const roster = new Map();
  const usedNames = new Set();

  for (const role of roles) {
    const npc = generateNPC({ rng, role, scope });
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