/** 
 * Consequence Tracker
 * Manages consequence chains and their manifestations
 */

export const CONSEQUENCE_TYPES = {
  RELATIONSHIP_SHIFT: "relationshipShift",
  REPUTATION_IMPACT: "reputationImpact",
  INVESTIGATION_BLOCK: "investigationBlock",
  INVESTIGATION_REVEAL: "investigationReveal",
  LOCATION_CHANGE: "locationChange",
  NPC_BEHAVIOR_SHIFT: "npcBehaviorShift",
  SUSPECT_ELIMINATION: "suspectElimination",
  CLUE_GENERATION: "clueGeneration",
  TIME_PRESSURE: "timePressure",
  MORAL_CORRUPTION: "moralCorruption"
};

export function createConsequenceTracker() {
  return {
    // Registry of all consequences that have been registered
    consequences: [],

    /** 
     * Register a consequence for a choice
     * @param {Object} data - Consequence data
     */
    registerConsequence({
      id,
      type,
      sourceChoice,
      sourceBeat,
      description,
      triggerBeat = null, // null = immediate, or beatId for deferred
      triggerCondition = null, // fn(gameState) => boolean
      manifestation = null, // fn(gameState) to apply consequence
      severity = "minor", // minor, moderate, severe
      relatedNpc = null,
      relatedClue = null,
      chainNext = null // Next consequence ID to trigger if this fulfills
    }) {
      this.consequences.push({
        id,
        type,
        sourceChoice,
        sourceBeat,
        description,
        triggerBeat,
        triggerCondition,
        manifestation,
        severity,
        relatedNpc,
        relatedClue,
        chainNext,
        fulfilled: false,
        manifestedAt: null,
        timestamp: Date.now()
      });

      return id;
    },

    /** 
     * Evaluate which consequences should manifest in current beat
     * @param {Object} gameState - Current game state
     * @param {string} currentBeatId - Current beat ID
     * @returns {Array} Consequences ready to manifest
     */
    getActiveConsequences(gameState, currentBeatId) {
      const active = [];

      for (const consequence of this.consequences) {
        if (consequence.fulfilled) continue;

        // Check trigger conditions
        const shouldTrigger = 
          (consequence.triggerBeat === null || consequence.triggerBeat === currentBeatId) &&
          (!consequence.triggerCondition || consequence.triggerCondition(gameState));

        if (shouldTrigger) {
          active.push(consequence);
        }
      }

      return active;
    },

    /** 
     * Manifest a consequence (apply its effects)
     * @param {string} consequenceId - Consequence to manifest
     * @param {Object} gameState - Game state to modify
     */
    manifestConsequence(consequenceId, gameState) {
      const consequence = this.consequences.find(c => c.id === consequenceId);
      if (!consequence || consequence.fulfilled) return false;

      // Apply manifestation function if provided
      if (consequence.manifestation) {
        consequence.manifestation(gameState);
      }

      // Mark as fulfilled
      consequence.fulfilled = true;
      consequence.manifestedAt = Date.now();

      // Chain next consequence if applicable
      if (consequence.chainNext) {
        const next = this.consequences.find(c => c.id === consequence.chainNext);
        if (next && !next.fulfilled) {
          // Make next consequence available immediately or at next trigger
          // System will evaluate it naturally
        }
      }

      return true;
    },

    /** 
     * Get consequences by source choice
     * @param {string} choiceId - Choice ID
     * @returns {Array}
     */
    getConsequencesByChoice(choiceId) {
      return this.consequences.filter(c => c.sourceChoice === choiceId);
    },

    /** 
     * Get consequences by beat
     * @param {string} beatId - Beat ID
     * @returns {Array}
     */
    getConsequencesByBeat(beatId) {
      return this.consequences.filter(c => c.sourceBeat === beatId);
    },

    /** 
     * Get unfulfilled consequences
     * @returns {Array}
     */
    getUnfulfilledConsequences() {
      return this.consequences.filter(c => !c.fulfilled);
    },

    /** 
     * Get consequences relevant to a specific NPC
     * @param {string} npcId - NPC ID
     * @returns {Array}
     */
    getConsequencesByNpc(npcId) {
      return this.consequences.filter(c => c.relatedNpc === npcId);
    },

    /** 
     * Get consequence chains (consequences that chain to others)
     * @returns {Array}
     */
    getConsequenceChains() {
      return this.consequences.filter(c => c.chainNext !== null);
    },

    /** 
     * Get consequences by type
     * @param {string} type - Consequence type
     * @returns {Array}
     */
    getConsequencesByType(type) {
      return this.consequences.filter(c => c.type === type);
    },

    /** 
     * Serialize consequences for save
     * @returns {Array}
     */
    serialize() {
      return this.consequences;
    },

    /** 
     * Deserialize consequences from save
     * @param {Array} data - Serialized consequences
     */
    deserialize(data) {
      if (!data) return;
      this.consequences = data;
    }
  };
}