export function createRailroadEngine({ gameState, eventBus }) {
  const REFUSAL_THRESHOLD = 3;
  const THREAT_CRITICAL = 5;

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
    const phaseChanges = new Set(recentBeats.map(b => gameState.narrative.phase));

    if (phaseChanges.size === 1 && recentBeats.length >= 5) {
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
      .filter(rel => rel.score < -3);

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