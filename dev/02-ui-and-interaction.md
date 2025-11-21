# Phase 2: UI & Interaction

Goal: Upgrade the UI and interaction model to support the new murder-mystery experience, including a Dossier panel, dual input (buttons + free-text), and LLM prompts enriched with mystery context.

---

## 1. Systems & Files Affected

This phase touches both UI and integration layers:

- UI structure & layout
  - `src/ui/layout.js`
  - `src/ui/styles/layout.css`
- New Dossier feature
  - `src/ui/components/dossier-panel.js` (new)
  - `src/ui/styles/components/dossier-panel.css` (new)
- Choice + free-text input
  - `src/ui/components/choice-list.js`
  - `src/ui/styles/components/choice-list.css`
  - `src/ui/components/action-input.js` (new, if not embedded in choice list)
  - `src/ui/styles/components/action-input.css` (new)
- LLM integration
  - `src/narrative/engine/llm-service.js`
  - `src/integration/design-doc-hooks.js` (optionally to centralize prompt templates later)
- Game controller & orchestration
  - `src/core/game-controller.js`
  - `src/narrative/engine/beat-orchestrator.js`
  - `src/systems/choice-classifier.js` (for free-text intent classification; see Phase 3)
- State & persistence (for Dossier/mystery)
  - `src/state/game-state.js`
  - `src/core/persistence.js`
  - `src/state/mystery-state.js` (new; defined in Phase 1, but surfaced in UI here)

---

## 2. Dossier Panel (Suspects & Clues)

The Dossier is the player-facing view of the mystery state and must be wired into both UI and LLM prompts.

### 2.1 New Component: `src/ui/components/dossier-panel.js`

- Responsibilities:
  - Render a panel with two tabs:
    - Suspects: list NPCs relevant to the murder.
    - Clues: list discovered clues.
  - Read-only view (for now); no editing or note-taking in Phase 2.
- Data shape (from `gameState.mystery`):
  - `mystery.suspects`: array or Map entries with:
    - `id`, `name`, `role`, `motive`, `alibiSummary`, `suspicionLevel` (numeric or tag).
  - `mystery.clues.discovered`: array of:
    - `id`, `label`, `type` (PHYSICAL/TESTIMONIAL/CIRCUMSTANTIAL), `shortDescription`, `relatedSuspectIds`.
- Required interactions:
  - Clicking a suspect or clue:
    - Expands a detail area in-panel (simple accordion) with full description.
    - Optionally highlights related items (e.g., bold suspects related to a clue).
- States:
  - Empty state message when no suspects or clues are discovered yet.

Implementation notes:
- The panel API should accept:
  ```js
  createDossierPanel({ root, getMysterySnapshot });

