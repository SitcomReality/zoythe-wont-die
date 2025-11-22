export function createRailroadEngine({ gameState, eventBus }) {
  const REFUSAL_THRESHOLD = 3; // Increased from 2

  function checkRefusalRails() {
    const { narrative } = gameState;

    // Only invoke if truly high refusal count AND urgency threshold exceeded
    if (narrative.refusalCount >= REFUSAL_THRESHOLD && narrative.urgencyLevel >= narrative.urgencyThreshold) {
      return {
        type: "forced-departure",
        reason: "Repeated refusals and urgency trigger divine intervention",
        severity: Math.min(narrative.refusalCount - REFUSAL_THRESHOLD + 1, 3)
      };
    }

    return null;
  }

  function checkStallRails() {
    const { narrative } = gameState;

    // Only trigger if VERY stuck (more than 8 repeated beats)
    if (narrative.beatRepeatCount > 8) {
      return {
        type: "phase-push",
        reason: "Narrative stalled for extended period",
        severity: 3
      };
    }

    return null;
  }

  function checkCriticalMomentRails() {
    const { narrative, mystery } = gameState;

    // Only railroad if we're past ordeal and no choice made yet
    const isOrdealPhase = narrative.phase === "ordeal";
    const noAccusationYet = mystery && !mystery.progress.accusationMade;

    // Critical railroads: force ordeal resolution after player is ready
    if (isOrdealPhase && narrative.urgencyLevel >= narrative.urgencyThreshold && noAccusationYet) {
      return {
        type: "forced-ordeal-resolution",
        reason: "Reality collapses; accusation becomes unavoidable",
        severity: 3
      };
    }

    return null;
  }

  function checkRelationshipRails() {
    const { player } = gameState;

    // Much more lenient: only if catastrophic relationship collapse
    const betrayals = Array.from(player.relationships.values())
      .filter(rel => rel.score < -5); // Increased threshold from -2 to -5

    if (betrayals.length >= 3) {
      return {
        type: "divine-curse",
        reason: "Multiple severe betrayals invoke divine punishment",
        severity: 2
      };
    }

    return null;
  }

  function evaluateRails() {
    const rails = [
      checkRefusalRails(),
      checkStallRails(),
      checkCriticalMomentRails(),
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
    checkCriticalMomentRails,
    checkRelationshipRails
  };
}