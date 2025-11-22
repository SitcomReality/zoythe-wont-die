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
  // Filter pending foreshadowing to only items targeting the current beat (or untargeted ones if we want fallback behavior, but targeted is safer)
  // The ForeshadowingTracker's getPendingForBeat already handles the filtering logic.
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
    // Filter for known info only
    const knownSuspects = Array.from(mystery.suspects.values()).map(s => ({
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
          // Expose red herring status to the model without revealing it in-story
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
      primaryMacGuffin: (mystery && mystery.weapon) ? mystery.weapon : (world.primaryMacGuffin || null)
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

  // Build system prompt with scope included
  const systemPrompt = buildSystemPrompt({
    terminology,
    worldTone: world.tone,
    choiceClassifications: Object.values(CHOICE_CLASSIFICATIONS),
    scope: mystery?.scope || world.scope || "regional"
  });

  // Substitute terminology in instructions
  const substitutedInstructions = substituteTerminology(instructions, terminology);

  const userPrompt = `
Current State: ${JSON.stringify(context, null, 2)}

Beat Instructions: ${substitutedInstructions}

Foreshadowing Guidance:
- The "foreshadowing.pending" array in the Current State lists future twists or reveals.
- When it feels natural for this beat, add subtle hints or atmospheric details that allude to these without naming the twist directly.
- Do NOT spoil the twist; just make the world or NPC behavior gently point in that direction.

Clue-Based Choices Guidance:
- The "mystery.knownClues" array in the Current State lists clues the player has already discovered, including which ones have been used in previous choices.
- When relevant to the scene or NPC, offer 0–2 OPTIONAL choices that explicitly reference one or more of these clues by name (for example: "Ask about the muddy footprints" or "Confront them with the Witness Statement").
- Prefer using clues where hasBeenUsedInChoice=false so that each clue can shine at least once.
- Some clue-using choices can be red herrings or partial dead-ends, but they should never make the mystery unsolvable.
- Do not make clue-using choices the ONLY way to advance; always include at least one non-clue-based option that can move the story forward.

Generate content for beat ID: ${beatId}.
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

    // After successful generation, mark any foreshadowing used for this beat as delivered
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