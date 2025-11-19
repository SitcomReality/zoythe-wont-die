export function createRailroadEngine({ gameState, eventBus }) {
  const REFUSAL_THRESHOLD = 2;
  const THREAT_CRITICAL = 4;

  function checkRefusalRails() {
    const { narrative, world } = gameState;

    if (narrative.refusalCount >= REFUSAL_THRESHOLD) {
      return {
        type: "forced-departure",
        reason: "Repeated refusals trigger divine intervention",
        severity: Math.min(narrative.refusalCount - REFUSAL_THRESHOLD + 1, 3)
      };
    }

    if (world.homeThreatLevel >= THREAT_CRITICAL) {
      return {
        type: "urgent-crisis",
        reason: "Home threat reaches critical levels",
        severity: 3
      };
    }

    return null;
  }

  function checkStallRails() {
    const { narrative } = gameState;

    // If stuck in same phase for too long
    const recentBeats = narrative.choiceHistory.slice(-5);
    const phases = recentBeats.map(b => narrative.phase);
    const uniquePhases = new Set(phases);

    if (uniquePhases.size === 1 && recentBeats.length >= 5) {
      return {
        type: "phase-push",
        reason: "Narrative stalled in current phase",
        severity: 2
      };
    }

    return null;
  }

  function checkRelationshipRails() {
    const { player } = gameState;

    // Check for betrayals
    const betrayals = Array.from(player.relationships.values())
      .filter(rel => rel.score < -2);

    if (betrayals.length >= 2) {
      return {
        type: "divine-curse",
        reason: "Multiple betrayals invoke divine punishment",
        severity: 2
      };
    }

    return null;
  }

  function evaluateRails() {
    const rails = [
      checkRefusalRails(),
      checkStallRails(),
      checkRelationshipRails()
    ].filter(Boolean);

    // Sort by severity, highest first
    rails.sort((a, b) => b.severity - a.severity);

    return rails;
  }

  function invokeRail(rail) {
    const { narrative } = gameState;
    narrative.addRail(rail.type, rail.reason);
    eventBus.emit("railroad:invoked", rail);

    return rail;
  }

  return {
    evaluateRails,
    invokeRail,
    checkRefusalRails,
    checkStallRails,
    checkRelationshipRails
  };
}