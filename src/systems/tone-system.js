import { WORLD_TONES } from "../config/constants.js";

export function updateWorldTone({ world, player }) {
  const { devotion, doubt, compassion } = player.stats;

  if (devotion >= doubt + 2) {
    world.tone = WORLD_TONES.MYTHIC;
  } else if (compassion >= doubt + 2) {
    world.tone = WORLD_TONES.HOPEFUL;
  } else if (doubt >= devotion + 2) {
    world.tone = WORLD_TONES.NIHILISTIC;
  } else {
    world.tone = WORLD_TONES.BITTERSWEET;
  }
}

