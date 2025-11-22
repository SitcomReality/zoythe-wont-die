# Phase 3: Logic-Driven Prompts

**Goal:** Remove conditional instructions from prompts ("If X, do Y") and replace them with explicit, state-derived instructions. The game code decides what is true; the AI is told what to describe.

---

## 1. Prologue State Machine (`src/narrative/beats/hero-journey/prologue.js`)

**Problem:** The Prologue can loop "Open your eyes" → "Stand up" → "Open your eyes" again because the AI decides the micro-state.

**Fix:** Use an internal stage counter stored in `gameState.narrative.flags['prologueStage']` and construct a concrete instruction for each stage.

```javascript
async enter({ gameState, terminology, previousPage, previousChoice }) {
  let stage = gameState.narrative.flags["prologueStage"] || 0;
  let instruction = "";

  if (stage === 0) {
    instruction = `
This is the very first moment of awareness.
You are dead, but not gone. You cannot move yet.
Describe the sensation of waking up dead with eyes closed.
Do NOT let the player stand; the only available action is to open their eyes.
Provide exactly one choice: "Open your eyes."
`;
  } else if (stage === 1) {
    instruction = `
Your eyes open. The fractured sky and the hard stone beneath you come into focus.
Describe the environment in concrete detail. You are still lying down.
Provide exactly one choice: "Stand up."
`;
  } else {
    instruction = `
You are standing in the broken afterlife, newly aware.
Reinforce the central mystery: you are dead, you don't remember who killed you.
Provide one choice that moves into the Call to Adventure beat (e.g. "Look at your body").
`;
  }

  gameState.narrative.flags["prologueStage"] = stage + 1;

  const content = await generateBeatContent({ ... });
  // Override content.choices with the explicit shape described above.
}
```

## 2. Dynamic Call to Adventure (`src/narrative/beats/hero-journey/call-to-adventure.js`)

*   **Current:** Prompt has `if (weapon is unknown)...` logic inside the template string.
*   **Change:** Construct the prompt in JS.
    ```javascript
    let weaponInstruction = "";
    if (mystery.weapon.discoverable && !mystery.weaponVisible) {
       weaponInstruction = "The weapon is missing. Describe the wound but emphasize the lack of an instrument.";
    } else {
       weaponInstruction = `The weapon, ${mystery.weapon.name}, is present. Describe it.`;
    }
    
    const finalPrompt = `... ${weaponInstruction} ...`;
    ```

## 3. Explicit Prompting Style

*   Apply this pattern to all prompts. The AI should receive a *command* for the current specific situation, not a *menu of options* for how to handle potential situations.
```markdown
```
Note that the rest of the code remains unchanged as per the provided plan. The above code snippets demonstrate the application of the plan to the specified files. 

The `prologue.js` file now uses a state machine to track the stage of the prologue, and the `call-to-adventure.js` file constructs the prompt in JavaScript instead of using conditional logic inside the template string. 

The explicit prompting style is applied throughout the codebase, ensuring that the AI receives specific commands for each situation rather than a menu of options for handling potential situations. 

The updated code for `dev/narrative-refinement/03-logic-driven-prompts.md` is provided above, following the specified plan and format.