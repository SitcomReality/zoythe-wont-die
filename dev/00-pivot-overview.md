# Zoythe Pivot Implementation Guide: The Glitch Murder

This directory contains the step-by-step implementation plan for pivoting Zoythe from a generic MacGuffin quest to a **procedural afterlife murder mystery**.

## Core Pivot Concept
**"The Dead Detective"**: The player is a murder victim in a glitching afterlife. The Death God is dead, causing reality to break. The player must solve their own murder to resolve their Hero's Journey.

## Implementation Phases

The work is divided into three distinct phases, each detailed in its own document:

1. **[Phase 1: State & Generation](./01-state-and-generation.md)**
   - Converting `MacGuffinGenerator` to `MysteryGenerator` (Twist, Victim, Killer, Weapon).
   - Implementing `SuspectGenerator` (Roles, Motives, Alibis) and `ClueGenerator`.
   - Updating `GameState` with the `mystery` slice and implementing `MysteryValidator`.

2. **[Phase 2: UI & Interaction](./02-ui-and-interaction.md)**
   - Building the **Dossier UI** (Suspects Board & Clue Repository) with responsive layouts.
   - Implementing **Dual Input System** (Choice Buttons + Free-Text Action Input).
   - Updating `LLMService` to inject dynamic dossier context into narrative prompts.

3. **[Phase 3: Narrative & Logic](./03-narrative-beats.md)**
   - Rewriting core beats (Prologue, Call, Tests) to function as investigation scenes.
   - Implementing **Intent Classification** for free-text inputs (`INVESTIGATE`, `INTERROGATE`, `ACCUSE`).
   - Finalizing the "Accusation/Ordeal" logic and resolution mechanics.