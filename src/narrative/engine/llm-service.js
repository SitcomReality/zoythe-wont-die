import { CHOICE_CLASSIFICATIONS } from "../../config/constants.js";

export async function generateBeatContent({ gameState, instructions, beatId }) {
  const { player, world, narrative } = gameState;

  // Prepare context for the AI
  const recentHistory = narrative.history.slice(-3).map(h => ({
    title: h.title,
    summary: h.body ? h.body.substring(0, 150) + "..." : ""
  }));

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
      macGuffinStatus: world.macGuffinStatus,
      homeThreatLevel: world.homeThreatLevel,
      omensSeen: world.omensSeen
    },
    history: recentHistory
  };

  const systemPrompt = `
You are the AI Dungeon Master for "Zoythe", a text-based RPG set in a dying world (The Interregnum).
Your goal is to generate the next story beat based on the provided context and instructions.

Tone: ${world.tone} (e.g. Mythic, Nihilistic, Hopeful).
Writing Style: Evocative, concise (max 150 words), second-person ("You..."). Do not use markdown formatting in the JSON strings.

Return ONLY valid JSON matching this schema:
{
  "title": "string (short, thematic)",
  "body": "string (the narrative text)",
  "choices": [
    {
      "id": "string (short keyword, e.g. 'accept', 'fight')",
      "label": "string (action text)",
      "hint": "string (short tone hint, e.g. 'Bold', 'Risk')",
      "classification": ["string (must be from valid list)"],
      "effects": { 
        "player": { "stat_name": integer },
        "world": { 
          "property_name": value
        }
      }
    }
  ]
}

Valid Classifications: ${Object.values(CHOICE_CLASSIFICATIONS).join(", ")}.
Valid Player Stats: resolve, compassion, ambition, devotion, doubt, heroism.
World properties you MAY change in effects.world:
- omensSeen (integer, typically +1)
- homeThreatLevel (integer, positive or negative deltas)
- macGuffinStatus (string enum: "none", "primaryAcquired", "backupAcquired", "destroyed", "missing", "bound")
- tags (array of strings to push into world.tags, e.g. ["divine-corruption"]).

Generate 2-3 distinct choices with meaningful consequences (e.g. Bold vs Cautious vs Merciful).
`;

  const userPrompt = `
Current Context: ${JSON.stringify(context, null, 2)}

Beat Instructions: ${instructions}

Generate the content for beat ID: ${beatId}.
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