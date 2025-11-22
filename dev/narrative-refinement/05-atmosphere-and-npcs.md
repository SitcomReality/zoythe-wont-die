# Phase 5: Atmosphere & NPC Integration

**Goal:** Make the investigation phase (`Road of Tests`) more dynamic by integrating specific Interregnum effects (based on urgency) and specific NPC encounters (based on roster).

## 1. Dynamic Atmosphere (Interregnum Effects)
*   **Source:** `src/systems/interregnum-effects.js`
*   **Logic:**
    *   In `Road of Tests`, if `urgencyLevel > 2`, fetch a random effect (or escalate an existing one).
    *   Inject this effect's description into the beat instructions (e.g., "A Bell Avalanche is occurring, making concentration difficult.").
    *   This grounds the "urgency" mechanics in narrative flavor.

## 2. NPC Encounters in Investigation
*   **Current:** `Road of Tests` only offers generic "Ask a spirit" choices.
*   **Change:**
    *   Fetch a relevant NPC (e.g., a Rival or Ally) from `gameState.npcRoster`.
    *   Prioritize unmet NPCs to introduce the cast.
    *   Offer a specific choice to interact with them (e.g., "Interrogate [Name] about the crime").
    *   Mark the NPC as `met` if chosen (or just by appearing, depending on preference).

## 3. Implementation Plan
*   Modify `src/prompts/hero/roadOfTests.js` to accept `atmosphericEffect` and `npc` parameters.
*   Modify `src/narrative/beats/hero-journey/road-of-tests.js` to inject these elements.

