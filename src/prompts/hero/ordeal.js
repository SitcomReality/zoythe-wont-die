const ordealPrompt = ({ type, suspectList, killerName = "The Killer", victimName = "You", urgency = 0 }) => {
  const base = `This is The Ordeal. The climax of the investigation in the Interregnum.`;
  
  switch (type) {
    case "ACCUSATION":
      return `${base}
The protagonist has gathered sufficient evidence (${suspectList.split('\n').length} suspects present).
They stand before the assembled spirits in the Court of Dead Gods.
The pressure is immense. The \${terminology:glitch} is tearing the room apart.
You must identify the killer from the suspects:
${suspectList}

Provide a dramatic intro.
Then provide choices that are strictly Accusations:
- "Accuse [Name]" for each suspect.
- "Admit you don't know" (Failure path).
`;

    case "REVELATION":
      return `${base}
The protagonist failed to gather enough clues. The mystery remains opaque.
Suddenly, ${killerName} steps forward from the shadows, gloating or perhaps pitying the protagonist.
The truth is revealed not by deduction, but by the killer's own arrogance (or guilt).
Describe the killer revealing their nature and the weapon.
Choices should be reactive:
- "Listen in shock"
- "Try to attack ${killerName}"
- "Ask why they did it"
`;

    case "CONFRONTATION":
      return `${base}
Time has run out. The urgency is too high. Reality is collapsing.
${killerName} attacks the protagonist directly amidst the chaos!
There is no time for a trial. This is a fight for survival.
Describe the sudden violence of the encounter.
Choices should be:
- "Fight back with everything you have"
- "Dodge and try to escape"
- "Try to reason with them amidst the blows"
`;

    case "TRIAL":
      return `${base}
The protagonist stands in a formal divine trial. The \${terminology:dead_god}'s remnants judge the living.
You must present your case against ${killerName} (if known) or defend yourself against the court's wrath.
Atmosphere: Bureaucratic nightmare, cosmic horror.
Choices:
- "Present evidence against ${killerName}"
- "Appeal to the court's mercy"
- "Call a witness"
`;

    case "ESCAPE":
      return `${base}
Reality is coming apart faster than your investigation.
Walls of the \${terminology:afterlife} buckle, time skips, and the floor tries to forget it exists.
You still don't have enough evidence to name ${killerName} with certainty—but if you stay, you may vanish with the rest.

Describe the world collapsing around you as the Interregnum demands a choice between truth and survival.

Choices:
- "Flee the collapsing court and save yourself" (accept you may never know the full truth)
- "Stay and cling to the case even as reality tears" (risk being unmade with the mystery)
- "Try to drag whoever seems most guilty into the falling void with you" (a desperate half-accusation)
`;

    default: // Fallback / Generic
      return `${base}
The suspects are gathered:
${suspectList}
You must make your move.
Choices:
- "Accuse [Name]"
- "Wait and watch"
`;
  }
};

export default ordealPrompt;

