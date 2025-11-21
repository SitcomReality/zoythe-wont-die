import { CHOICE_CLASSIFICATIONS } from "../../config/constants.js";
import { generateTerminologyContext, substituteTerminology } from "../../systems/terminology-thesaurus.js";
import buildSystemPrompt from "../../prompts/systemPrompt.js";

export async function generateBeatContent({ gameState, instructions, beatId }) {
  const { player, world, narrative, mystery, rng } = gameState;

  // Generate randomized terminology for this beat
  const terminology = generateTerminologyContext(rng);

  // Prepare context for the AI
  const recentHistory = narrative.history.slice(-3).map(h => ({
    title: h.title,
    summary: h.body ? h.body.substring(0, 150) + "..." : ""
  }));

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
        return clue ? `${clue.label}: ${clue.description}` : null;
    }).filter(Boolean);

    mysteryContext = {
      victim: mystery.victim.name,
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
      threat: world.homeThreat?.name,
      macGuffin: world.primaryMacGuffin?.name,
      tags: world.tags,
    },
    mystery: mysteryContext,
    history: recentHistory
  };

  // Build system prompt using external template
  const systemPrompt = buildSystemPrompt({
    terminology,
    worldTone: world.tone,
    choiceClassifications: Object.values(CHOICE_CLASSIFICATIONS)
  });

  // Substitute terminology in instructions
  const substitutedInstructions = substituteTerminology(instructions, terminology);

  const userPrompt = `
Current State: ${JSON.stringify(context, null, 2)}

Beat Instructions: ${substitutedInstructions}

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

    return JSON.parse(completion.content);
  } catch (error) {
    console.error("LLM generation failed:", error);
    throw error;
  }
}