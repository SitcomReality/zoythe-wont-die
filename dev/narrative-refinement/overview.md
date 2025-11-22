# Narrative Refinement Plan

This directory contains the implementation guide for upgrading the narrative engine to be more context-aware, specific, and logic-driven. The goal is to reduce hallucination/looping by moving decision logic from the LLM to the game code.

## Phases

1.  **[Phase 1: Concrete Setting Generation](./01-setting-generation.md)**
    *   Move from generic "Scope: Regional" tags to specific, procedurally generated settings (e.g., "The City of Klorp").
    *   Generate a concrete narrative synopsis to ground the AI.

2.  **[Phase 2: Knowledge & Context Tracking](./02-knowledge-tracking.md)**
    *   Track exactly which NPCs have been introduced (`met` status).
    *   Ensure the Ordeal only allows accusing known suspects.
    *   Filter context passed to the AI to prevent leakage of unknown info.

3.  **[Phase 3: Logic-Driven Prompts](./03-logic-driven-prompts.md)**
    *   Refactor prompts to remove ambiguity (e.g., "If weapon is unknown..." -> Logic decides this before prompting).
    *   Implement a mini-state machine for the Prologue to prevent looping (Wake -> Stand -> Observe).

4.  **[Phase 4: System Prompt Optimization](./04-system-prompt.md)**
    *   Streamline the system prompt.
    *   Inject the concrete setting and synopsis from Phase 1.
    *   Remove static conditional instructions in favor of the dynamic approach from Phase 3.