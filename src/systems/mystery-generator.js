import { generateCohort } from "./suspect-generator.js";
import { seedClues } from "./clue-generator.js";
import { ensureSolvable } from "./mystery-validator.js";
import { generateDeathScenario } from "./death-scenario-generator.js";

const TWISTS = ["ritual-sacrifice", "jealous-rage", "accidental-godslaying", "cosmic-conspiracy"];

const WEAPONS = [
  { name: "Void Dagger", type: "physical", linkToDeathGod: "Forged from the Death God's ribs." },
  { name: "Word of Unmaking", type: "cosmic", linkToDeathGod: "A spoken fragment of the Death God's last breath." },
  { name: "Shard of the Mirror", type: "physical", linkToDeathGod: "Reflects the void where the God once stood." },
  { name: "Poisoned Nectar", type: "physical", linkToDeathGod: "Distilled from the rotting divine garden." }
];

export function createMystery({ rng, scope = "regional" }) {
  let attempts = 0;
  const MAX_ATTEMPTS = 5;

  while (attempts < MAX_ATTEMPTS) {
    attempts++;
    
    // 1. Generate Death Scenario
    const deathScenario = generateDeathScenario({ rng, scope });

    // 2. Select Twist
    const twist = rng.pick(TWISTS);

    // 3. Generate Victim Profile
    const victim = {
      id: "player",
      name: "The Protagonist",
      archetypeHint: "unknown",
      causeOfDeath: { 
        knownToPlayer: deathScenario.methodVisible, 
        description: deathScenario.methodDescription 
      },
      bodyLocation: deathScenario.location,
      deathScenario: deathScenario.type
    };

    // 4. Generate Weapon
    // Use scenario's weapon preference if applicable
    let weaponTemplate = null;
    if (deathScenario.weapon) {
      // Scenario specifies weapon type; find matching template or create one
      weaponTemplate = WEAPONS.find(w => w.name.toLowerCase().includes(deathScenario.weapon.toLowerCase()));
      if (!weaponTemplate) {
        // Fallback: generic weapon matching scenario
        weaponTemplate = {
          name: deathScenario.weapon,
          type: "unknown",
          linkToDeathGod: "Connected to your demise."
        };
      }
    } else {
      weaponTemplate = rng.pick(WEAPONS);
    }

    const weapon = {
      id: `weapon-${rng.int(100,999)}`,
      ...weaponTemplate,
      description: `A lethal artifact. ${weaponTemplate.linkToDeathGod}`,
      discoveryTier: deathScenario.investigationLevel + 1
    };

    // 5. Generate Suspects
    const suspects = generateCohort({ rng, twistTemplate: twist });

    // 6. Select Killer
    const suspectIds = Array.from(suspects.keys());
    if (suspectIds.length === 0) continue; // Retry if no suspects
    
    const killerId = rng.pick(suspectIds);
    const killer = suspects.get(killerId);
    if (killer) {
      killer.alibi.isTrue = false; // Killer lies
    }

    // 7. Seed Clues
    const clueData = seedClues({ suspects, killerId, weapon, rng, twistTemplate: twist });

    const mystery = {
      twist,
      victim,
      weapon,
      killerId,
      suspects, // Map
      clues: clueData, // { all: Map, discovered: Set, knownSuspects: Set }
      deathScenario, // Store the scenario
      progress: {
        accusationMade: false,
        correctKillerAccused: false,
        weaponSecured: false,
        cluesFoundCount: 0
      }
    };

    // 8. Validate
    if (ensureSolvable(mystery)) {
      return mystery;
    }
  }

  throw new Error("Failed to generate valid mystery after max attempts");
}