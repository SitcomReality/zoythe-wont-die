import { WORLD_TONES } from "../config/constants.js";

export function createWorldState({ rng }) {
  return {
    tone: WORLD_TONES.MYTHIC,
    activeEffects: [],
    flags: Object.create(null),
    tags: [],
    deathScenario: null, // Will store death scenario details
    setting: null, // Concrete setting details
    scope: null, // Story scope
    applyDelta(delta) {
      for (const [k, v] of Object.entries(delta)) {
        if (k === "tags" && Array.isArray(v)) {
          this.tags.push(...v);
        } else if (k === "activeEffects" && Array.isArray(v)) {
          this.activeEffects.push(...v);
        } else if (k === "setting" && v) {
          this.setting = v;
        } else {
          this[k] = v;
        }
      }
    },
    addEffect(effect) {
      this.activeEffects.push(effect);
    },
    removeEffect(effectId) {
      const idx = this.activeEffects.findIndex(e => e.id === effectId);
      if (idx >= 0) this.activeEffects.splice(idx, 1);
    }
  };
}

