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
    // Flags bag for ephemeral narrative markers (e.g., accusationResult)
    flags: Object.create(null),
    // New: Track beat repetition and urgency
    beatRepeatCount: 0, // How many times the current beat has been visited
    urgencyLevel: 0, // Accumulates when player doesn't advance; triggers railroading at threshold
    urgencyThreshold: 3, // Number of refusals/non-advancing choices before forced progression
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
      this.urgencyLevel++; // Refusals increase urgency
    },
    resetBeatRepeatCount() {
      this.beatRepeatCount = 0;
      this.urgencyLevel = 0; // Reset urgency when moving to new beat
    },
    incrementBeatRepeatCount() {
      this.beatRepeatCount++;
      this.urgencyLevel++; // Repeating also increases urgency
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