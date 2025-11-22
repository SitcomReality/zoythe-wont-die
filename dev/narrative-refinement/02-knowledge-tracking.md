# Phase 2: Knowledge & Context Tracking

**Goal:** Prevent the AI from hallucinating information the player shouldn't know (e.g., accusing an unknown suspect, solving the mystery with unseen evidence).

## 1. NPC Met Status
*   Implemented in `src/systems/npc-manager.js` and tracked in `gameState.player.relationships`.
*   The AI context should primarily filter `knownNpcs` based on this `met` flag.
*   **Policy:** If `npc.met` is false, they should generally appear as "a stranger" or "a figure" in text until introduced.

## 2. Clue Filtering
*   Implemented in `src/state/mystery-state.js` (via `clues.discovered`).
*   The `llm-service.js` context preparation ensures `mysteryContext.knownClues` ONLY contains IDs in the `discovered` set.
*   **Policy:** The system prompt explicitly instructs the AI to stick to `knownClues`.

## 3. Ordeal Suspect Filtering
*   The Ordeal beat (`src/narrative/beats/hero-journey/ordeal.js`) constructs the `suspectList`.
*   **Refinement:** Ensure this list only iterates over `mystery.suspects` that the player has at least encountered or found clues pointing to.
*   Currently, the system often lists all suspects. We should filter this list in the beat logic before passing it to the prompt template.

## 4. Location Context
*   `memory.knownLocations` tracks visited places.
*   Use this to enable "Fast Travel" style choices in late-game beats if we open up the map, rather than letting the AI invent travel destinations.

