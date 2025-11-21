# Phase 1: State & Procedural Generation

**Goal**: Introduce a self-contained "Mystery Engine" (victim, suspects, killer, weapon, clues) in parallel with the existing MacGuffin/home-threat systems, without yet removing MacGuffin code. Later phases will migrate beats and endings to rely on this mystery state.

## 0. Scope & Order of Operations

- Do NOT delete or rewrite `macguffin-generator.js`, `world.macGuffinStatus`, or `ending-resolver.js` in this phase.
- Implement the Mystery systems and attach them to `GameState` so they can be safely referenced by future UI and beats.
- Wire mystery creation into New Game startup, but leave existing beats/LLM prompts untouched for now.

## 1. New System: `src/systems/mystery-generator.js`
Create a comprehensive mystery factory that replaces the *conceptual* MacGuffin with a murder case, but is called in addition to the current MacGuffin generator until Phase 4.

### `createMystery({ rng })`
Returns a `mystery` object to be stored in `GameState.mystery`.

1. **Select Twist Template**
   - Choose one archetype to drive the narrative logic (e.g., `"mentorBetrayal"`, `"cosmicConspiracy"`, `"personalRevenge"`).
   - Store as `mystery.twist.id` and any high-level configuration you need (e.g., required roles).

2. **Generate Victim Profile**
   - Define the player's pre-death identity and initial cause-of-death memories (or lack thereof).
   - Example shape:
     ```js
     victim: {
       id: "player",
       name: "string | null",
       archetypeHint: "martyr" | "traitor" | "innocent" | ...,
       causeOfDeath: { knownToPlayer: false, description: "..." },
       bodyLocation: "short string"
     }
     ```

3. **Generate Weapon**
   - Create `mystery.weapon`:
     ```js
     weapon: {
       id: "weapon-1",
       type: "physical" | "cosmic" | "informational",
       name: "string",
       description: "string",
       linkToDeathGod: "string description of how it ties (or fails to tie) to the Death God's fall",
       discoveryTier: 2 // 1=early, 2=mid, 3=late
     }
     ```

4. **Generate Suspects (delegate to `SuspectGenerator`)**
   - Call `generateCohort({ rng, twistTemplate })` and assign result to `mystery.suspects` (Map or array; see below).

5. **Select Killer**
   - Choose `killerId` from the generated suspects according to the twist template and store as `mystery.killerId`.

6. **Seed Clues (delegate to `ClueGenerator`)**
   - Call `seedClues({ suspects, killerId, weapon, rng, twistTemplate })` and assign result to `mystery.clues.all`.

7. **Initialize Progress**
   - Add a `mystery.progress` object with simple booleans and counters:
     ```js
     progress: {
       accusationMade: false,
       correctKillerAccused: false,
       weaponSecured: false,
       cluesFoundCount: 0
     }
     ```

8. **Validate**
   - Call `ensureSolvable(mystery)` from `mystery-validator.js`. If validation fails, either regenerate or adjust clues until it succeeds.

## 2. New System: `src/systems/suspect-generator.js`

### `generateCohort({ rng, twistTemplate })`
- Return `Map<Id, SuspectData>` or an array that can easily be converted into a Map and stored in `mystery.suspects`.

- Each `SuspectData` should have at least:
  ```js
  {
    id: "suspect-1",
    name: "string",
    role: "mentor" | "lover" | "rival" | "zealot" | ...,
    motive: "short string",
    alibi: {
      statement: "string first-pass alibi",
      isTrue: boolean,
      breakCondition: "clueId | null"
    },
    relationships: [
      { targetId: "suspect-2", type: "secretLove" | "resentment" | ... }
    ]
  }
  ```

## 3. New System: `src/systems/clue-generator.js`

### `seedClues({ suspects, killer, weapon, rng })`
- Generate ~12 clues distributed across 3 tiers:
  - **Tier 1 (Early/Physical)**: Found in Act I/Early Act II. Establishes method/location (e.g., "The murder weapon", "A torn piece of cloth").
  - **Tier 2 (Mid/Testimonial)**: Contradictions in alibis, witness statements, motive revealers.
  - **Tier 3 (Late/Revelation)**: The "Smoking Gun" or Weapon usage logic, often locked behind specific beats.
- **Mapping**: Each clue object must have:
  - `id`: unique string.
  - `description`: narrative text.
  - `relatedSuspectIds`: array of IDs this clue implicates or clears.
  - `truthValue`: boolean (to support red herrings).

## 4. New System: `src/systems/mystery-validator.js`

### `ensureSolvable(mystery)`
- **Check**: At least 3 clues point to the Killer.
- **Check**: At least 1 clue rules out each innocent suspect (or breaks their false alibi if they are lying for non-murder reasons).
- **Check**: The "Weapon" is accessible via the narrative graph (i.e., assigned to a beat or location).

## 5. Update: `src/state/game-state.js`
- Add `mystery` slice:
  ```javascript
  mystery: {
    twist: "string (id)",
    victim: { ... },
    killerId: "string",
    weapon: { ... },
    suspects: Map<Id, SuspectData>, // Includes alibis and motives
    clues: {
      all: Map<Id, ClueData>, // Source of truth
      discovered: Set<Id>,    // IDs of found clues
      knownSuspects: Set<Id>  // IDs of met suspects
    },
    progress: {
      accusationMade: boolean,
      correctKillerAccused: boolean,
      weaponSecured: boolean
    }
  }
  ```

