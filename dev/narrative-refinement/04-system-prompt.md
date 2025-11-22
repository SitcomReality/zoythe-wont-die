# Phase 4: System Prompt Optimization

**Goal:** Reduce verbosity and reliance on the AI for game logic by moving decision-making into code and injecting specific constraints.

## 1. Refactored `buildSystemPrompt`
The system prompt builder (`src/prompts/systemPrompt.js`) has been updated to accept specific configuration options rather than generic instructions.

### New Arguments
*   `setting`: A concrete setting object (from `setting-generator.js`). Injects specific names (e.g., "The City of Klorp") to ground the narrative.
*   `options.railroadActive`: Boolean. If true, injects a mandatory override instruction to force the narrative back on track.
*   `options.isCombat`: Boolean. If true, switches the formatting rules to favor short, punchy action sentences.

## 2. Removed Generic Instructions
*   Removed "If weapon is unknown..." logic blocks from the prompt string. This determination is now made in the JavaScript logic of individual beats (e.g., `call-to-adventure.js`) which then pass specific instructions to the generation service.
*   Removed static "Railroading Philosophy" text in favor of the dynamic `railroadInstruction` injection.

## 3. Context Injection
*   The `llm-service.js` now prepares a cleaner context object that merges `world.setting` and calculated `options` before calling the prompt builder.

