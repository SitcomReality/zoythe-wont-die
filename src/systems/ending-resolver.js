import { HERO_ARCHETYPES, WORLD_TONES } from "../config/constants.js";

export function resolveEnding({ gameState }) {
  const { player, world, narrative } = gameState;
  const archetype = player.archetype;
  const tone = world.tone;
  const mystery = gameState.mystery;
  const hasDivineCorruption = world.tags.includes("divine-corruption");

  // Divine Corruption path
  if (hasDivineCorruption) {
    if (archetype === HERO_ARCHETYPES.TRAGIC) {
      return "You ascend as a new god, but the cost is everything you loved. The case remains eternally open.";
    }
    return "Power courses through you—divine, terrible, transformative. You are no longer quite mortal. But the mystery haunts you still.";
  }

  // Investigation outcome
  if (mystery && mystery.progress.accusationMade) {
    const correctAccusation = mystery.progress.correctKillerAccused;
    const killer = mystery.suspects.get(mystery.killerId);
    const killerName = killer ? killer.name : "the true killer";

    if (correctAccusation) {
      switch (archetype) {
        case HERO_ARCHETYPES.EPIC:
          return tone === WORLD_TONES.MYTHIC 
            ? `You name ${killerName} before the assembled spirits. The case closes. The Interregnum shudders and begins to heal.`
            : `You expose the truth. It is not glorious, but it is justice. The broken world finds momentary peace.`;
        
        case HERO_ARCHETYPES.REDEMPTIVE:
          return `Through clarity and compassion, you reveal why ${killerName} acted. Understanding flows through the Interregnum. It matters.`;
        
        case HERO_ARCHETYPES.ROMANTIC:
          return `You solve your own death not for vengeance, but for love—for those left behind. ${killerName}'s name becomes a footnote to a better story.`;
        
        case HERO_ARCHETYPES.RELUCTANT:
          return `You never wanted to name names. But you did. The case is closed. The world moves on. You live with that.`;
        
        case HERO_ARCHETYPES.TRAGIC:
          return `You identify ${killerName}, but the truth breaks something in you. You are right. That does not make you whole.`;
        
        default:
          return `The killer stands revealed. ${killerName}. The mystery ends. What comes next is unknown.`;
      }
    } else {
      // Wrong accusation
      const innocent = mystery.suspects.get(mystery.killerId);
      const accused = mystery.suspects.values().next().value; // Placeholder; in real implementation would track actual accusation
      
      return archetype === HERO_ARCHETYPES.TRAGIC
        ? `You accuse the wrong soul. Reality convulses with your mistake. The true killer remains hidden. The Interregnum will never rest.`
        : `You name an innocent. The Interregnum rejects your answer. The mystery deepens. Your death remains unsolved.`;
    }
  }

  // Fallback (no investigation/accusation made)
  return "You tried to understand. Perhaps that is all anyone can do.";
}