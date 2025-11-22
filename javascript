export function createWorldState({ rng }) {
  return {
    tone: WORLD_TONES.MYTHIC,
    activeEffects: [],
    flags: Object.create(null),
    tags: [],
    deathScenario: null,
    setting: null, // NEW: concrete setting object from setting-generator
    applyDelta(delta) {
      for (const [k, v] of Object.entries(delta)) {
        if (k === "tags" && Array.isArray(v)) {
          this.tags.push(...v);
        } else if (k === "activeEffects" && Array.isArray(v)) {
          this.activeEffects.push(...v);
        } else if (k === "setting" && v) {
          this.setting = v;
        } else {
          this[k] = v;
        }
      }
    },
    // ...
  };
}

import { generateSetting } from "../systems/setting-generator.js";

export function createGameState({ rng, config = {} }) {
  const player = createPlayerState({ rng });
  const world = createWorldState({ rng });
  // ...

  // Apply scope (default to random if not provided)
  if (config.scope) {
    world.scope = config.scope;
  } else {
    const scopes = Object.values(STORY_SCOPE);
    world.scope = rng.pick(scopes);
  }

  // After scope is set, generate concrete setting
  world.setting = generateSetting({ rng, scope: world.scope });

  // ...
}

const systemPrompt = buildSystemPrompt({
  terminology,
  worldTone: world.tone,
  choiceClassifications: Object.values(CHOICE_CLASSIFICATIONS),
  scope: mystery?.scope || world.scope || "regional",
  setting: world.setting // NEW: concrete setting
});

const mystery = gameState.mystery;
const weapon = mystery.weapon;
const deathScenario = mystery.deathScenario;

let weaponInstruction = "";
if (weapon.name === "Unknown") {
  weaponInstruction = `The method of death is not yet known. Emphasize the wound or absence of obvious harm, and nudge the player toward investigating the body and scene to discover the method.`;
} else if (deathScenario.weaponVisible) {
  weaponInstruction = `The weapon, ${weapon.name}, is visible. Describe it clearly; the player already knows this part.`;
} else {
  weaponInstruction = `The weapon used was ${weapon.name}, but it is not visible here. Mention subtle evidence of that method without naming the weapon outright.`;
}

const investigationHistory = Array.from(
  gameState.narrative.flags["investigationMethodsUsed"] || []
).join(", ") || "none yet";

const finalPrompt = `
This is the 'Call to Adventure' / Discovery of the Corpse.

You stand over your own body at ${deathScenario.location}.
${weaponInstruction}

Investigation methods used so far: ${investigationHistory}.
Based on this, offer 3–4 concrete choices:
- At least one that examines the body more closely.
- At least one that inspects the surroundings.
- At least one that probes your fading memories.
If you include a "move on" choice, treat it as advancing to the next beat.
Do not invent new investigation systems; use the categories above.
`;

const scope_text = scopeGuidance[scope] || scopeGuidance.regional;

let settingSynopsis = "";
if (setting && setting.synopsis) {
  settingSynopsis = `SETTING SYNOPSIS: ${setting.synopsis}

The main investigation currently centers on ${setting.primaryLocation || "an unspecified place"}. Zoythe died at ${setting.deathLocation || "an unknown site"}.`;
}

let railroadText = "";
if (options.railroadActive && options.railroadInstruction) {
  railroadText = `
RAILROAD INSTRUCTION:
- A rail event is currently active. In this beat, you MUST follow this constraint:
  "${options.railroadInstruction}"
- Do not offer choices that violate this constraint.`;
}

