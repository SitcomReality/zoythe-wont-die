export const FORESHADOWING_STRENGTH = {
  SUBTLE: "subtle",
  MODERATE: "moderate",
  OBVIOUS: "obvious"
};

/**
 * Foreshadowing Tracker
 * Manages planned hints for future twists/reveals so earlier beats can seed them.
 */
export function createForeshadowingTracker() {
  return {
    entries: [],

    /**
     * Register a new foreshadowing need.
     * @param {Object} data
     * @param {string} data.id - Unique id for this foreshadowing thread
     * @param {string} data.type - e.g. "resurrectionTwist", "mysteryTwist"
     * @param {string} data.summary - Short description of what will be revealed later
     * @param {string} data.detail - Guidance for how to hint at it
     * @param {string[]} [data.targetBeats] - Optional beatIds where hints would fit best
     * @param {string} [data.strength] - subtle | moderate | obvious
     */
    registerNeed({
      id,
      type,
      summary,
      detail,
      targetBeats = null,
      strength = FORESHADOWING_STRENGTH.SUBTLE
    }) {
      // Avoid duplicates by id
      if (this.entries.find(e => e.id === id)) return;

      this.entries.push({
        id,
        type,
        summary,
        detail,
        targetBeats,
        strength,
        delivered: false,
        createdAt: Date.now(),
        deliveredAt: null
      });
    },

    /**
     * Get foreshadowing entries that are not yet delivered and are suitable for this beat.
     * @param {string} beatId
     */
    getPendingForBeat(beatId) {
      return this.entries.filter(e => {
        if (e.delivered) return false;
        
        // If explicit targets are set, only return if beatId matches
        if (e.targetBeats && Array.isArray(e.targetBeats) && e.targetBeats.length > 0) {
          return e.targetBeats.includes(beatId);
        }
        
        // If no targets set, it's a "global" hint that can drop anywhere
        // (Be careful with this, usually better to have targets)
        return true;
      });
    },

    /**
     * Mark a foreshadowing hint as delivered.
     * @param {string} id
     */
    markDelivered(id) {
      const entry = this.entries.find(e => e.id === id);
      if (!entry || entry.delivered) return;
      entry.delivered = true;
      entry.deliveredAt = Date.now();
    },

    /**
     * Get all pending foreshadowing entries.
     */
    getAllPending() {
      return this.entries.filter(e => !e.delivered);
    },

    /**
     * Serialize to plain data for persistence.
     */
    serialize() {
      return this.entries;
    },

    /**
     * Deserialize from saved data.
     * @param {Array} data
     */
    deserialize(data) {
      if (!Array.isArray(data)) return;
      this.entries = data;
    }
  };
}