import { CHOICE_CLASSIFICATIONS } from "../../config/constants.js";
import { generateTerminologyContext, substituteTerminology } from "../../systems/terminology-thesaurus.js";
import buildSystemPrompt from "../../prompts/systemPrompt.js";

export async function generateBeatContent({ gameState, instructions, beatId, previousPage = null, previousChoice = null }) {
  const { player, world, narrative, mystery, memory, rng } = gameState;

  // Generate randomized terminology for this beat
  const terminology = generateTerminologyContext(rng);

  // Prepare context for the AI
  const recentHistory = narrative.history.slice(-3).map(h => ({
    title: h.title,
    summary: h.body ? h.body.substring(0, 150) + "..." : ""
  }));

  // Prepare memory context
  const memorySnapshot = {
    recentEvents: memory.getRecentEvents(3),
    knownLocations: memory.getLocationsSummary(),
    knownNpcs: memory.getKnownNpcs(),
    unfulfilledPromises: memory.getUnfulfilledPromises(),
    // Merge memory consequences with tracker consequences for complete picture
    activeConsequences: gameState.consequenceTracker 
      ? gameState.consequenceTracker.getUnfulfilledConsequences().map(c => ({
          description: c.description,
          type: c.type,
          severity: c.severity
        }))
      : []
  };

  // Prepare foreshadowing context
  const pendingForeshadowing = gameState.foreshadowingTracker
    ? gameState.foreshadowingTracker.getPendingForBeat(beatId).map(f => ({
        id: f.id,
        type: f.type,
        summary: f.summary,
        detail: f.detail,
        strength: f.strength
      }))
    : [];

  // Prepare mystery context (if active)
  let mysteryContext = null;
  if (mystery) {
    // Phase 2: Filter for known info only
    // Only include suspects the player has MET or has a RELATIONSHIP with
    const knownSuspects = Array.from(mystery.suspects.values())
      .filter(s => s.met || player.relationships.has(s.id))
      .map(s => ({
        name: s.name,
        role: s.role,
      }));
    
    const knownClues = Array.from(mystery.clues.discovered).map(id => {
        const clue = mystery.clues.all.get(id);
        if (!clue) return null;
        const usedSet = mystery.clues.usedInChoices || new Set();
        return {
          label: clue.label,
          description: clue.description,
          type: clue.type,
          context: clue.context,
          hasBeenUsedInChoice: usedSet.has(id),
          isRedHerring: clue.truthValue === false
        };
    }).filter(Boolean);

    mysteryContext = {
      victim: mystery.victim.name,
      deathLocation: mystery.deathScenario?.location || "unknown",
      deathScenarioType: mystery.deathScenario?.type || "unknown",
      knownSuspects,
      knownClues,
      progress: mystery.progress
    };
  }

  const context = {
    player: {
      archetype: player.archetype,
      heroism: player.heroism,
      stats: player.stats,
      relationships: Array.from(player.relationships.values()).map(r => ({
        name: r.name,
        role: r.role,
        score: r.score
      }))
    },
    world: {
      tone: world.tone,
      tags: world.tags,
      primaryMacGuffin: (mystery && mystery.weapon) ? mystery.weapon : (world.primaryMacGuffin || null),
      setting: world.setting // Add setting to context
    },
    memory: memorySnapshot,
    mystery: mysteryContext,
    foreshadowing: {
      pending: pendingForeshadowing
    },
    history: recentHistory,
    previousPage: previousPage ? {
      title: previousPage.title,
      body: previousPage.body
    } : null,
    previousChoice: previousChoice ? {
      label: previousChoice.label,
      id: previousChoice.id
    } : null,
    urgencyLevel: narrative.urgencyLevel,
    urgencyThreshold: narrative.urgencyThreshold,
    beatRepeatCount: narrative.beatRepeatCount
  };

  // Determine System Options
  const options = {
    railroadActive: narrative.railsInvoked.length > 0,
    railroadInstruction: narrative.railsInvoked.length > 0 ? narrative.railsInvoked[narrative.railsInvoked.length - 1].reason : null,
    isCombat: false // Placeholder for future combat detection logic
  };

  // Build system prompt with scope included
  const systemPrompt = buildSystemPrompt({
    terminology,
    worldTone: world.tone,
    choiceClassifications: Object.values(CHOICE_CLASSIFICATIONS),
    scope: mystery?.scope || world.scope || "regional",
    setting: world.setting,
    options
  });

  // Substitute terminology in instructions
  const substitutedInstructions = substituteTerminology(instructions, terminology);

  const userPrompt = `
=== PREVIOUS ACTION ===
The player chose: "${previousChoice ? previousChoice.label : "Start of Game"}"
${previousChoice ? `(Action ID: ${previousChoice.id})` : ""}

=== CURRENT CONTEXT ===
${JSON.stringify(context, null, 2)}

=== INSTRUCTIONS ===
${substitutedInstructions}

=== GENERATION GUIDELINES ===
1. START the narrative by describing the player performing the "Previous Action".
2. Ensure no choice labels reveal information not present in the text.
3. Generate content for beat ID: ${beatId}.
`;

  try {
    const completion = await websim.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      json: true
    });

    const result = JSON.parse(completion.content);

    if (gameState.foreshadowingTracker && pendingForeshadowing.length > 0) {
      for (const f of pendingForeshadowing) {
        gameState.foreshadowingTracker.markDelivered(f.id);
      }
    }

    return result;
  } catch (error) {
    console.error("LLM generation failed:", error);
    throw error;
  }
}