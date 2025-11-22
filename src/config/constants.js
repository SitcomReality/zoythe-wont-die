export const GAME_ID = "zoythe-supernal-interregnum";

export const HERO_ARCHETYPES = {
  EPIC: "epic",
  TRAGIC: "tragic",
  REDEMPTIVE: "redemptive",
  RELUCTANT: "reluctant",
  ROMANTIC: "romantic"
};

export const WORLD_TONES = {
  SOMBER: "somber",
  HOPEFUL: "hopeful",
  BITTERSWEET: "bittersweet",
  NIHILISTIC: "nihilistic",
  MYTHIC: "mythic"
};

export const LOOP_PHASES = {
  INTRO: "intro",
  ASCENT: "ascent",
  ORDEAL: "ordeal",
  RETURN: "return",
  EPILOGUE: "epilogue"
};

export const NPC_ROLES = {
  MENTOR: "mentor",
  LOVE_INTEREST: "loveInterest",
  RIVAL: "rival",
  ALLY: "ally",
  ENEMY: "enemy",
  DIVINE_REMNANT: "divineRemnant"
};

export const NPC_TYPES = {
  ALLY: "ally",
  ENEMY: "enemy",
  NEUTRAL: "neutral",
  LOVE_INTEREST: "loveInterest"
};

export const CHOICE_CLASSIFICATIONS = {
  ADVANCE: "advance",
  RETREAT: "retreat",
  FIGHT: "fight",
  FLEE: "flee",
  PARLEY: "parley",
  STEALTH: "stealth",
  MERCY: "mercy",
  CRUELTY: "cruelty",
  SACRIFICE: "sacrifice",
  ACCEPT_QUEST: "acceptQuest",
  REFUSE_QUEST: "refuseQuest",
  SEEK_MENTOR: "seekMentor",
  BUILD_ALLIANCE: "buildAlliance",
  BETRAY_ALLY: "betrayAlly",
  DIRECT: "direct",
  CAUTIOUS: "cautious",
  CLEVER: "clever",
  INVESTIGATE: "investigate",
  INTERROGATE: "interrogate",
  ACCUSE: "accuse",
  ANALYZE: "analyze"
};

export const MACGUFFIN_STATUS = {
  NONE: "none",
  PRIMARY_ACQUIRED: "primaryAcquired",
  BACKUP_ACQUIRED: "backupAcquired",
  DESTROYED: "destroyed",
  MISSING: "missing",
  BOUND: "bound"
};

export const DIVINE_FACTIONS = {
  VERDANT_COURT: "verdantCourt",
  IRON_CHOIR: "ironChoir",
  SALT_KINGS: "saltKings",
  PALE_LEDGER: "paleLedger"
};

export const STORY_SCOPE = {
  INTIMATE: "intimate",
  REGIONAL: "regional",
  NATIONAL: "national",
  COSMIC: "cosmic"
};

export const SCOPE_DETAILS = {
  intimate: {
    name: "Intimate",
    description: "A personal story: family, friends, neighbors",
    maxPowerLevel: 2,
    scaleDescriptor: "local"
  },
  regional: {
    name: "Regional",
    description: "A community story: mayors, priests, aristocrats",
    maxPowerLevel: 4,
    scaleDescriptor: "regional"
  },
  national: {
    name: "National",
    description: "A grand story: royalty, generals, religious leaders",
    maxPowerLevel: 6,
    scaleDescriptor: "national"
  },
  cosmic: {
    name: "Cosmic",
    description: "An epic story: gods, divine beings, reality itself",
    maxPowerLevel: 10,
    scaleDescriptor: "cosmic"
  }
};

