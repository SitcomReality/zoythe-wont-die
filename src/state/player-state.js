import { HERO_ARCHETYPES } from "../config/constants.js";

export function createPlayerState({ rng }) {
  return {
    name: null,
    archetype: HERO_ARCHETYPES.RELUCTANT,
    heroism: 0,
    stats: {
      resolve: 0,
      compassion: 0,
      ambition: 0,
      devotion: 0,
      doubt: 0
    },
    flags: Object.create(null),
    relationships: new Map(),
    inventory: [],
    applyDelta(delta) {
      if (!delta) return;
      for (const [k, v] of Object.entries(delta)) {
        if (k in this.stats) {
          this.stats[k] += v;
        } else if (k === "heroism") {
          this.heroism += v;
        } else if (k === "resolve") {
          this.stats.resolve += v;
        } else {
          this.flags[k] = v;
        }
      }
    },
    addRelationship(npc) {
      this.relationships.set(npc.id, {
        name: npc.name,
        role: npc.role,
        type: npc.type,
        score: 0
      });
    },
    updateRelationship(npcId, delta) {
      const rel = this.relationships.get(npcId);
      if (rel) {
        rel.score += delta;
      }
    },
    addToInventory(item) {
      this.inventory.push(item);
    },
    removeFromInventory(itemId) {
      const idx = this.inventory.findIndex(i => i.id === itemId);
      if (idx >= 0) this.inventory.splice(idx, 1);
    }
  };
}