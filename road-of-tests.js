// ... existing code ...
async enter({ gameState, rng, beatRepeatCount, previousPage, previousChoice }) {
  const clue = getUndiscoveredClue(gameState.mystery);

  // Track investigation depth for this beat
  const hasInvestigated = beatRepeatCount > 0;
  const investigationDepth = beatRepeatCount; // 0 = first visit, 1 = second, etc.
  const maxInvestigationIterations = 3; // After 3 investigations, encourage moving on

  let instructions = "";

  if (clue) {
    instructions = getRoadOfTestsPrompt({
      iteration: beatRepeatCount + 1,
      clue
    });

    // After 2+ investigations, add to prompt: encourage moving on
    if (investigationDepth >= 2) {
      instructions += `\n\nNarrative Guidance: The player has investigated thoroughly. Include a choice that explicitly offers to "Move on" or "Accept what you've found" to signal that advancement is available and encouraged (but not forced).`;
    }

    gameState.narrative.pendingClueId = clue.id;
  } else {
    instructions = `
      This is a transition scene. The trail has gone cold for a moment.
      The world glitches violently.
      ${hasInvestigated ? `This is investigation attempt ${beatRepeatCount + 1}. The environment is degrading further with each return.` : ""}
      Provide choices to either keep searching in a new location or accept your findings and move forward.
    `;
    gameState.narrative.pendingClueId = null;
  }

  const content = await generateBeatContent({
    gameState,
    instructions,
    beatId: firstTrialId,
    previousPage,
    previousChoice
  });

  // Enhance choices with metadata about investigation vs advancement
  const choices = content.choices.map(c => {
    const isInvestigation = c.label.toLowerCase().includes("investigate") || 
                              c.label.toLowerCase().includes("examine") ||
                              c.label.toLowerCase().includes("search");
    const isAdvance = c.label.toLowerCase().includes("move") || 
                      c.label.toLowerCase().includes("accept") ||
                      c.label.toLowerCase().includes("continue") ||
                      c.label.toLowerCase().includes("leave");

    return {
      ...c,
      id: `${firstTrialId}:${c.id}`,
      investigationChoice: isInvestigation,
      advanceChoice: isAdvance
    };
  });

  return {
    phase: LOOP_PHASES.ASCENT,
    text: { title: content.title, body: content.body },
    shouldAdvance: false, // Don't auto-advance from investigation beat; let player decide
    choices
  };
},

applyChoice(choice, { gameState }) {
  const { pendingClueId } = gameState.narrative;
  const isPassive = choice.id.includes("ignore") || choice.id.includes("flee") || choice.id.includes("rest");
  const isAdvanceChoice = choice.advanceChoice === true;

  // Check if choice leads to clue discovery
  if (pendingClueId && !isPassive) {
    gameState.mystery.clues.discovered.add(pendingClueId);
  }

  // Decide whether to advance or stay
  const cluesFound = gameState.mystery.clues.discovered.size;

  // After finding enough clues (majority), allow advancement
  if (cluesFound >= Math.max(3, Math.ceil(gameState.mystery.clues.all.size * 0.6))) {
    // If player explicitly chooses to move on, definitely advance
    if (isAdvanceChoice) {
      return "heroJourney:ordeal:heartOfInterregnum";
    }
    // If they continue investigating, they can stay, but suggest advancement
    if (!choice.investigationChoice) {
      return "heroJourney:ordeal:heartOfInterregnum";
    }
  }

  // If player chooses to advance/move on, advance
  if (isAdvanceChoice) {
    return "heroJourney:ordeal:heartOfInterregnum";
  }

  // If player is investigating (not advancing), stay in beat
  if (choice.investigationChoice) {
    return null; // Stay in beat, will repeat
  }

  // If AI recommends advancing or we have no pending clues, consider advancing
  const aiWantsAdvance = gameState.narrative.aiShouldAdvance !== false;
  if (aiWantsAdvance && !pendingClueId && gameState.narrative.beatRepeatCount >= 1) {
    return "heroJourney:ordeal:heartOfInterregnum";
  }

  // Default: stay in beat for more exploration
  return null;
}
