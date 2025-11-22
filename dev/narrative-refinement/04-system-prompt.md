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

