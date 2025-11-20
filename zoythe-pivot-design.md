# Zoythe: The Glitch Murder – Design Pivot & Roadmap

This document supersedes `zoythe-designdoc.md`. It outlines the shift from a generic "MacGuffin Quest" to a **Cosmic Murder Mystery**, details the new systems required, and lists the remaining tasks to complete the project.

## 1. Conceptual Pivot: The Dead Detective

**Old Premise:** A hero leaves home to save it from a threat using a MacGuffin.
**New Premise:** The protagonist is a murder victim whose death coincided with the death of the Death God, causing a "glitch" in the afterlife. They are stuck between existence and oblivion.

*   **Goal:** Solve your own murder.
*   **The Twist:** Your murder is inextricably linked to the cosmic collapse. Solving one solves the other.
*   **Motivation:** Begins as pure self-interest ("Why am I here? Who killed me?"), evolves into a choice about the fate of the afterlife (Hero's Journey).

## 2. New System: The Mystery Engine

We need to replace the `MacGuffinGenerator` with a `MysteryGenerator`.

### 2.1 Mystery State (`src/state/mystery-state.js`)

Instead of just tracking a "MacGuffin", we track:
*   **The Victim (Player):** Cause of death (unknown initially), location of body.
*   **The Suspects (NPCs):** 3-4 key characters generated at start.
    *   *Role:* The Lover, The Rival, The Business Partner, The Zealot.
    *   *Motive:* Generated based on archetype.
    *   *Alibi:* Some true, some false.
*   **The Killer:** One of the suspects (or a conspiracy).
*   **The Weapon:** A "Divine Artifact" (formerly the MacGuffin). This is the link between the mundane murder and the cosmic crisis.
*   **Clues:** A collection of facts discovered during Beats.

### 2.2 Procedural Generation

At `New Game`:
1.  Generate **The Crime**: Who killed you, with what, and why?
2.  Generate **The Glitch**: How the weapon broke the cycle of death.
3.  Generate **Suspects**: Populate the `NPC Roster` with these specific roles.

### 2.3 Clue & Deduction System

*   **Clue Discovery:** Beats now yield `Clue` items (e.g., "A torn letter," "Traces of ambrosia").
*   **Deduction Logic:** The "Ordeal" (Act II Climax) is now an Accusation/Confrontation scene.

## 3. Narrative Arc Re-mapping (Hero's Journey Adaptation)

The 18-page structure remains, but the context changes:

| Phase | Beat Name | Old Context | New Context |
|-------|-----------|-------------|-------------|
| **Act I** | **Prologue** | World setting | You wake up dead. The afterlife is glitching. |
| | **Call to Adventure** | Divine sign | You realize you were murdered. A compulsion to find the truth. |
| | **Meeting Mentor** | Old Wise Figure | A "Spirit Guide" or "Hardboiled Ghost" explains the rules. |
| | **Threshold** | Leaving Home | Entering the "Liminal City" where suspects hide. |
| **Act II** | **Road of Tests** | Obstacles | Interrogations, finding physical evidence, dodging "Cleaners". |
| | **The Ordeal** | Confronting Evil | **The Accusation**. Confronting the Killer / Finding the Weapon. |
| | **Reward** | MacGuffin | Recovering the Weapon (The Divine Artifact) & Memory. |
| **Act III** | **Road Back** | Chase Scene | Escaping the collapsing afterlife with the Truth. |
| | **Resurrection** | Ego Death | Deciding: Use the Weapon to revive yourself (Selfish) or fix Death (Selfless)? |
| | **Return** | Saving Home | The Cosmos resets or changes based on your choice. |

## 4. UI Enhancements: The Dossier

The current `Inventory` and `History` are insufficient for a mystery.

*   **New Feature:** `DossierPanel` (replaces or augments History/Inventory).
*   **Function:**
    *   **Suspect Board:** Lists known NPCs and their potential motives.
    *   **Clue Repository:** List of discovered facts.
    *   **Context Injection:** The content of the Dossier is explicitly passed to the LLM to ensure it references known clues in future beats.

## 5. Implementation Roadmap

### Phase 1: State & Generation (Immediate)

*   [ ] **Refactor `MacGuffinGenerator` -> `MysteryGenerator`**:
    *   Generate `Weapon` (The "MacGuffin").
    *   Generate `Killer` and `Motive`.
    *   Generate `Method`.
*   [ ] **Update `GameState`**: Add `mystery` slice (clues, deductions).
*   [ ] **Update `NPCManager`**: Ensure roster generation supports specific Mystery Roles (Suspect, Witness).

### Phase 2: UI & Context

*   [ ] **Create `Dossier` UI**: A tabbed view for Characters and Clues.
*   [ ] **Update `LLMService`**: Inject `mystery` state (current suspects, found clues) into the System Prompt so the AI "knows" the case status.

### Phase 3: Beat Rewrites

*   [ ] **Rewrite Core Beats**:
    *   `Prologue`: Wake up dead.
    *   `Call`: Realize murder.
    *   `Tests`: Switch generic obstacles to investigation-themed encounters.
*   [ ] **Update `ChoiceClassifier`**: Add `INVESTIGATE`, `ACCUSE`, `INTERROGATE` tags.

### Phase 4: Polish & Missing Features (From Original Doc)

*   [ ] **Dev Tools / Debug Panel**: Essential for testing mystery logic (e.g., "Reveal Killer" button).
*   [ ] **Robust Error Handling**: Fallback templates if LLM fails to generate a clue.