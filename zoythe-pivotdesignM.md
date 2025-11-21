# Zoythe: The Glitch Murder – Design Pivot & Roadmap

This document supersedes `zoythe-designdoc.md`. It describes:

- The pivot from a generic “MacGuffin Quest” to a **glitchy afterlife murder mystery**.
- How the player experience will work (buttons + free‑text, “interactive novel” rather than fail‑state game).
- The new **Mystery Engine**, narrative structure, and UI requirements.
- The remaining implementation work.

---

## 1. High‑Level Goals & Constraints

1. **Interactive novel, not puzzle‑game**

   - There is always a *generated* murder case, but **solving it “correctly” is not a win condition**.
   - The murder is the **spine** of the story: how much the player uncovers, and what they *do* with that knowledge, shapes the ending.

2. **Fixed narrative skeleton, flexible path**

   - The story always follows a version of the **Hero’s Journey** across ~18 beats/pages (leave → undergo trials → return).
   - Player actions change:
     - The **content** of each beat (who appears, what is revealed).
     - The **route** through the beats (which tests, which confrontations).
     - The **final outcome** and emotional tone.
   - The player **cannot break or escape the story**. The LLM “dungeon master” must always route choices back into the next appropriate beat.

3. **Hybrid interaction model**

   - Each page offers:
     - A set of **suggested choices** as buttons.
     - A **free‑text input** where the player can type any action or line of dialogue.
   - The LLM interprets both buttons and free‑text and advances the story, while respecting:
     - The **current beat** in the Hero’s Journey.
     - The **Mystery state** (suspects, clues, unresolved threads).
     - The **Dossier** (what the player already knows).

---

## 2. Conceptual Pivot: The Dead Detective

### 2.1 Premise

**Old Premise:**  
A hero leaves home to save it from a threat using a MacGuffin.

**New Premise:**  
The protagonist is a murder victim whose death coincided with the demise of the Death God, causing a “glitch” in the afterlife. The player is stuck between existence and oblivion.

- **Core Hook:** You wake up dead in a broken afterlife and are compelled to understand your own death.
- **Narrative Throughline:** The pressure to uncover who killed you, why, and how this ties (or doesn’t) into the Death God’s fall.
- **Not a Hard Goal:** The story will conclude even if the player:
  - Misunderstands the truth.
  - Refuses to confront it.
  - Focuses on relationships or cosmic stakes instead.

The murder mystery is a **tool** to drive the Hero’s Journey, not a binary success/fail condition.

### 2.2 Twists & Underlying Patterns

We support multiple underlying patterns so that the story feels fresh but structurally reliable:

- **Twist Archetypes (2–3 templates per run):**
  - Mentor betrayal.
  - Cosmic conspiracy (linked to the Death God’s demise).
  - Personal revenge / intimate betrayal.

- **Examples:**
  - The mentor figure turns out to be your murderer.
  - Your death is part of a schism between rival faiths; you helped overthrow the Death God, and your murder “cleaned up loose ends.”
  - Your apparent “grand cosmic” death is actually a small, ugly family drama that just happened to coincide with the afterlife glitch.

- **Implementation:**
  - `MysteryGenerator` selects 1 primary twist template.
  - Seeds twist‑relevant clues early.
  - Reserves explicit revelation for **Act III** beats.

### 2.3 Motivation Arc

- **Start:** Personal confusion and self‑interest.
  - “Why am I here? Who killed me?”
- **Middle:** Involvement with a larger web of people and factions.
  - Lovers, rivals, co‑conspirators, priests, civic leaders, rival gods.
- **End:** Forced to choose what (and who) matters most.
  - Revenge vs. forgiveness.
  - Personal reunion vs. saving a community.
  - Local closure vs. affecting the entire cosmic order.

---

## 3. Player Experience & Interaction Model

### 3.1 Page Structure

Each “page” or beat consists of:

- **Narrative text** describing what’s happening.
- **Suggested actions** (2–4 buttons), e.g.:
  - “Question the priest about your last day alive.”
  - “Explore the glitching cemetery.”
  - “Confide in your former lover.”
- **Free‑text input**:
  - Player can type their own action or dialogue: “Accuse my mentor directly,” “Try to possess my own corpse,” etc.

### 3.2 How Choices Work

- **Buttons**:
  - Mapped to predefined intent tags (e.g. `INVESTIGATE`, `INTERROGATE`, `ACCUSE`, `SEEK_HELP`, `ESCAPE`, etc.).
  - Used to keep the story moving even if the player doesn’t want to type.

- **Free‑text**:
  - Run through a `ChoiceClassifier` that:
    - Extracts **intent** (e.g. investigate vs. attack vs. flee).
    - Identifies referenced **NPCs / locations / clues** when possible.
  - The LLM “DM” uses this to:
    - Update state (clues found, relationships, suspicion).
    - Route to an appropriate next beat or micro‑scene.

### 3.3 Narrative Guardrails

- The player **cannot derail or “escape”** the core narrative:
  - The DM can **deny** impossible actions in‑world (e.g., “You try to leave the afterlife entirely, but the glitch yanks you back.”).
  - The DM can **redirect** actions toward relevant beats (“As you wander off, something about the old chapel pulls you back to the mystery of your death...”).
- Internally, a **Beat Controller** (existing or implicit) ensures:
  - We always progress toward the next major Hero’s Journey beat.
  - Side detours (free‑text tangents) still advance or deepen the mystery, characters, or themes.

Outcome: It feels like a **very responsive book**, not a brittle puzzle game.

---

## 4. New System: The Mystery Engine

We replace the `MacGuffinGenerator` with a `MysteryGenerator` and associated state.

### 4.1 Mystery State (`src/state/mystery-state.js`)

Replace “MacGuffin” state with:

- **Victim (Player)**
  - Pre‑death identity, relationships, vulnerabilities.
  - Cause of death (unknown to player at start).
  - Location of body (may be hidden initially).

- **Suspects (NPCs)**
  - 3–4 key characters generated at start.
  - Each has:
    - **Role archetype:** Lover, Rival, Business Partner, Zealot, Mayor, Best Friend, Mentor, etc.
    - **Motive:** Based on archetype and relationships.
    - **Alibi:** Some true, some false.
    - **Personality traits:** For interrogation behavior.
    - **Relationships matrix:** How they connect to each other and to you.

- **Killer**
  - One suspect (or a small conspiracy).
  - Stored explicitly in mystery state.
  - Back‑up candidates for red herrings.

- **The Weapon**
  - The key piece of evidence or mechanism that unifies the case.
  - Can be:
    - **Physical:** Weapon, stolen artifact, bloodstained item.
    - **Cosmic:** Divine relic linking your death to the Death God’s fall.
    - **Informational:** Location of death, secret relationship, hidden motive.
  - Narrative function:
    - The biggest/final clue that connects the dots.
    - Often something that must be **brought somewhere** or **told to someone** to resolve the story:
      - Taking an artifact to a deity, a court, or a ritual site.
      - Returning to the place you died.
      - Revealing key information to a person or faction.

- **Clues**
  - A growing collection of discovered facts:
    - Physical evidence.
    - Testimony and alibis.
    - Environmental / circumstantial hints.
  - Each clue is mapped to:
    - Which suspect(s) it implicates or exonerates.
    - Which twist or arc beat(s) it supports.

- **Mystery Progress**
  - `cluesFound`, `accusationsMade`, `certaintyLevel` (how confident the *story* will treat the player as being, not necessarily objectively correct).

### 4.2 Procedural Generation (`MysteryGenerator` etc.)

At **New Game**:

1. **Generate the Crime**
   - Who killed you?
   - With what (method/weapon)?
   - Where and when?
   - Why (primary motive)?
   - Decide:
     - Do you wake up where you died, or somewhere else?
     - Is the crime scene known or to be discovered?

2. **Generate the Weapon**
   - Identify the pivotal evidence / mechanism.
   - Define:
     - How it links killer to crime.
     - How it might connect to the Death God’s demise (or deliberately *not* connect, for more intimate stories).
     - Where/when it can be discovered.

3. **Generate Suspects (`SuspectGenerator.generateCohort()`)**
   - Create 3–4 suspects with:
     - Roles (Lover, Rival, Mentor, etc.).
     - Individual motives.
     - A relationships matrix.
     - Alibis (true/false) + supporting “evidence stubs”.
     - Basic personality and interrogation style.

4. **Seed Clues (`ClueGenerator.seedClues()`)**
   - Physical evidence (5–7).
   - Testimonial evidence (3–4).
   - Circumstantial/environmental clues (2–3).
   - Map which clues:
     - Point to which suspects.
     - Are red herrings vs. genuine.
     - Unlock major revelations or tie to twist template.

5. **Generate Weapon Details (`WeaponGenerator.generate()`)**
   - Decide if it is **Physical** vs **Informational**.
   - Define:
     - Discovery conditions (which beat/scene types).
     - Usage rules:
       - How it can be invoked in Act II / III (e.g. expose murderer, resurrect yourself, repair the afterlife).
       - Alternate uses (revenge vs. mercy).

6. **Validate (`MysteryValidator.ensureSolvable()`)**
   - At least 3 genuine clues point toward the killer.
   - No single clue is 100% conclusive on its own.
   - Multiple valid reasoning paths (different clue combos).
   - Red herrings have plausible surface logic and later explanations.
   - There is always a way for the **story** to clearly reveal the truth if we need it, whether or not the player “deduces” it.

### 4.3 Clue & Deduction Use in Narrative

- **Clue Discovery**
  - Beats in the Road of Tests and investigation scenes yield `Clues`.
  - The DM uses the current `mystery` state + `dossier` to **reference existing clues** and offer new angles.

- **Deduction & Accusation**
  - The **Ordeal (Act II climax)** is typically an Accusation / Confrontation scene, but:
    - The player is **not required** to name the correct killer to progress.
    - The DM folds the player’s belief (right or wrong) into the narrative:
      - Wrong suspicion can lead to tragedy, misdirected revenge, or last‑minute correction in Act III.
      - Refusal to accuse can itself be a character choice and an ending branch.

---

## 5. Narrative Arc Re‑mapping (Hero’s Journey)

The 18‑page structure remains, but contextualized as a glitchy afterlife murder mystery. Player choices affect **how** each beat plays out and **what** the final outcome looks like, but **all stories complete the cycle** (departure → trials → return).

| Phase      | Beat Name           | Old Context        | New Context                                                                                                                  |
|-----------|---------------------|--------------------|------------------------------------------------------------------------------------------------------------------------------|
| **Act I** | **Prologue**        | World setting      | You wake up dead. The afterlife is glitching; reality stutters. You have fragmented memories and an immediate, uncanny dread. |
|           | **Call to Adventure** | Divine sign        | You realize (or are told) you were murdered. You feel a pull to understand what happened and why you’re stuck.               |
|           | **Meeting Mentor**  | Old Wise Figure    | A mentor‑type figure (spirit guide, hardboiled ghost, priest, elder, etc.) gives exposition and a first angle on the mystery. |
|           | **Threshold**       | Leaving Home       | You cross into the wider setting: leaving the village, descending into the underworld, entering the glitching city of the dead, etc. |
| **Act II**| **Road of Tests**   | Obstacles          | Investigations, interrogations, physical dangers from undead or hunters, moral dilemmas, and glimpses of cosmic instability. |
|           | **The Ordeal**      | Confronting Evil   | **Confrontation / Accusation**: Facing the likely killer, your mentor, or the truth about your own role. May involve finding or using the Weapon. |
|           | **Reward**          | MacGuffin          | You obtain or fully understand the Weapon and/or recover key memories. You gain leverage: knowledge, power, or emotional closure. |
| **Act III**| **Road Back**      | Chase Scene        | Trying to act on the truth. Escaping a collapsing afterlife, fleeing a vengeful killer, racing to complete a ritual, or hurrying to save someone. |
|           | **Resurrection**    | Ego Death          | Final moral/spiritual decision: revenge vs. forgiveness; self‑resurrection vs. fixing Death; saving one person vs. many, etc. |
|           | **Return**          | Saving Home        | The world (local or cosmic) resets or changes based on your choice. Endings range from small, intimate closures to reshaping the afterlife itself. |

Notes:

- The **murder mystery** is present in all beats, but:
  - Some runs emphasize cosmic stakes (your death entwined with the Death God).
  - Others are more intimate (family betrayal, personal secrets) with the cosmic glitch as backdrop.
- Regardless of emphasis:
  - The player always **leaves**, faces **trials**, makes a **transformative choice**, and **returns** in a new state.

---

## 6. UI Enhancements

### 6.1 The Dossier

The current `Inventory` and `History` are insufficient for a mystery. We add a `DossierPanel`.

**Functionality:**

- **Suspect Board**
  - List known NPCs with:
    - Role (Lover, Rival, etc.).
    - Known/guessed motives.
    - Current suspicion level (from the *player’s* perspective, not necessarily the truth).

- **Clue Repository**
  - List all discovered clues:
    - Short label (e.g. “Torn letter from the Mayor”).
    - Optional short description or notes.
  - Clicking a clue can:
    - Show more detail.
    - Highlight related suspects.

- **Context Injection**
  - The content of the Dossier is passed explicitly into the LLM’s **system/context prompt** so:
    - The DM reliably references known clues and suspects.
    - New scenes build on established facts, not hallucinated ones.

**Layout:**

- **Desktop UI**
  - Main text in the center.
  - `History` on the left.
  - `Dossier` on the right, as a tabbed view (Characters / Clues).

- **Mobile UI**
  - `Dossier` accessible via its own button (similar to History toggle).
  - Likely a full‑screen overlay with tabs for Characters and Clues.

### 6.2 Choices & Free‑Text Input UI

- Add a **persistent text input** under the narrative:
  - Placeholder: “Or type your own action…”
- Suggested choices appear as buttons above or beside the text box.
- When the player presses **Enter** or clicks a button:
  - The app sends:
    - The chosen button label **or** the free‑text string.
    - The current `GameState`, including:
      - Beat index / phase.
      - `mystery` slice.
      - Dossier contents.
  - `LLMService` constructs the prompt and requests the next page.

---

## 7. Implementation Roadmap

### Phase 1: State & Generation (Immediate)

- [ ] **Refactor `MacGuffinGenerator` → `MysteryGenerator`**

  - `MysteryGenerator.createMystery()` – Generate the full case:
    - Victim profile (player pre‑death identity, relationships, vulnerabilities).
    - Killer selection (guilty suspect + back‑up candidates).
    - Murder method (physical / psychological / supernatural).
    - Crime scene (location, time, circumstances).
    - Primary motive (greed, revenge, cosmic necessity, etc.).

  - `SuspectGenerator.generateCohort()` – Create the suspect web:
    - 3–4 core suspects with defined roles.
    - Relationships matrix among suspects and victim.
    - Individual motives for each.
    - Alibi system with true/false alibis and supporting evidence stubs.
    - Basic personality traits (for interrogation flavor).

  - `ClueGenerator.seedClues()` – Distribute evidence:
    - 5–7 physical clues (weapon, documents, personal items, etc.).
    - 3–4 testimonial clues (statements, alibis).
    - 2–3 circumstantial/environmental clues.
    - Clue–suspect mapping:
      - Which clues implicate/exonerate which suspects.
    - Revelation triggers:
      - Which beats or prior clues are needed to unlock major reveals.

  - `WeaponGenerator.generate()` – Define the pivotal “Weapon”:
    - Physical vs. informational determination.
    - Connection logic: how it ties killer, motive, and potential Death God involvement together.
    - Discovery conditions: where and when it can appear in the story.
    - Usage rules:
      - Possible uses in confrontations and endings (e.g., expose murderer vs. heal afterlife).

  - `MysteryValidator.ensureSolvable()` – Sanity checks:
    - ≥ 3 genuine clues point toward the killer.
    - No single clue is fully conclusive alone.
    - Multiple routes to understanding (different clue combinations).
    - Red herrings feel plausible and can be resolved/explained later.
    - The final confrontation can be logically supported by discovered clues (even if the player role‑plays confusion).

- [ ] **Update `GameState`**
  - Add `mystery` slice:
    - `victim`, `suspects`, `killer`, `weapon`, `clues`, `cluesFound`, `accusationsMade`, `certaintyLevel`.

- [ ] **Update `NPCManager`**
  - Add suspect‑specific behaviors and dialogue triggers.
  - Implement basic alibi verification (clues that support or contradict their stories).

### Phase 2: LLM Context & UI

- [ ] **Create `Dossier` UI**
  - Desktop: right‑hand panel, tabbed (Characters / Clues).
  - Mobile: togglable panel via button.

- [ ] **Wire Dossier to State**
  - Dossier is a view over `mystery` + player‑seen clues.
  - Support future player notes (if needed).

- [ ] **Update `LLMService`**
  - Inject relevant `mystery` state and Dossier summary into the system prompt:
    - Suspect list and roles.
    - Known clues and high‑level implications.
    - Current beat / phase.
  - Ensure the prompt clarifies:
    - Narrative **cannot be broken**; DM must always steer toward the next beat.
    - The player’s **free‑text** may be surprising but must be honored as much as possible in‑world.

### Phase 3: Beats & Choice Handling

- [ ] **Rewrite Core Beats for the New Premise**
  - `Prologue`: Waking up dead in a glitching afterlife.
  - `Call`: Realizing (or being told) you were murdered.
  - `Meeting Mentor`: Establish mentor/guide and first angle on the mystery.
  - `Threshold`: First real choice to pursue the truth (or flee from it).
  - `Road of Tests`: Replace generic obstacles with:
    - Investigations and interrogations.
    - Encounters with undead or hunters reacting to the glitch.
    - Moral dilemmas tied to suspects and factions.
  - `Ordeal`: Confrontation/Accusation scene using accumulated clues.
  - `Reward`: Obtaining/understanding the Weapon or recovering key memories.
  - Act III beats (`Road Back`, `Resurrection`, `Return`): Branch endings based on:
    - What truth the player reached.
    - How they interpret and act on it (forgiveness, revenge, self‑sacrifice, etc.).

- [ ] **Update `ChoiceClassifier`**
  - Expand to handle:
    - `INVESTIGATE`
    - `INTERROGATE`
    - `ACCUSE`
    - `SEEK_HELP`
    - `ESCAPE`
    - `REFLECT / INTROSPECT`
    - Others as needed.
  - Ensure it can read both:
    - Button‑based options.
    - Free‑text input.

- [ ] **Free‑Text Input Handling**
  - Implement the text input UI.
  - Route free‑text through `ChoiceClassifier`.
  - Add tests for:
    - Wild or off‑topic actions (ensure they get re‑routed into the story).
    - Direct accusations by name.
    - Attempts to “break” the fiction (DM must respond diegetically and re‑rail).