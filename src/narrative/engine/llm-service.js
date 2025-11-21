import { CHOICE_CLASSIFICATIONS } from "../../config/constants.js";

export async function generateBeatContent({ gameState, instructions, beatId }) {
  const { player, world, narrative, mystery } = gameState;

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
      // Only share motive/alibi if explicitly known (future feature), 
      // for now we share basic identity to allow conversation.
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
You are the AI Dungeon Master for "Zoythe", a murder-mystery RPG set in a glitching afterlife.
Goal: Generate the next story beat.
Context: The protagonist is a murder victim investigating their own death while the world ends.

Tone: ${world.tone}.
Writing Style: Evocative, concise (max 150 words), second-person ("You...").
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

  const userPrompt = `
Current State: ${JSON.stringify(context, null, 2)}

Beat Instructions: ${instructions}

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