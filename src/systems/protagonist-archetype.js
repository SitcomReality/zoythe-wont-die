import { HERO_ARCHETYPES } from "../config/constants.js";

export function evaluateArchetype({ player }) {
  const { resolve, compassion, ambition, devotion, doubt } = player.stats;

  if (devotion + resolve >= ambition + doubt + 2) return HERO_ARCHETYPES.REDEMPTIVE;
  if (ambition >= resolve + compassion + 2) return HERO_ARCHETYPES.EPIC;
  if (doubt >= resolve + compassion + 1) return HERO_ARCHETYPES.RELUCTANT;
  if (compassion >= ambition + 2) return HERO_ARCHETYPES.ROMANTIC;
  if (doubt + ambition >= resolve + compassion + 1) return HERO_ARCHETYPES.TRAGIC;

  return player.archetype;
}

