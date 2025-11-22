const callToAdventurePrompt = ({ weapon, terminology = {} } = {}) => {
  return `
This is the 'Call to Adventure', which is now 'The Discovery of the Corpse'.
The protagonist stands over their own mortal body (or what remains of it).
${weapon && weapon.name !== "Unknown" 
  ? `They see the glint of the ${terminology.weapon || "weapon"}: ${weapon.name}.`
  : `The method of death is not immediately apparent. No obvious weapon. Investigation required.`}
The ${terminology.reality || "reality"} around them is ${terminology.glitch || "glitch"}ing.
The Call is the realization: The system of death is broken because YOU were murdered illegally (or the ${terminology.dead_god || "dead god"} was).
You must solve your own ${terminology.murder_mystery || "murder_mystery"} to fix the loop or escape it.
Required Choice Types:
- ${terminology.investigate || "investigate"} the body/scene (Accept Quest / Investigate)
- Deny the ${terminology.reality || "reality"} / Try to flee (Refuse)
`;
};

export default callToAdventurePrompt;

