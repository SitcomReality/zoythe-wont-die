// Hooks to bridge to the detailed design docs (zoythe-designdocX/Y) later.
// This file is intentionally tiny and self-contained, so it can be replaced
// once the docs are parsed into structured data.

export function initDesignDocHooks({ gameState, beatOrchestrator, eventBus }) {
  // Placeholder: keep a reference spot for design-doc-driven content.
  // Later this can expose helpers like:
  //  - getBeatConfigFromDoc(id)
  //  - getArchetypeTuningFromDoc()
  // For now, no-op; the core loop is already functional.
  void gameState;
  void beatOrchestrator;
  void eventBus;
}