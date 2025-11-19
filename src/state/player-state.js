import { HERO_ARCHETYPES } from "../config/constants.js";

export function createPlayerState({ rng }) {
  return {
    name: null,
    archetype: HERO_ARCHETYPES.RELUCTANT,
    stats: {
      resolve: 0,
      compassion: 0,
      ambition: 0,
      devotion: 0,
      doubt: 0
    },
    flags: Object.create(null),
    applyDelta(delta) {
      if (!delta) return;
      for (const [k, v] of Object.entries(delta)) {
        if (k in this.stats) {
          this.stats[k] += v;
        } else {
          this.flags[k] = v;
        }
      }
    }
  };
}