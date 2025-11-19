import { LOOP_PHASES } from "../config/constants.js";

export function createNarrativeState() {
  return {
    runId: 0,
    phase: LOOP_PHASES.INTRO,
    beatIndex: 0,
    history: [],
    pendingChoices: [],
    lastBeatId: null
  };
}