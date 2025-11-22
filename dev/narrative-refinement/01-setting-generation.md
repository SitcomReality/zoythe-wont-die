# Phase 1: Concrete Setting Generation

**Goal:** Replace generic scope definitions with specific, procedurally generated setting descriptions to ground the narrative.

## 1. Create `src/systems/setting-generator.js`

Implement a generator that creates a concrete setting object based on the selected `scope`.

```javascript
export function generateSetting({ rng, scope }) {
  // Define templates for names and descriptions per scope
  // Intimate: "The Village of [Name]", "The [Name] Homestead"
  // Regional: "The City of [Name]", "The [Name] Valley"
  // etc.

  // Generate a background synopsis
  // "A [Adjective] [Location Type] where [Conflict] is happening."

  return {
    name: "The City of Klorp",
    type: "city",
    description: "A bustling trade hub where a mayoral dynasty is losing power to a growing guild.",
    // ... specific details used to seed the system prompt
  };
}
```