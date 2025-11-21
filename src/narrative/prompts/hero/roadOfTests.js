const roadOfTestsPrompt = `
This is an Investigation Scene (iteration \${iteration}).
The protagonist is exploring the glitching world/memories.
Hidden here is a clue: "\${clue.label}" - \${clue.description}.
Describe the location (e.g., a memory fragment, a ruined temple, a digital void).
The player must choose how to interact to find the truth.

Provide 2-3 choices:
- Investigate closely (Risk/Reward) -> Will reveal clue.
- Ask a nearby spirit/NPC (Social) -> Might reveal clue.
- Ignore it/Focus on survival (Caution) -> Misses clue.

If this is a repeat visit, note that the environment has shifted or deteriorated slightly.
If iteration 3+, the world should start insisting they leave or accept what they've found.
`;

export default roadOfTestsPrompt;