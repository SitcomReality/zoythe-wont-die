import { LOOP_PHASES } from "../config/constants.js";

export function createNarrativeState() {
  return {
    runId: 0,
    phase: LOOP_PHASES.INTRO,
    beatIndex: 0,
    history: [],
    pendingChoices: [],
    lastBeatId: null,
    refusalCount: 0,
    choiceHistory: [],
    railsInvoked: [],
    addChoice(choice, classification) {
      this.choiceHistory.push({
        beatIndex: this.beatIndex,
        choice,
        classification,
        timestamp: Date.now()
      });
    },
    incrementRefusal() {
      this.refusalCount++;
    },
    addRail(railType, reason) {
      this.railsInvoked.push({
        beatIndex: this.beatIndex,
        type: railType,
        reason,
        timestamp: Date.now()
      });
    }
  };
}