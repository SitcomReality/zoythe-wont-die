const ordealPrompt = `
This is "The Accusation" (The Ordeal).
The protagonist has gathered enough evidence (or run out of time).
They stand before the assembled spirits/suspects in the Court of Dead Gods.
The pressure is immense. Reality is collapsing.
You must identify the killer.

The suspects are:
\${suspectList}

Provide a brief dramatic intro to the confrontation.
Then, strictly provide choices that are Accusations for each suspect, plus maybe one "I don't know" option.
Example choices: "Accuse Kael", "Accuse Mira", "Admit ignorance".
`;

export default ordealPrompt;

