// ... existing code up to applyChoice ...
    // If returning to same beat or no next beat, increment repeat count
    if (!nextBeatId || nextBeatId === currentBeatId) {
      gameState.narrative.incrementBeatRepeatCount();
      // Only increment urgency if this was NOT an investigation choice
      // Investigation is legitimate use of time; don't penalize it
      const isInvestigationChoice = choice.investigationType !== undefined || 
                                    choice.investigationChoice === true;
      if (!isInvestigationChoice) {
        gameState.narrative.incrementBeatRepeatCount(); // Double increment for non-investigation
      }
    } else {
      // Moving to new beat: reset repeat count
      gameState.narrative.resetBeatRepeatCount();
      gameState.narrative.beatIndex += 1;
    }

    if (nextBeatId) {
      runBeat(nextBeatId);
    } else {
      // Stay in current beat but re-run it with updated repeat count
      runBeat(currentBeatId);
    }
// ... rest of code ...