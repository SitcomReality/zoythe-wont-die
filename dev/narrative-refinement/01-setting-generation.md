# Phase 1: Concrete Setting Generation

**Goal:** Replace generic scope definitions with specific, procedurally generated setting descriptions to ground the narrative and feed a concise, concrete synopsis into the system prompt.

---

## 1. Create `src/systems/setting-generator.js`

Implement a generator that creates a concrete setting object based on the selected `scope`.

```javascript
// src/systems/setting-generator.js
import { STORY_SCOPE } from "../config/constants.js";

export function generateSetting({ rng, scope }) {
  // 1. Pick a base template per scope
  // Intimate: "The Village of [Name]", "The [Name] Homestead"
  // Regional: "The City of [Name]", "The [Name] Valley"
  // National: "[Kingdom Name]", "The [Name] Empire"
  // Cosmic: "The [Name] Celestial Sphere", "The Broken Firmament of [Name]"

  // 2. Generate a place name and governing power / faction
  // e.g. mayoral dynasty vs. trade guild, rival cults of death, warring kingdoms.

  // 3. Generate a background synopsis that can be used *verbatim* in the system prompt:
  // "A [adjective] [location type] where [conflict] is happening."

  // 4. Include specific story hooks for Zoythe:
  // - where Zoythe is from
  // - where Zoythe died (may differ from origin)
  // - any notable factions or divine influences relevant to death/interregnum

  return {
    id: `setting-${Date.now()}`,
    scope: scope || STORY_SCOPE.REGIONAL,
    name: "The City of Klorp",
    type: "city",
    // Where the main investigation takes place
    primaryLocation: "The City of Klorp",
    // Where Zoythe originally came from (can differ from primaryLocation)
    originLocation: "a wind-scoured farming village on the steppes",
    // Where Zoythe died; this should match the deathScenario / mystery generator
    deathLocation: "an abandoned shrine beneath the city amphitheatre",
    description: "A bustling trade hub where a mayoral dynasty is losing power to a growing guild.",
    factions: [
      "The Old Klorpian Line (mayoral dynasty)",
      "The Guild of Untaxed Commerce"
    ],
    divineContext: "Two exhausted death cults argue over who owns your soul while the true Death God lies broken.",
    // A concise synopsis, < ~3 sentences, to drop into the system prompt
    synopsis: "The story takes place in the City of Klorp, a once-stable trade capital where a fading mayoral line is being edged out by ruthless merchants. Zoythe died in a forgotten shrine under the amphitheatre, and now stalks the city as a confused, murdered soul. Everyone is pretending the gods are fine. They are not.",
  };
}
```