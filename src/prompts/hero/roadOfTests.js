const roadOfTestsPrompt = ({ iteration, clue, location }) => `
This is an Investigation Scene (iteration ${iteration}).
The protagonist is at ${location || "a fragmented memory of the crime scene"}.
Hidden here is a \${terminology:clue}: "${clue.label}" - ${clue.description}.

Describe this specific \${terminology:location_type} in the Interregnum. It should feel like a \${terminology:glitch}ed reflection of the real ${location}.
The atmosphere is \${terminology:dreadful_tone} and \${terminology:numb_quiet}.

The player must choose how to interact to find the truth.
Provide 2-3 choices:
- Use a focused \${terminology:investigation_action} to study the clue details (Risk/Reward) -> likely \${terminology:clue_discovery}.
- Ask a nearby \${terminology:spirit} or echoing presence about the ${location} (Social) -> might reveal context.
- Ignore it / focus on survival (Caution) -> miss this clue but conserve energy.

At least one choice may follow a tempting but ultimately misleading lead (a red herring) that wastes time or adds confusion without breaking the core solvability of the mystery.
If iteration > 1, note that the ${location} has shifted or degraded.
`;

export default roadOfTestsPrompt;

