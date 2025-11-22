const meetingMentorPrompt = ({ mentorName, mentorDesc, mentorType, mentorPersonality, interactionStage }) => {
  const isIntro = interactionStage === 0;
  
  let basePrompt = `
This is 'Meeting the Mentor'.
The protagonist encounters ${mentorName}, who appears as ${mentorDesc}.
Mentor Archetype: ${mentorType ? mentorType.replace(/_/g, ' ') : "Unknown"}.
Demeanor: ${mentorPersonality ? mentorPersonality.demeanor : "Mysterious"}.
Motivation: ${mentorPersonality ? mentorPersonality.motivation : "Unknown"}.
`;

  if (isIntro) {
    return basePrompt + `
The Mentor approaches the protagonist near the scene of death.
They offer a hook—a reason why the protagonist should trust them or listen to them.
Greeting Style: ${mentorPersonality ? mentorPersonality.greetingStyle : "Cryptic"}.
The player is disoriented. The Mentor represents the first foothold of knowledge.
Provide choices:
- Trust/Listen to them (Advance the story)
- Be skeptical/Ask who they are (Stay to investigate character)
- Ask what they know about the murder (Stay to investigate plot)
`;
  } else {
    return basePrompt + `
The protagonist has chosen to question the Mentor further (Stage ${interactionStage}).
The Mentor is ${interactionStage === 1 ? "patient but insistent" : "growing impatient with the delay"}.
They reveal a specific detail related to their ${mentorPersonality ? mentorPersonality.motivation : "goals"}.
They urge the protagonist to move on to the 'Road of Tests' to find real evidence.
Provide choices:
- Finally accept their guidance (Advance)
- Ask one more probing question (Stay/Risk - potentially annoying them)
- Dismiss them and move on alone (Advance - slightly rude/independent)
`;
  }
};

export default meetingMentorPrompt;

