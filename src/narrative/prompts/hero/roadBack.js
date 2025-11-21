const roadBackPrompt = `
This is "The Road Back".
The protagonist turns toward home, carrying the MacGuffin: "${macguffin.name}" (${macguffin.description}).
Binding effect: "${macguffin.bindingEffect}".
The Interregnum remains hostile, and some dying god or force offers corrupting power or temptation along the way.
Home threat is "${threat.name}".
Provide 2-3 choices that roughly correspond to:
- Refusing corruption and holding to purpose.
- Accepting or partially accepting power (possibly adding "divine-corruption" to world.tags).
- Bargaining or pragmatic compromise.
`;

export default roadBackPrompt;