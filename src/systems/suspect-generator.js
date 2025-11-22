import { NPC_ROLES } from "../config/constants.js";
import { generateUniqueName } from "./name-generator.js";
import { generateTraitDescription, selectTrait } from "./trait-library.js";

const SUSPECT_TEMPLATES = {
  intimate: [
    { 
      role: NPC_ROLES.ALLY, 
      motive: "Protecting the family's darkest secret.",
      baseSuspicion: 0.3
    },
    { 
      role: NPC_ROLES.RIVAL, 
      motive: "Jealousy over inheritance or inheritance.",
      baseSuspicion: 0.7
    },
    { 
      role: NPC_ROLES.LOVE_INTEREST, 
      motive: "A twisted act born from forbidden love.",
      baseSuspicion: 0.4
    },
    { 
      role: NPC_ROLES.ENEMY, 
      motive: "Old neighborhood grudge finally boiling over.",
      baseSuspicion: 0.8
    }
  ],
  regional: [
    { 
      role: NPC_ROLES.MENTOR, 
      motive: "To prevent you from exposing their corruption.",
      baseSuspicion: 0.4
    },
    { 
      role: NPC_ROLES.RIVAL, 
      motive: "Competition for the favor of local nobility.",
      baseSuspicion: 0.7
    },
    { 
      role: NPC_ROLES.ALLY, 
      motive: "Debt to a powerful merchant or crime lord.",
      baseSuspicion: 0.3
    },
    { 
      role: NPC_ROLES.LOVE_INTEREST, 
      motive: "A forbidden affair discovered and condemned.",
      baseSuspicion: 0.5
    }
  ],
  national: [
    { 
      role: NPC_ROLES.MENTOR, 
      motive: "Political necessity to prevent a scandal.",
      baseSuspicion: 0.4
    },
    { 
      role: NPC_ROLES.RIVAL, 
      motive: "Eliminating competition for the throne.",
      baseSuspicion: 0.85
    },
    { 
      role: NPC_ROLES.ALLY, 
      motive: "Ordered by their superior officer or noble.",
      baseSuspicion: 0.5
    },
    { 
      role: NPC_ROLES.ENEMY, 
      motive: "War-time vendetta between kingdoms.",
      baseSuspicion: 0.9
    }
  ],
  cosmic: [
    { 
      role: NPC_ROLES.DIVINE_REMNANT, 
      motive: "To reclaim a fragment of divine power embedded in you.",
      baseSuspicion: 0.6
    },
    { 
      role: NPC_ROLES.RIVAL, 
      motive: "Cosmic competition for supremacy among gods.",
      baseSuspicion: 0.85
    },
    { 
      role: NPC_ROLES.MENTOR, 
      motive: "To prevent you from unraveling a celestial secret.",
      baseSuspicion: 0.5
    },
    { 
      role: NPC_ROLES.ENEMY, 
      motive: "You defied the will of an elder being.",
      baseSuspicion: 0.9
    }
  ]
};

export function generateCohort({ rng, scope = "regional", twistTemplate }) {
  const suspects = new Map();
  const count = 4;
  const usedNames = new Set();
  
  // Select scope-appropriate templates
  const templates = SUSPECT_TEMPLATES[scope] || SUSPECT_TEMPLATES.regional;
  let selectedTemplates = [];
  
  for (let i = 0; i < count && i < templates.length; i++) {
    selectedTemplates.push(templates[i]);
  }
  
  // If we need more templates, wrap around
  while (selectedTemplates.length < count) {
    selectedTemplates.push(rng.pick(templates));
  }
  
  selectedTemplates.forEach((tmpl, idx) => {
    const name = generateUniqueName(rng, usedNames, scope);
    const descriptor = generateTraitDescription(rng, name);

    const id = `suspect-${idx}-${name.toLowerCase()}`;
    
    const relationships = [];
    
    suspects.set(id, {
      id,
      name,
      descriptor,
      role: tmpl.role,
      motive: tmpl.motive,
      suspicionLevel: tmpl.baseSuspicion,
      alibi: {
        statement: "I was elsewhere, far from the deed.",
        isTrue: true,
        breakCondition: null
      },
      relationships,
      scope // Store scope on suspect for context-aware descriptions
    });
  });

  return suspects;
}