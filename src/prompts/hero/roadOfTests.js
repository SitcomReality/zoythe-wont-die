const roadOfTestsPrompt = ({ iteration, clue, location, atmosphericEffect, npc }) => `
This is an Investigation Scene (iteration ${iteration}).
The protagonist is at ${location || "a fragmented memory of the crime scene"}.
Hidden here is a \${terminology:clue}: "${clue ? clue.label : "Faint Traces"}"${clue ? ` - ${clue.description}` : ""}.

Describe this specific \${terminology:location_type} in the Interregnum. It should feel like a \${terminology:glitch}ed reflection of the real ${location}.
The atmosphere is \${terminology:dreadful_tone} and \${terminology:numb_quiet}.
${atmosphericEffect ? `\nWARNING: The Interregnum is unstable. Effect active: ${atmosphericEffect.name} - ${atmosphericEffect.description}. Include this environmental hazard in the scene description.` : ""}
${npc ? `\nNPC ENCOUNTER: ${npc.name} (${npc.role}) is present here. ${npc.descriptor}. They seem to be ${npc.met ? "lingering" : "investigating as well"}.` : ""}

The player must choose how to interact to find the truth.
Provide 2-3 choices:
${clue ? `- Use a focused \${terminology:investigation_action} to study the clue details (Risk/Reward) -> likely \${terminology:clue_discovery}.` : ""}
${npc ? `- Approach ${npc.name} and question them (Social/Interrogation).` : `- Ask a nearby \${terminology:spirit} or echoing presence about the ${location} (Social).`}
- Ignore it / focus on survival (Caution) -> miss this clue but conserve energy.

At least one choice may follow a tempting but ultimately misleading lead (a red herring) that wastes time or adds confusion without breaking the core solvability of the mystery.
If iteration > 1, note that the ${location} has shifted or degraded.
`;

export default roadOfTestsPrompt;

