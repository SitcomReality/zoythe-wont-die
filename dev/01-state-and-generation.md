# Phase 1: State & Procedural Generation

**Goal**: Replace the generic "MacGuffin" logic with a robust "Mystery Engine" that generates a victim (player), suspects, a killer, a weapon, and clues.

## 1. New File: `src/systems/mystery-generator.js`
This will replace or heavily augment `macguffin-generator.js`.

### Requirements:
- **`createMystery({ rng })`**: The main entry point.
- **Components to Generate**:
  - **The Crime**: Who, How, Where, Why.
  - **The Weapon**: Physical object or metaphysical concept linking the murder to the Death God's fall.
  - **The Suspects**: 3-4 NPCs with specific archetypes (Lover, Rival, Mentor, etc.).

## 2. New File: `src/systems/suspect-generator.js`
Separated logic for generating the cast.

### Requirements:
- **`generateCohort({ rng, victimProfile })`**:
  - Generate 3-4 NPCs.
  - Assign Roles: `MENTOR`, `RIVAL`, `LOVER`, `ALLY`.
  - Assign **Motives**: Why would they kill the victim?
  - Assign **Alibis**:
    - True Alibis (verifiable).
    - False Alibis (breakable).
  - Create a **Relationship Matrix** (how they feel about each other).

## 3. New File: `src/systems/clue-generator.js`
Logic for seeding evidence across the narrative.

### Requirements:
- **Types of Clues**:
  - `PHYSICAL`: Items found at scenes.
  - `TESTIMONIAL`: Things people say.
  - `CIRCUMSTANTIAL`: Environmental details.
- **Mapping**: Each clue must point to a suspect or rule one out.
- **Seeding**: Assign clues to generic "buckets" (e.g., "Early Game Clues", "Mid Game Clues") for the Beat Orchestrator to distribute.

## 4. Update: `src/state/game-state.js`
- Remove `macguffinStatus` generic fields if obsolete.
- Add `mystery` slice:
  ```javascript
  mystery: {
    victim: { ... },
    killerId: "...",
    weapon: { ... },
    suspects: Map<Id, SuspectData>,
    clues: {
      discovered: [],
      hidden: []
    },
    state: {
      suspicionMap: {},
      accusationMade: false
    }
  }

