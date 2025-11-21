import { CHOICE_CLASSIFICATIONS } from "../../config/constants.js";
import { generateTerminologyContext, substituteTerminology } from "../../systems/terminology-thesaurus.js";

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

  const systemPrompt = `
You are the AI Game Master for "Zoythe", a darkly comedic murder-mystery set in a broken ${terminology.afterlife}.
Goal: Generate the next story beat.

TONE & STYLE GUIDE:
- Voice: Droll, irreverent, and slightly comedic (think "Douglas Adams meets a PG Deadpool").
- Reading Level: Young Adult / Tween. Simple words, short sentences. Avoid flowery "fantasy" prose or archaic words.
- Perspective: Second-person ("You..."). You are the protagonist. You see the farce in the end of the world. Lampshade the ${terminology.absurd}.
- Formatting: Use line breaks for pacing and emphasis, but less frequently.
  - Prefer grouping short sentences together on a single line when they form a coherent thought.
  - Reserve isolated single-line sentences for strong emphasis or beat moments.
  - Maintain readable, punchy paragraphs rather than breaking almost every sentence.
  - Make it look like a children's book layout occasionally: sparse and punchy, but not excessively split.

Context:
- Protagonist: A ${terminology.murder} victim investigating their own death.
- World Tone: ${world.tone} (but filtered through the droll, whimsical voice).

Format: JSON only.

Valid JSON Schema:
{
  "title": "string",
  "body": "string",
  "choices": [
    {
      "id": "string",
      "label": "string",
      "hint": "string (optional)",
      "classification": ["string"],
      "effects": { "player": {}, "world": {} }
    }
  ]
}

Valid Classifications: ${Object.values(CHOICE_CLASSIFICATIONS).join(", ")}.
Include 2-3 choices. If the player input a specific action, try to reflect its consequences in the narrative or choices.
`;

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