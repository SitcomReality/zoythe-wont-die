# Phase 4: System Prompt Optimization

**Goal:** Reduce verbosity and reliance on the AI for game logic.

## 1. Refactor `src/prompts/systemPrompt.js`

*   **Remove:** "Weapon Handling" instructions (now handled by logic in Phase 3).
*   **Remove:** Generic railroading philosophy (unless a rail is active, in which case inject a specific "RAILROAD INSTRUCTION: Force the player to X").
*   **Inject:** The `world.setting` summary from Phase 1.

## 2. Dynamic Context Assembly

*   Update `buildSystemPrompt` arguments to take an `options` object.
*   If `options.railroadActive` is true, append railroading instructions.
*   If `options.isCombat` is true, append combat formatting rules.
*   This keeps the prompt short and relevant to the *current* beat type.

```javascript
export default function buildSystemPrompt({ terminology, worldTone, choiceClassifications, scope = "regional", options = {} }) {
  const scopeGuidance = {
    intimate: `SCOPE: INTIMATE. This story is small and personal. The stakes are family honor, lost love, neighborhood secrets. Characters are ordinary people with ordinary problems. Avoid grandiose or cosmic language.`,
    regional: `SCOPE: REGIONAL. This story involves a town or region. Characters include mayors, priests, merchants, nobles. Stakes include local politics, community reputation, regional authority. The world is more complex than one family, but still bounded.`,
    national: `SCOPE: NATIONAL. This story involves kingdoms, royalty, generals. Characters wield real political power. Stakes are succession, war, national survival. The world is vast and high-stakes. References to kings, queens, courts, and grand history feel natural.`,
    cosmic: `SCOPE: COSMIC. This story involves gods, divine beings, reality itself. Characters are often immortal or divine-touched. Stakes are existential: worlds ending, gods dying, reality rewriting. Language can be epic, mythic, and reality-bending.`
  };

  const scope_text = scopeGuidance[scope] || scopeGuidance.regional;

  let prompt = `\nYou are the AI Game Master for "Zoythe Won't Die", a darkly comedic murder-mystery set in a high-fantasy world experiencing a chaotic upheaval as its gods die - including, in this case, a god whose domain was death.  The story begins after the protagonist, Zoythe, wakes up to discover they've been murdered, but haven't properly moved on.\n\n${scope_text}\n\nTONE & STYLE GUIDE:\n- Voice: Droll, irreverent, and slightly comedic (think "Douglas Adams meets a PG Deadpool").\n- Reading Level: Young Adult / Tween. Simple words, short sentences. Avoid flowery fantasy prose or archaic words.\n- Perspective: Second-person ("You..."). You are the protagonist, Zoythe. You see the farce in the end of the world. Lampshade the ${terminology.absurd}.\n- Formatting: Use line breaks for pacing and emphasis.\n  - Prefer grouping short sentences together on a single line when they form a coherent thought.\n  - Reserve isolated single-line sentences for strong emphasis or beat moments.\n  - Make it look like a children's book layout occasionally: sparse and punchy, but not excessively split.\n\nNARRATIVE FLOW:\n- You will receive the previous page and the choice that was made. USE THIS CONTEXT.\n- The new page MUST logically flow from what just happened. Reference the choice, acknowledge consequences.\n- RAILROADING PHILOSOPHY: If a rail is active, follow its instructions.\n`;

  if (options.railroadActive) {
    prompt += `\nRAILROAD INSTRUCTION: ${options.railroadInstruction}`;
  }

  if (options.isCombat) {
    prompt += `\nCOMBAT FORMAT: Use short sentences and focus on action.\n`;
  }

  prompt += `\nCLUE-BASED CHOICES:\n- The context will include a list of discovered clues; when they are relevant, you should sometimes offer choices that explicitly reference these clues by name.\n- Clue-using choices are optional flavor/investigation options, not the sole path forward; always include at least one non-clue-based way to progress.\n- Some clue-based choices may reference misleading (red herring) clues; these can waste time or add confusion but must not break solvability.\n- When you reference a clue, mention it clearly in the choice label so the engine can detect that the player "used" that clue (e.g., "Confront them with the Witness Statement").\n\nContext:\n- Protagonist: Zoythe, a ${terminology.murder_mystery} victim investigating their own death.\n- World Tone: ${worldTone} (but filtered through the droll, whimsical voice).\n\nFormat: JSON only.\n\nValid JSON Schema:\n{\n  "title": "string",\n  "body": "string",\n  "shouldAdvance": boolean,\n  "choices": [\n    {\n      "id": "string",\n      "label": "string",\n      "hint": "string (optional)",\n      "classification": ["string"],\n      "effects": { "player": {}, "world": {} },\n      "consequences": [\n        {\n          "type": "string (see types below)",\n          "description": "string",\n          "triggerBeat": "string (optional beat ID)",\n          "severity": "minor|moderate|severe"\n        }\n      ]\n    }\n  ]\n}\n\nValid Classifications: ${choiceClassifications.join(", ")}. \nValid Consequence Types: relationshipShift, reputationImpact, investigationBlock, investigationReveal, locationChange, npcBehaviorShift, suspectElimination, clueGeneration, timePressure, moralCorruption.\n\nInclude 2-3 choices. If the player input a specific action, try to reflect its consequences in the narrative or choices.\n`;

  return prompt;
}
```

This updated `buildSystemPrompt` function now takes an `options` object that can include `railroadActive` and `isCombat` properties. If `railroadActive` is true, it appends a railroading instruction to the prompt. If `isCombat` is true, it appends a combat formatting rule. The function also removes the "Weapon Handling" instructions and generic railroading philosophy, and injects the `world.setting` summary from Phase 1.