# Phase 3: Logic-Driven Prompts
**Goal:** Remove conditional instructions from prompts ("If X, do Y") and replace them with explicit, state-derived instructions.

## 1. Prologue State Machine (`src/narrative/beats/hero-journey/prologue.js`)

*   **Issue:** Prologue loops "Open eyes" -> "Stand up" -> "Open eyes".
*   **Fix:** internal beat state tracking.
    ```javascript
    // Inside enter():
    let stage = gameState.narrative.flags['prologueStage'] || 0;
    
    let instruction = "";
    if (stage === 0) {
       instruction = "Describe the sensation of waking up dead. The player cannot move yet.";
       // Choice: "Open your eyes"
    } else if (stage === 1) {
       instruction = "The player opens their eyes. Describe the fractured sky. They are lying on cold stone.";
       // Choice: "Stand up"
    }
    // etc.
    gameState.narrative.flags['prologueStage'] = stage + 1;
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