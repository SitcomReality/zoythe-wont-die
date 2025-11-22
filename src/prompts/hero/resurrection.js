// Updated to be twist-aware and parameterized
const resurrectionPrompt = ({ accusationResult, twist }) => `
This is "The Resurrection" – the moment of transformation and acceptance.

The accusation outcome was: ${accusationResult}.
Twist Type: ${twist.label}.
Twist Summary: ${twist.summary}.

Use this twist to shape the scene. The protagonist stands at the threshold between death and whatever comes next.
Draw on prior beats, the investigation, and the Interregnum's broken ${"${terminology:afterlife}"}.

Guidance for this beat:
- Reveal or confirm the twist clearly in the scene (do not keep it vague).
- Use a concrete, cinematic moment inspired by this hint: "${twist.suggestedScene}".
- Let the protagonist emotionally react to this discovery: shock, anger, relief, bitter laughter, etc.
- Acknowledge whether the mystery was solved by true deduction or by circumstance (accusationResult = ${accusationResult}).

Offer 2–3 meaningful choices that shape the tone of the ending. Examples (you may remix them to fit the twist):
- A "potion choice" style option: choose whether to return to life yourself, or save another (a loved one, an orphan, your killer).
- A choice about how to judge the killer or the gods (forgive, condemn, or walk away from the whole cosmic drama).
- A choice that decides what kind of story your resurrection tells (become a mentor, vanish quietly, or accept a divine role).

Constraints:
- Keep the language punchy and accessible (YA / tween level, second person).
- Make the twist feel like the natural culmination of earlier hints, not a random surprise.
- Focus on resolution and identity: who you are now that you know this truth.
`;

export default resurrectionPrompt;

