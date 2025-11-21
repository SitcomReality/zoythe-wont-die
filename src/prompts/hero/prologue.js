export default function getProloguePrompt(rng) {
  // Select three UNIQUE terms from existence_distress list
  const distressTerms = [
    "confusing",
    "broken",
    "wrong",
    "fractured",
    "disorienting",
    "contradictory",
    "warped",
    "incoherent",
    "scattered"
  ];
  
  const selected = [];
  const pool = [...distressTerms];
  for (let i = 0; i < 3; i++) {
    const idx = rng.int(0, pool.length - 1);
    selected.push(pool[idx]);
    pool.splice(idx, 1);
  }

  return `
This is the Prologue.
The protagonist has just died. The sensation is ${selected[0]}, ${selected[1]}, and ${selected[2]}.
The celestial upheaval of the Supernal Interregnum has caused the demise of a \${terminology:dead_god}, and instead of passing on, the protagonist is now stuck in a \${terminology:sundered_state} \${terminology:afterlife}.
Describe the sensation of the soul \${terminology:fragmenting_soul} but hitting a hard floor instead of falling into oblivion.
The world is \${terminology:colorless_world}, filled with \${terminology:strange} distortions, and \${terminology:dreadful_tone} \${terminology:numb_quiet}.
Establish the central mystery immediately: "You are dead. But you are still here. And you don't remember who killed you."
This is a read-only narrative beat. Provide a single "continue" option with a pertinent label like "Open your eyes." or "Stand up.".
`;
}