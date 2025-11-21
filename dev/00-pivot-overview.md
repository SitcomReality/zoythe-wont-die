# Zoythe Pivot Implementation Guide: The Glitch Murder

This directory contains the step-by-step implementation plan for pivoting Zoythe from a generic MacGuffin quest to a **procedural afterlife murder mystery**.

## Core Pivot Concept
**"The Dead Detective"**: The player is a murder victim in a glitching afterlife. The Death God is dead, causing reality to break. The player must solve their own murder to resolve their Hero's Journey.

## Implementation Phases

The work is divided into four distinct phases, each detailed in its own document:

1. **[Phase 1: State & Generation](./01-state-and-generation.md)**
   - Converting MacGuffin-oriented generators and state into a single `Mystery` object (Twist, Victim, Killer, Weapon, Clues).
   - Implementing `MysteryGenerator`, `SuspectGenerator`, `ClueGenerator`, and `MysteryValidator`.
   - Updating `GameState` to store `mystery` and wiring mystery creation into New Game startup (without yet touching UI or beats).

2. **[Phase 2: UI & Interaction](./02-ui-and-interaction.md)**
   - Building the **Dossier UI** (Suspects Board & Clue Repository) with responsive layouts.
   - Implementing **Dual Input System** (Choice Buttons + Free-Text Action Input) without changing beat-level logic.
   - Updating `LLMService` to inject dynamic dossier/mystery context into narrative prompts.

3. **[Phase 3: Narrative & Logic](./03-narrative-beats.md)**
   - Rewriting core beats (Prologue, Call, Tests, Ordeal, Act III) to function as investigation scenes using the Mystery state.
   - Implementing **Intent Classification** for free-text inputs (`INVESTIGATE`, `INTERROGATE`, `ACCUSE`, etc.) and mapping them into beat logic.
   - Finalizing the "Accusation/Ordeal" logic and resolution mechanics.

4. **[Phase 4: Cleanup & De-MacGuffinization](./04-cleanup-and-de-macguffinization.md)**
   - Removing or refactoring remaining MacGuffin/home-threat specific systems and texts to the murder-mystery model.
   - Ensuring endings, tone systems, and NPC generators no longer reference the old MacGuffin quest premise.

