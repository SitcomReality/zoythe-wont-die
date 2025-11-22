const callToAdventurePrompt = `
This is the 'Call to Adventure', which is now 'The Discovery of the Corpse'.
The protagonist stands over their own mortal body (or what remains of it).
${weapon && weapon.name !== "Unknown" 
  ? `They see the glint of the \${terminology:weapon}: \${weapon}.`
  : `The method of death is not immediately apparent. No obvious weapon. Investigation required.`}
The \${terminology:reality} around them is \${terminology:glitch}ing.
The Call is the realization: The system of death is broken because YOU were murdered illegally (or the \${terminology:dead_god} was).
You must solve your own \${terminology:murder_mystery} to fix the loop or escape it.
Required Choice Types:
- \${terminology:investigate} the body/scene (Accept Quest / Investigate)
- Deny the \${terminology:reality} / Try to flee (Refuse)
`;

export default callToAdventurePrompt;

