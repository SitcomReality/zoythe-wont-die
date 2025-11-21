import { DIVINE_FACTIONS } from "../config/constants.js";

const FACTION_EFFECTS = {
  [DIVINE_FACTIONS.VERDANT_COURT]: [
    {
      id: "vine-storm",
      name: "Vine Storm",
      description: "Writhing vines fall from the sky like rain, seeking to strangle",
      severity: 2
    },
    {
      id: "blood-sap",
      name: "Blood Sap",
      description: "Trees weep crimson sap that burns the skin",
      severity: 1
    },
    {
      id: "choking-growth",
      name: "Choking Growth",
      description: "Plants grow with terrifying speed, consuming structures",
      severity: 3
    }
  ],
  [DIVINE_FACTIONS.IRON_CHOIR]: [
    {
      id: "bell-avalanche",
      name: "Bell Avalanche",
      description: "Phantom bells ring ceaselessly, driving mortals to madness",
      severity: 2
    },
    {
      id: "shard-winds",
      name: "Shard Winds",
      description: "Winds carry razor-sharp metal fragments",
      severity: 3
    },
    {
      id: "metallic-hymns",
      name: "Metallic Hymns",
      description: "Iron statues sing songs of forgotten wars",
      severity: 1
    }
  ],
  [DIVINE_FACTIONS.SALT_KINGS]: [
    {
      id: "brine-tsunami",
      name: "Brine Tsunami",
      description: "Waves of salt water crash inland, destroying everything",
      severity: 3
    },
    {
      id: "bone-tempest",
      name: "Bone Tempest",
      description: "Storms of calcified remains sweep across the land",
      severity: 2
    },
    {
      id: "salt-desert",
      name: "Creeping Salt",
      description: "The ground turns to salt, sterile and lifeless",
      severity: 2
    }
  ],
  [DIVINE_FACTIONS.PALE_LEDGER]: [
    {
      id: "ash-snow",
      name: "Ash Snow",
      description: "Gray snow falls endlessly, burying the world in silence",
      severity: 1
    },
    {
      id: "glass-hail",
      name: "Glass Hail",
      description: "Crystalline hail falls, each shard showing a sin committed",
      severity: 2
    },
    {
      id: "ledger-spirits",
      name: "Ledger Spirits",
      description: "Ghostly accountants tally every transgression aloud",
      severity: 1
    }
  ]
};

const GENERAL_EFFECTS = [
  {
    id: "blood-rain",
    name: "Blood Rain",
    description: "The sky weeps crimson, staining everything it touches",
    severity: 2
  },
  {
    id: "star-death",
    name: "Dying Stars",
    description: "Constellations flicker and fall, one by one",
    severity: 1
  },
  {
    id: "ghost-army",
    name: "Ghost Armies",
    description: "Spectral legions march across long abandoned battlefields",
    severity: 2
  },
  {
    id: "time-distortion",
    name: "Time Distortion",
    description: "Moments stretch and compress unpredictably",
    severity: 3
  }
];

export function generateInterregnumEffect({ rng, faction = null, severity = null }) {
  let pool = [...GENERAL_EFFECTS];

  if (faction && FACTION_EFFECTS[faction]) {
    pool = [...pool, ...FACTION_EFFECTS[faction]];
  }

  if (severity !== null) {
    pool = pool.filter(e => e.severity === severity);
  }

  if (pool.length === 0) {
    pool = GENERAL_EFFECTS;
  }

  return rng.pick(pool);
}

export function escalateEffect(currentEffect) {
  return {
    ...currentEffect,
    severity: Math.min(currentEffect.severity + 1, 3),
    description: currentEffect.description + " The effect intensifies."
  };
}

export function getEffectsBySeverity(severity) {
  const all = [
    ...GENERAL_EFFECTS,
    ...Object.values(FACTION_EFFECTS).flat()
  ];
  return all.filter(e => e.severity === severity);
}