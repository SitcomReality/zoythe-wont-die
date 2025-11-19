import { WORLD_TONES } from "../config/constants.js";

export function createWorldState({ rng }) {
  return {
    tone: WORLD_TONES.MYTHIC,
    dyingGodsLevel: 1,
    omensSeen: 0,
    flags: Object.create(null),
    applyDelta(delta) {
      Object.assign(this.flags, delta);
    }
  };
}

