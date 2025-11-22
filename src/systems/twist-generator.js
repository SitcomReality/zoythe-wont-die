export const RESURRECTION_TWISTS = {
  COMPANION_BETRAYAL: "companion_betrayal",
  SELF_DEFENSE: "self_defense",
  NECESSARY_SACRIFICE: "necessary_sacrifice",
  MISTAKEN_IDENTITY: "mistaken_identity",
  DIVINE_PAWN: "divine_pawn",
  NONE: "none"
};

const TWIST_DEFINITIONS = {
  [RESURRECTION_TWISTS.COMPANION_BETRAYAL]: {
    label: "Companion Betrayal",
    summary: "A trusted companion or mentor was the true killer all along.",
    beatHint: "Reveal that someone who guided or aided you has been working against you, and now they stand revealed as your murderer.",
    suggestedScenes: [
      "The mentor calmly explains why they had to kill you, as if it were obvious.",
      "You notice a tiny, familiar gesture in the killer that only your closest ally makes.",
      "An old promise or comforting phrase is repeated by the killer, word for word."
    ],
    foreshadowing: {
      id: "foreshadow:resurrection:companion_betrayal",
      type: "resurrectionTwist",
      summary: "Someone close to you is hiding something dangerous.",
      detail: "Seed small moments where a companion or mentor seems evasive, contradicts themselves, or appears at scenes they shouldn't logically be in. Never state outright that they are the killer; just let their reliability feel slightly off.",
      targetBeats: ["heroJourney:intro:meetingMentor", "heroJourney:tests:firstTrial"],
      strength: "subtle"
    }
  },
  [RESURRECTION_TWISTS.SELF_DEFENSE]: {
    label: "Self-Defense Turned Tragedy",
    summary: "You were the aggressor; the 'murder' happened when someone defended themselves.",
    beatHint: "Reveal that you tried to do something terrible, and your death was the result of someone stopping you.",
    suggestedScenes: [
      "Fragments of memory show you lunging first, weapon raised.",
      "An NPC shows you a wound you gave them shortly before you died.",
      "You recall begging someone to 'do it' as you lost control."
    ],
    foreshadowing: {
      id: "foreshadow:resurrection:self_defense",
      type: "resurrectionTwist",
      summary: "Your own actions on the night of your death were more aggressive than you remember.",
      detail: "Drop hints that you had a temper, made threats, or were planning something reckless before you died. Let NPCs react to you with a mix of fear and guilt.",
      targetBeats: ["heroJourney:intro:callToAdventure", "heroJourney:tests:firstTrial"],
      strength: "moderate"
    }
  },
  [RESURRECTION_TWISTS.NECESSARY_SACRIFICE]: {
    label: "Necessary Sacrifice",
    summary: "Your death was part of a ritual or plan to prevent a greater catastrophe.",
    beatHint: "Reveal that your death closed a door, sealed a breach, or saved many lives.",
    suggestedScenes: [
      "Visions of worlds that would have burned if you had lived.",
      "A divine ledger shows your name balancing an apocalyptic equation.",
      "The killer weeps, insisting they had no choice."
    ],
    foreshadowing: {
      id: "foreshadow:resurrection:necessary_sacrifice",
      type: "resurrectionTwist",
      summary: "Someone keeps insisting that some losses are 'necessary' for the greater good.",
      detail: "Let conversations and clues reference looming catastrophes, hard choices, and talk of 'acceptable losses'. A few NPCs might treat your death with an odd air of inevitability.",
      targetBeats: ["heroJourney:intro:meetingMentor", "heroJourney:tests:firstTrial"],
      strength: "subtle"
    }
  },
  [RESURRECTION_TWISTS.MISTAKEN_IDENTITY]: {
    label: "Mistaken Identity",
    summary: "You were not the intended victim, or someone else should have died in your place.",
    beatHint: "Reveal that someone else bears the true curse or destiny, and you intercepted it.",
    suggestedScenes: [
      "The killer insists they were aiming for another soul entirely.",
      "You see your own face flicker into another's in the divine reflection.",
      "A swapped token, cloak, or sigil marks you as the wrong target."
    ],
    foreshadowing: {
      id: "foreshadow:resurrection:mistaken_identity",
      type: "resurrectionTwist",
      summary: "You keep being confused with someone else, or carrying things that don't quite feel like yours.",
      detail: "Include small mix-ups: NPCs call you by the wrong name, react as if they expected someone else, or notice that your belongings don't match your life. Drop one or two object-based hints (cloak, sigil, token).",
      targetBeats: ["heroJourney:intro:callToAdventure", "heroJourney:tests:firstTrial"],
      strength: "subtle"
    }
  },
  [RESURRECTION_TWISTS.DIVINE_PAWN]: {
    label: "Divine Pawn",
    summary: "Gods or cosmic forces orchestrated your death as part of their own agenda.",
    beatHint: "Reveal that both you and the killer were pieces in a god's game.",
    suggestedScenes: [
      "A divine fragment admits it moved everyone like game pieces.",
      "Constellations rearrange to show you as a pawn on a board.",
      "A chorus of dead gods debates whether your sacrifice was 'worth the narrative'."
    ],
    foreshadowing: {
      id: "foreshadow:resurrection:divine_pawn",
      type: "resurrectionTwist",
      summary: "Cosmic forces keep taking an unusual interest in your tiny, messy murder.",
      detail: "Let environments, minor NPCs, or strange omens suggest that gods are watching: repeating symbols, whispers about 'the game', or coincidences that feel too scripted.",
      targetBeats: ["heroJourney:tests:firstTrial", "heroJourney:ordeal:heartOfInterregnum"],
      strength: "moderate"
    }
  },
  [RESURRECTION_TWISTS.NONE]: {
    label: "No Further Twist",
    summary: "The story resolves straightforwardly; the killer and motive were exactly what they seemed.",
    beatHint: "Offer closure without new reversals, focusing on how the protagonist integrates what they've learned.",
    suggestedScenes: [
      "You simply accept the truth and decide what to do with it.",
      "There are no extra masks; everyone was exactly as they appeared.",
      "The only twist is that, for once, there is no twist."
    ],
    foreshadowing: null
  }
};

/**
 * Determine the Resurrection Truth at the START of the game.
 * This sets up the deep narrative reality and registers foreshadowing for it.
 * @param {Object} params
 * @param {Object} params.gameState
 * @param {Object} params.mystery
 * @param {Object} params.rng
 */
export function determineResurrectionTruth({ gameState, mystery, rng }) {
  // 1. Analyze Mystery Configuration
  const baseTwist = mystery.twist;
  const killer = mystery.suspects.get(mystery.killerId);
  const isMentorKiller = killer && killer.role === "mentor";
  const isAllyKiller = killer && killer.role === "ally";

  let weightedPool = [];

  // 2. Assign weights based on mystery setup
  if (isMentorKiller || isAllyKiller) {
    weightedPool.push(RESURRECTION_TWISTS.COMPANION_BETRAYAL, RESURRECTION_TWISTS.COMPANION_BETRAYAL);
  }
  
  if (baseTwist === "ritual-sacrifice") {
    weightedPool.push(RESURRECTION_TWISTS.NECESSARY_SACRIFICE, RESURRECTION_TWISTS.NECESSARY_SACRIFICE);
  } else if (baseTwist === "jealous-rage") {
    weightedPool.push(RESURRECTION_TWISTS.SELF_DEFENSE, RESURRECTION_TWISTS.NONE);
  } else if (baseTwist === "accidental-godslaying") {
    weightedPool.push(RESURRECTION_TWISTS.MISTAKEN_IDENTITY, RESURRECTION_TWISTS.DIVINE_PAWN);
  } else if (baseTwist === "cosmic-conspiracy") {
    weightedPool.push(RESURRECTION_TWISTS.DIVINE_PAWN, RESURRECTION_TWISTS.DIVINE_PAWN);
  } else {
    weightedPool.push(RESURRECTION_TWISTS.NONE, RESURRECTION_TWISTS.NONE, RESURRECTION_TWISTS.NONE);
  }

  // 3. Select Truth
  const chosenType = rng.pick(weightedPool);
  const def = TWIST_DEFINITIONS[chosenType];

  // 4. Persist
  gameState.narrative.flags["resurrectionTwistType"] = chosenType;

  // 5. Register Foreshadowing immediately so it can appear in early beats
  if (gameState.foreshadowingTracker && def.foreshadowing) {
    gameState.foreshadowingTracker.registerNeed({
      id: def.foreshadowing.id,
      type: def.foreshadowing.type,
      summary: def.foreshadowing.summary,
      detail: def.foreshadowing.detail,
      targetBeats: def.foreshadowing.targetBeats,
      strength: def.foreshadowing.strength
    });
  }

  return chosenType;
}

/**
 * Resolve the twist for the actual beat content generation.
 * Can optionally modify the presentation based on player's accusation accuracy.
 */
export function resolveResurrectionScene({ gameState, rng }) {
  const type = gameState.narrative.flags["resurrectionTwistType"] || RESURRECTION_TWISTS.NONE;
  const def = TWIST_DEFINITIONS[type] || TWIST_DEFINITIONS[RESURRECTION_TWISTS.NONE];
  
  return {
    type,
    label: def.label,
    summary: def.summary,
    beatHint: def.beatHint,
    suggestedScene: rng.pick(def.suggestedScenes)
  };
}

/**
 * Get human-readable info for a stored resurrection twist type.
 * @param {string} type
 */
export function getResurrectionTwistDefinition(type) {
  return TWIST_DEFINITIONS[type] || TWIST_DEFINITIONS[RESURRECTION_TWISTS.NONE];
}