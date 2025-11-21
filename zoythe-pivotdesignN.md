# Zoythe: The Glitch Murder – Design Pivot & Roadmap  
This document supersedes `zoythe-designdoc.md`. It outlines the shift from a generic "MacGuffin Quest" to a procedurally generated murder mystery narrative experience (structured to feel more like a dynamic novel than a traditional puzzle game), details required new systems, and lists remaining tasks to complete the project.

## 1. Conceptual Pivot: The Dead Detective

**Old Premise:** A hero leaves home to save it from a threat using a MacGuffin.  
**New Premise:** The protagonist is a murder victim whose death coincided with the demise of the Death God, causing a "glitch" in the afterlife that traps them between existence and oblivion.

*   **Core Narrative Focus:** Uncover the truth of your murder and navigate its cosmic or interpersonal consequences. This experience prioritizes story and choice over rigid puzzle-solving: while the hero’s journey framework (trials, confrontation, resolution, and return) is always preserved, player decisions will shape the path through key story beats, alter relationships with NPCs, and determine the ultimate outcome of the journey.
*   **The Twist:** 2-3 procedurally selected twist templates will seed early clues (revealed fully in Act III) to drive narrative depth:
    *   Mentor Betrayal: Your trusted guide had a hidden motive for your death
    *   Cosmic Conspiracy: Your murder was a deliberate step to topple the Death God
    *   Personal Revenge: A grudge (secret or unacknowledged) led to your demise
*   **Motivation Arc:** Begins as self-interest ("Why am I stuck here? Who killed me?"), evolves into exploration of factional or interpersonal dynamics, and culminates in defining choices (e.g., revenge vs. forgiveness, saving a loved one vs. mending the afterlife) that anchor the hero’s journey resolution.

## 2. New System: The Mystery Engine

We will replace the `MacGuffinGenerator` with a `MysteryGenerator` to structure procedural murder mystery narratives that align with the fixed hero’s journey backbone.

### 2.1 Mystery State (`src/state/mystery-state.js`)  
Instead of tracking a generic MacGuffin, the system will manage:
*   **The Victim (Player):** Pre-death identity, relationships, cause of death (initially unknown), and crime scene location
*   **The Suspects (NPCs):** 3-4 interconnected characters generated at launch, with assigned archetypes (Lover, Rival, Zealot, Best Friend, etc.), unique motives, and true/false alibis
*   **The Killer:** A single suspect or small conspiracy (selected during procedural generation)
*   **The Pivotal Evidence (Formerly MacGuffin):** The key link between the killer, crime, and Death God glitch—can be physical (murder weapon, cursed artifact), cosmic (divine sigil), or informational (secret alliance, unrecorded location). It will play a critical role in the Act II climax and Act III resolution.
*   **Clues:** A tiered collection of physical, testimonial, and circumstantial facts distributed across narrative beats

### 2.2 Procedural Generation Workflow (New Game Launch)
1.  **Generate The Crime:** Define killer, method, location, motive, and link to the Death God’s demise
2.  **Generate Pivotal Evidence:** Establish its type, connection to the crime, discovery conditions, and narrative role in resolution
3.  **Generate Suspect Cohort:** Create interconnected NPCs with archetypes, motives, alibis, and relationships to the victim and each other
4.  **Seed Clues:** Distribute 10-14 clues (5-7 physical, 3-4 testimonial, 2-3 circumstantial) across beats, with triggers for major revelations and red herrings (with plausible alternate explanations)

### 2.3 Clue & Narrative Coherence System
*   **Clue Discovery:** Beats yield contextually relevant clues that build toward the mystery’s resolution
*   **Deduction & Confrontation:** The Act II climax (Ordeal) is reframed as an Accusation/Confrontation scene, where player choices (predefined or custom) shape how the truth is uncovered
*   **Narrative Guardrails:** The LLM functions as a "dungeon master" to ensure all player actions—whether selecting predefined options or inputting custom text—advance toward the next critical story beat without breaking the hero’s journey framework

## 3. Narrative Arc Re-mapping (Hero’s Journey Adaptation)
The 18-page structural backbone is preserved, but each beat is recontextualized to fit the murder mystery and afterlife glitch premise. Player choices (custom or predefined) alter the path through beats, but all paths lead to a complete hero’s journey (trials, resolution, return).

| Phase       | Beat Name               | Old Context               | New Context                                                                 |
|-------------|-------------------------|---------------------------|-----------------------------------------------------------------------------|
| **Act I**   | Prologue                | World setting             | You wake up trapped between existence and oblivion; the afterlife is glitching |
|             | Call to Adventure       | Divine sign               | You realize you were murdered, sparking a compulsion to uncover the truth   |
|             | Meeting Mentor          | Old Wise Figure           | A spirit guide, ghostly detective, or deceased elder provides exposition    |
|             | Threshold               | Leaving Home              | Venture beyond your starting between-world location to pursue clues (e.g., mortal realm, underworld) |
| **Act II**  | Road of Tests           | Obstacles                 | Interrogations, clue hunts, evading glitch-warped undead, or avoiding factions hiding the truth |
|             | The Ordeal              | Confronting Evil          | The Accusation: Confront your prime suspect and uncover the pivotal evidence |
|             | Reward                  | MacGuffin                 | Secure the pivotal evidence and recover lost memories of your death         |
| **Act III** | Road Back               | Chase Scene               | Escape collapsing afterlife regions, evade the killer’s retaliation, or outrun a wrathful god’s agents |
|             | Resurrection            | Ego Death                 | Defining Choice: Decide the journey’s meaning (e.g., revenge vs. forgiveness, self-preservation vs. fixing the afterlife) |
|             | Return                  | Saving Home               | A resolution shaped by your choices: reset a mortal community, realign the cosmic order, or find peace in a new afterlife state |

## 4. UI Enhancements
The current `Inventory` and `History` systems are insufficient for a mystery-focused narrative with flexible player input. We will implement two key updates:

### 4.1 Dossier Panel
A dedicated, context-aware panel to track mystery progress:
*   **Tabs:**
    *   Suspect Board: NPC profiles, known motives, alibis, and clue connections
    *   Clue Repository: Organized list of discovered physical, testimonial, and circumstantial evidence
*   **Context Injection:** Dossier content is automatically passed to the LLM to ensure continuity (e.g., referencing previously found clues in future dialogue)
*   **Responsive Design:**
    *   Desktop: Fixed right-side panel (paired with left-side History panel to frame the main narrative text)
    *   Mobile: Toggleable via a dedicated button (parallel to the History button)

### 4.2 Dual Choice Input System
To balance narrative agency with structural coherence, all choice-driven pages will include:
*   **Predefined Option Buttons:** Curated, beat-aligned choices (e.g., "Press the Rival about their missing alibi," "Search the crime scene for hidden traces of ambrosia")
*   **Custom Text Input Field:** A free-form box for unique player actions/queries (e.g., "Ask the spirit guide if they saw anyone tampering with the Death God’s shrine," "Bargain with the killer to spare my sister")

The LLM will interpret custom inputs logically, respond with narrative consistency, and guide all choices—predefined or custom—to the next critical story beat, ensuring the hero’s journey arc remains intact.

## 5. Implementation Roadmap

### Phase 1: State & Procedural Generation (Immediate)
*   [ ] Refactor `MacGuffinGenerator` → `MysteryGenerator` with core methods:
    *   `createMystery()`: Generate full case (victim profile, killer, crime details, cosmic link)
    *   `generateCohort()`: Create 3-4 interconnected suspects (roles, relationships, motives, alibis)
    *   `seedClues()`: Distribute tiered clues with revelation triggers and red herring logic
    *   `generatePivotalEvidence()`: Define evidence type, crime link, discovery conditions, and resolution role
*   [ ] Update `GameState`: Add `mystery` slice (suspects, cluesFound, accusationsMade, certaintyLevel)
*   [ ] Update `NPCManager`: Implement suspect-specific dialogue triggers and alibi verification logic
*   [ ] Build `MysteryValidator.ensureSolvableAndFlexible()`:
    *   At least 3 clues point to the true killer
    *   No single clue is fully conclusive
    *   Multiple paths to resolution (supports predefined and custom choices)
    *   Red herrings have plausible alternate explanations

### Phase 2: UI & LLM Integration
*   [ ] Design and implement `Dossier` UI (tabbed Suspect Board/Clue Repository)
*   [ ] Build dual choice input system (predefined buttons + custom text field)
*   [ ] Update `LLMService`:
    *   Inject Dossier/`mystery` state into system prompts for continuity
    *   Add logic to interpret custom text inputs and redirect narratives to key story beats

### Phase 3: Beat Rewrites & Classification
*   [ ] Rewrite core beats to align with the murder mystery premise:
    *   Prologue (waking in the glitched afterlife)
    *   Call to Adventure (realizing you were murdered)
    *   Road of Tests (investigation-focused encounters)
*   [ ] Update `ChoiceClassifier`: Add tags for mystery-focused actions (`INVESTIGATE`, `ACCUSE`, `INTERROGATE`) and support for custom input intent mapping