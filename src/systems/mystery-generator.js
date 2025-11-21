import { generateCohort } from "./suspect-generator.js";
import { seedClues } from "./clue-generator.js";
import { ensureSolvable } from "./mystery-validator.js";

const TWIST_TEMPLATES = [
  {
    id: "mentorBetrayal",
    name: "The Mentor's Secret",
    description: "The trusted guide harbored dark motives",
    requiredRoles: ["mentor"],
    killerRolePreference: "mentor"
  },
  {
    id: "cosmicConspiracy",
    name: "Divine Conspiracy",
    description: "Multiple gods orchestrated the death",
    requiredRoles: ["divineRemnant", "zealot"],
    killerRolePreference: "divineRemnant"
  },
  {
    id: "personalRevenge",
    name: "Vengeful Past",
    description: "An old wound seeks retribution",
    requiredRoles: ["rival", "loveInterest"],
    killerRolePreference: "rival"
  },
  {
    id: "mistakenlIdentity",
    name: "Wrong Target",
    description: "You were killed by mistake",
    requiredRoles: ["ally", "enemy"],
    killerRolePreference: "enemy"
  },
  {
    id: "sacrificialRitual",
    name: "The Necessary Sacrifice",
    description: "Your death was meant to prevent something worse",
    requiredRoles: ["mentor", "zealot"],
    killerRolePreference: "zealot"
  }
];

const VICTIM_ARCHETYPES = [
  "martyr",
  "traitor",
  "innocent",
  "prophet",
  "thief",
  "witness"
];

const WEAPON_TYPES = {
  PHYSICAL: [
    {
      id: "divine-dagger",
      type: "physical",
      name: "Divine Dagger",
      description: "A ceremonial blade stolen from a dying god's shrine",
      linkToDeathGod: "Forged from the Death God's own rib, it can sever souls",
      discoveryTier: 2
    },
    {
      id: "blessed-garrote",
      type: "physical",
      name: "Blessed Garrote",
      description: "A strangling wire inscribed with prayers",
      linkToDeathGod: "The prayers invoke the Death God's name—now corrupted",
      discoveryTier: 2
    }
  ],
  COSMIC: [
    {
      id: "unraveling-curse",
      type: "cosmic",
      name: "The Unraveling Curse",
      description: "A spell that causes reality to reject a soul",
      linkToDeathGod: "Cast using stolen fragments of the Death God's dying breath",
      discoveryTier: 3
    },
    {
      id: "void-touch",
      type: "cosmic",
      name: "Void Touch",
      description: "A technique that erases someone from existence",
      linkToDeathGod: "Only possible in the moment the Death God fell",
      discoveryTier: 3
    }
  ],
  INFORMATIONAL: [
    {
      id: "forbidden-knowledge",
      type: "informational",
      name: "Forbidden Knowledge",
      description: "A secret so terrible it kills those who learn it",
      linkToDeathGod: "The truth of what caused the Death God's demise",
      discoveryTier: 3
    }
  ]
};

export function createMystery({ rng }) {
  // 1. Select Twist Template
  const twist = rng.pick(TWIST_TEMPLATES);

  // 2. Generate Victim Profile
  const victim = {
    id: "player",
    name: null, // Set during character creation
    archetypeHint: rng.pick(VICTIM_ARCHETYPES),
    causeOfDeath: {
      knownToPlayer: false,
      description: "You remember nothing, except that you were murdered."
    },
    bodyLocation: generateBodyLocation(rng)
  };

  // 3. Generate Weapon
  const weaponCategory = rng.pick(["PHYSICAL", "COSMIC", "INFORMATIONAL"]);
  const weaponPool = WEAPON_TYPES[weaponCategory];
  const weapon = rng.pick(weaponPool);

  // 4. Generate Suspects
  const suspects = generateCohort({ rng, twistTemplate: twist });

  // 5. Select Killer
  const killerId = selectKiller({ suspects, twist, rng });

  // 6. Seed Clues
  const clues = seedClues({ suspects, killerId, weapon, rng, twistTemplate: twist });

  // 7. Initialize Progress
  const progress = {
    accusationMade: false,
    correctKillerAccused: false,
    weaponSecured: false,
    cluesFoundCount: 0
  };

  const mystery = {
    twist: twist.id,
    victim,
    killerId,
    weapon,
    suspects,
    clues: {
      all: clues,
      discovered: new Set(),
      knownSuspects: new Set()
    },
    progress
  };

  // 8. Validate
  const validation = ensureSolvable(mystery);
  if (!validation.valid) {
    console.warn("[mystery-generator] Generated mystery failed validation:", validation.issues);
    // In a production system, we might regenerate here
    // For now, we'll log and continue
  }

  return mystery;
}

function generateBodyLocation(rng) {
  const locations = [
    "the steps of a ruined temple",
    "a crossroads between dying worlds",
    "the shore of the River of Souls",
    "beneath a dying god's statue",
    "in the ashes of your own home",
    "at the threshold of the afterlife gates"
  ];
  return rng.pick(locations);
}

function selectKiller({ suspects, twist, rng }) {
  // Try to find a suspect matching the twist's preferred role
  const preferred = Array.from(suspects.values()).filter(
    s => s.role === twist.killerRolePreference
  );

  if (preferred.length > 0) {
    return rng.pick(preferred).id;
  }

  // Fallback: pick any suspect
  const allSuspects = Array.from(suspects.values());
  return rng.pick(allSuspects).id;
}