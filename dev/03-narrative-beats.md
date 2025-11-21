# Phase 3: Narrative Logic & Beats

**Goal**: Rewrite the story content to be a murder mystery and ensure the system understands investigation logic.

## 1. Update: `src/systems/choice-classifier.js`
Expand the vocabulary of the engine.

### Requirements:
- **New Classifications**:
  - `INVESTIGATE`: Searching a location.
  - `INTERROGATE`: Questioning an NPC.
  - `ACCUSE`: Formally blaming someone.
  - `ANALYZE`: Examining a clue.
- **Intent Parsing**:
  - Logic to map free-text (e.g., "Ask Kael where he was last night") to `INTERROGATE` + Target: `Kael`.

## 2. Rewrite: Core Beats (`src/narrative/beats/hero-journey/`)

### `prologue.js` & `call-to-adventure.js`
- **Old**: Generic world setting -> Divine sign.
- **New**: Waking up dead -> Realizing you were murdered.

### `road-of-tests.js`
- **Old**: Generic obstacles.
- **New**: Investigation scenes.
  - Beat logic must pull a `Clue` from the `hidden` pool and weave it into the generation prompt.

### `ordeal.js`
- **Old**: Confronting the MacGuffin guardian.
- **New**: **The Accusation**.
  - A scene where the player must identify the killer.
  - Logic to handle "Correct Accusation", "False Accusation", or "Refusal to Accuse".

## 3. Update: `src/narrative/engine/beat-orchestrator.js`
- Handle free-text inputs:
  - If input is received, run it through `ChoiceClassifier`.
  - Pass the interpreted intent to the current Beat's `applyChoice` logic.
- Ensure generic beats can fallback to improvisation if the player does something unexpected.

