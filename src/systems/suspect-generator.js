import { NPC_ROLES } from "../config/constants.js";
import { generateUniqueName } from "./name-generator.js";
import { generateTraitDescription, selectTrait } from "./trait-library.js";

const SUSPECT_TEMPLATES = [
  { 
    role: NPC_ROLES.MENTOR, 
    motive: "To prevent a catastrophic prophecy from fulfilling.",
    baseSuspicion: 0.3
  },
  { 
    role: NPC_ROLES.RIVAL, 
    motive: "To eliminate the competition for the divine throne.",
    baseSuspicion: 0.8
  },
  { 
    role: NPC_ROLES.ALLY, 
    motive: "A debt to a dark power that demanded a life.",
    baseSuspicion: 0.2
  },
  { 
    role: NPC_ROLES.LOVE_INTEREST, 
    motive: "A twisted attempt to 'save' you from a worse fate.",
    baseSuspicion: 0.4
  },
  { 
    role: NPC_ROLES.ENEMY, 
    motive: "Simple, brutal revenge for past grievances.",
    baseSuspicion: 0.9
  }
];

export function generateCohort({ rng, twistTemplate }) {
  const suspects = new Map();
  const count = 4; // Generate 4 suspects
  
  const usedNames = new Set();
  
  // Pick templates
  let templates = [];
  for(let i=0; i<count; i++) {
    templates.push(rng.pick(SUSPECT_TEMPLATES));
  }
  
  templates.forEach((tmpl, idx) => {
    const name = generateUniqueName(rng, usedNames);
    const descriptor = generateTraitDescription(rng, name);

    const id = `suspect-${idx}-${name.toLowerCase()}`;
    
    // Create relationships stub
    const relationships = [];
    
    suspects.set(id, {
      id,
      name,
      descriptor,
      role: tmpl.role,
      motive: tmpl.motive,
      suspicionLevel: tmpl.baseSuspicion,
      alibi: {
        statement: "I was meditating in the void gardens.",
        isTrue: true, // Default, killer's will be flipped later
        breakCondition: null
      },
      relationships
    });
  });

  return suspects;
}