import { HERO_ARCHETYPES, WORLD_TONES, MACGUFFIN_STATUS } from "../config/constants.js";

export function resolveEnding({ gameState }) {
  const { player, world } = gameState;
  const archetype = player.archetype;
  const tone = world.tone;
  const macguffinStatus = world.macGuffinStatus;
  const hasDivineCorruption = world.tags.includes("divine-corruption");

  // Divine Corruption path
  if (hasDivineCorruption) {
    if (archetype === HERO_ARCHETYPES.TRAGIC) {
      return "You ascend as a new god, but the cost is everything you loved. Home survives, twisted in your image.";
    }
    return "Power courses through you—divine, terrible, transformative. You are no longer quite mortal.";
  }

  // Primary MacGuffin success
  if (macguffinStatus === MACGUFFIN_STATUS.PRIMARY_ACQUIRED) {
    switch (archetype) {
      case HERO_ARCHETYPES.EPIC:
        return tone === WORLD_TONES.MYTHIC 
          ? "You stand among the dying gods, victorious. Legends will be sung of this day for a thousand years."
          : "You have won, but the cost is carved into your bones. Still, home endures.";
      
      case HERO_ARCHETYPES.REDEMPTIVE:
        return "Through mercy and sacrifice, you heal more than the threat. The world remembers your compassion.";
      
      case HERO_ARCHETYPES.ROMANTIC:
        return "Love guided you through darkness. Together with those you cherish, you forge a new dawn.";
      
      case HERO_ARCHETYPES.RELUCTANT:
        return "You never wanted this. But you did what was needed. That will have to be enough.";
      
      case HERO_ARCHETYPES.TRAGIC:
        return "The MacGuffin saved your home, but you are broken beyond repair. A hero's scars run deeper than flesh.";
      
      default:
        return "The threat ends. You return changed, carrying scars that will never fade.";
    }
  }

  // Backup MacGuffin path
  if (macguffinStatus === MACGUFFIN_STATUS.BACKUP_ACQUIRED) {
    return archetype === HERO_ARCHETYPES.REDEMPTIVE
      ? "The backup brought closure, not salvation. But sometimes closure is all we need to rebuild."
      : "You couldn't save everything. But what remains is precious—and yours to protect.";
  }

  // Failure states
  return "You tried. The gods noticed. That matters, even if the world doesn't remember.";
}