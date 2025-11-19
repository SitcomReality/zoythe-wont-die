import { HERO_ARCHETYPES, WORLD_TONES } from "../config/constants.js";

export function resolveEnding({ gameState }) {
  const { player, world } = gameState;
  const key = `${player.archetype}:${world.tone}`;

  // Placeholder mapping for later narrative expansion.
  switch (key) {
    case `${HERO_ARCHETYPES.EPIC}:${WORLD_TONES.MYTHIC}`:
      return "You ascend among the dying crowns, a final, blazing contradiction.";
    default:
      return "As the last god flickers, the world remembers you—not as you were, but as you chose to be.";
  }
}