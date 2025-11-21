import { generateCohort } from "./suspect-generator.js";
import { seedClues } from "./clue-generator.js";
import { ensureSolvable } from "./mystery-validator.js";

const TWISTS = ["ritual-sacrifice", "jealous-rage", "accidental-godslaying", "cosmic-conspiracy"];

const WEAPONS = [
  { name: "Void Dagger", type: "physical", linkToDeathGod: "Forged from the Death God's ribs." },
  { name: "Word of Unmaking", type: "cosmic", linkToDeathGod: "A spoken fragment of the Death God's last breath." },
  { name: "Shard of the Mirror", type: "physical", linkToDeathGod: "Reflects the void where the God once stood." },
  { name: "Poisoned Nectar", type: "physical", linkToDeathGod: "Distilled from the rotting divine garden." }
];

export function createMystery({ rng }) {
  let attempts = 0;
  const MAX_ATTEMPTS = 5;

  while (attempts < MAX_ATTEMPTS) {
    attempts++;
    
    // 1. Select Twist
    const twist = rng.pick(TWISTS);

    // 2. Generate Victim Profile
    const victim = {
      id: "player",
      name: "The Protagonist",
      archetypeHint: "unknown",
      causeOfDeath: { knownToPlayer: false, description: "Violent dissolution of the soul." },
      bodyLocation: "The Sanctum of Beginning"
    };

    // 3. Generate Weapon
    const weaponTemplate = rng.pick(WEAPONS);
    const weapon = {
      id: `weapon-${rng.int(100,999)}`,
      ...weaponTemplate,
      description: `A lethal artifact. ${weaponTemplate.linkToDeathGod}`,
      discoveryTier: 2
    };

    // 4. Generate Suspects
    const suspects = generateCohort({ rng, twistTemplate: twist });

    // 5. Select Killer
    const suspectIds = Array.from(suspects.keys());
    if (suspectIds.length === 0) continue; // Retry if no suspects
    
    const killerId = rng.pick(suspectIds);
    const killer = suspects.get(killerId);
    if (killer) {
      killer.alibi.isTrue = false; // Killer lies
      // We could modify motive here to fit the twist specifically if needed
    }

    // 6. Seed Clues
    const clueData = seedClues({ suspects, killerId, weapon, rng, twistTemplate: twist });

    const mystery = {
      twist,
      victim,
      weapon,
      killerId,
      suspects, // Map
      clues: clueData, // { all: Map, discovered: Set, knownSuspects: Set }
      progress: {
        accusationMade: false,
        correctKillerAccused: false,
        weaponSecured: false,
        cluesFoundCount: 0
      }
    };

    // 7. Validate
    if (ensureSolvable(mystery)) {
      return mystery;
    }
  }

  throw new Error("Failed to generate valid mystery after max attempts");
}