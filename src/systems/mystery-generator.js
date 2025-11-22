import { generateCohort } from "./suspect-generator.js";
import { seedClues } from "./clue-generator.js";
import { ensureSolvable } from "./mystery-validator.js";
import { generateDeathScenario } from "./death-scenario-generator.js";
import { determineResurrectionTruth } from "./twist-generator.js";

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
    
    // 1. Generate Death Scenario with scope awareness
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
    let weaponTemplate = null;
    if (deathScenario.weapon) {
      weaponTemplate = WEAPONS.find(w => w.name.toLowerCase().includes(deathScenario.weapon.toLowerCase()));
      if (!weaponTemplate) {
        weaponTemplate = {
          name: deathScenario.weapon,
          type: "unknown",
          linkToDeathGod: "Connected to your demise."
        };
      }
    } else if (deathScenario.weaponVisible) {
      weaponTemplate = rng.pick(WEAPONS);
    }

    const weapon = weaponTemplate ? {
      id: `weapon-${rng.int(100,999)}`,
      ...weaponTemplate,
      description: `A lethal artifact. ${weaponTemplate.linkToDeathGod}`,
      discoveryTier: deathScenario.investigationLevel + 1,
      discoverable: !deathScenario.weaponVisible
    } : {
      id: `weapon-unknown`,
      name: "Unknown",
      type: "unknown",
      description: "The weapon used remains a mystery.",
      linkToDeathGod: "Unknown connection to your death.",
      discoveryTier: deathScenario.investigationLevel + 2,
      discoverable: true
    };

    // 5. Generate Suspects with scope awareness
    const suspects = generateCohort({ rng, scope, twistTemplate: twist });

    // 6. Select Killer
    const suspectIds = Array.from(suspects.keys());
    if (suspectIds.length === 0) continue;
    
    const killerId = rng.pick(suspectIds);
    const killer = suspects.get(killerId);
    if (killer) {
      killer.alibi.isTrue = false;
    }

    // 7. Seed Clues
    const clueData = seedClues({ suspects, killerId, weapon, rng, twistTemplate: twist, deathScenario });

    const mystery = {
      twist,
      victim,
      weapon,
      killerId,
      suspects,
      clues: clueData,
      deathScenario,
      scope,
      progress: {
        accusationMade: false,
        correctKillerAccused: false,
        weaponSecured: false,
        cluesFoundCount: 0
      }
    };

    if (ensureSolvable(mystery)) {
      return mystery;
    }
  }

  throw new Error("Failed to generate valid mystery after max attempts");
}

// Note: We cannot access gameState inside createMystery to call determineResurrectionTruth directly
// because createMystery returns the mystery object which is THEN attached to gameState.
// We need to call determineResurrectionTruth externally after mystery creation.