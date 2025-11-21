# Phase 1: State & Procedural Generation

**Goal**: Replace the generic "MacGuffin" logic with a "Mystery Engine" that generates a victim (player), suspects, a killer, a weapon, and clues, adhering to "Twist" archetypes.

## 1. New System: `src/systems/mystery-generator.js`
Replace `macguffin-generator.js` with a comprehensive mystery factory.

### `createMystery({ rng })`
Returns a `mystery` object to be stored in `GameState`.
1. **Select Twist Template**: Choose one archetype to drive the narrative logic (e.g., "Mentor Betrayal", "Cosmic Conspiracy", "Personal Revenge").
2. **Generate Victim Profile**: Define the player's pre-death identity and initial cause-of-death memories (or lack thereof).
3. **Generate Weapon**:
   - **Type**: Physical (dagger), Cosmic (void-spell), or Informational (secret).
   - **Link**: How it connects the murder to the Death God's fall.
4. **Generate Suspects**: Call `SuspectGenerator`.
5. **Select Killer**: Assign guilt based on the Twist Template.
6. **Seed Clues**: Call `ClueGenerator`.
7. **Validate**: Call `MysteryValidator`.

## 2. New System: `src/systems/suspect-generator.js`

### `generateCohort({ rng, twistTemplate })`
- **Roles**: Must include specific roles required by the Twist (e.g., if "Mentor Betrayal", the Mentor must be generated). Fill remaining slots with archetypes (Lover, Rival, Ally, Zealot).
- **Motives**: Generate a plausible motive for *each* suspect, not just the killer.
- **Alibis**:
  - Structure: `{ statement: string, isTrue: boolean, breakCondition: clueId | null }`.
  - False alibis must have a corresponding "Alibi Breaker" clue.
- **Relationships**: A simple matrix or list of links between suspects (e.g., "A is secretly in love with B").

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

