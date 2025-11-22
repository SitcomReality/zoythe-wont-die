const roadOfTestsPrompt = ({ iteration, clue, location, atmosphericEffect, npc }) => `
This is an Investigation Scene (iteration ${iteration}).
The protagonist is at ${location || "a fragmented memory of the crime scene"}.
${clue ? `Hidden here is a clue: "${clue.label}" - ${clue.description}.` : "Faint traces remain, waiting to be discovered."}

Describe this specific location in the Interregnum. It should feel like a glitched reflection of the real ${location}.
The atmosphere is dreadful and numb with a crushing quiet.
${atmosphericEffect ? `\n⚠️ ENVIRONMENTAL HAZARD: The Interregnum is unstable. Effect active: **${atmosphericEffect.name}** — ${atmosphericEffect.description}. Include this environmental threat in the scene. It makes investigation tense and time-pressured.` : ""}
${npc ? `\n🔍 NPC ENCOUNTER: **${npc.name}** (${npc.role}) is present here. ${npc.descriptor}. They are ${npc.met ? "lingering in the ruins" : "also investigating the scene, as if drawn here"}.` : ""}

The player must choose how to proceed.

Provide 2-3 investigation-focused choices:
${clue ? `- Conduct a focused investigation of the clue details (Analyze/Deduce) -> likely reveals new insight.` : ""}
${npc ? `- Approach ${npc.name} directly and question them (Interrogate/Socialize).` : `- Ask a nearby spirit or echoing presence about ${location} (Socialize).`}
- Ignore this and move on (Caution) -> conserve energy but miss potential insight.

${clue && clue.truthValue === false ? "⚠️ NOTE: One available clue is a red herring that wastes time without breaking the mystery's solvability." : ""}
${iteration > 1 ? `\nNote: This is return visit #${iteration}. The ${location} has further degraded. Describe visible changes or temporal shifts.` : ""}

${atmosphericEffect ? `Remember: The **${atmosphericEffect.name}** is making normal investigation dangerous. The urgency is REAL.` : ""}
`;

export default roadOfTestsPrompt;

