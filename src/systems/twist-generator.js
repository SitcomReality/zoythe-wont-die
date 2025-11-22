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
    ]
  },
  [RESURRECTION_TWISTS.SELF_DEFENSE]: {
    label: "Self-Defense Turned Tragedy",
    summary: "You were the aggressor; the 'murder' happened when someone defended themselves.",
    beatHint: "Reveal that you tried to do something terrible, and your death was the result of someone stopping you.",
    suggestedScenes: [
      "Fragments of memory show you lunging first, weapon raised.",
      "An NPC shows you a wound you gave them shortly before you died.",
      "You recall begging someone to 'do it' as you lost control."
    ]
  },
  [RESURRECTION_TWISTS.NECESSARY_SACRIFICE]: {
    label: "Necessary Sacrifice",
    summary: "Your death was part of a ritual or plan to prevent a greater catastrophe.",
    beatHint: "Reveal that your death closed a door, sealed a breach, or saved many lives.",
    suggestedScenes: [
      "Visions of worlds that would have burned if you had lived.",
      "A divine ledger shows your name balancing an apocalyptic equation.",
      "The killer weeps, insisting they had no choice."
    ]
  },
  [RESURRECTION_TWISTS.MISTAKEN_IDENTITY]: {
    label: "Mistaken Identity",
    summary: "You were not the intended victim, or someone else should have died in your place.",
    beatHint: "Reveal that someone else bears the true curse or destiny, and you intercepted it.",
    suggestedScenes: [
      "The killer insists they were aiming for another soul entirely.",
      "You see your own face flicker into another's in the divine reflection.",
      "A swapped token, cloak, or sigil marks you as the wrong target."
    ]
  },
  [RESURRECTION_TWISTS.DIVINE_PAWN]: {
    label: "Divine Pawn",
    summary: "Gods or cosmic forces orchestrated your death as part of their own agenda.",
    beatHint: "Reveal that both you and the killer were pieces in a god's game.",
    suggestedScenes: [
      "A divine fragment admits it moved everyone like game pieces.",
      "Constellations rearrange to show you as a pawn on a board.",
      "A chorus of dead gods debates whether your sacrifice was 'worth the narrative'."
    ]
  },
  [RESURRECTION_TWISTS.NONE]: {
    label: "No Further Twist",
    summary: "The story resolves straightforwardly; the killer and motive were exactly what they seemed.",
    beatHint: "Offer closure without new reversals, focusing on how the protagonist integrates what they've learned.",
    suggestedScenes: [
      "You simply accept the truth and decide what to do with it.",
      "There are no extra masks; everyone was exactly as they appeared.",
      "The only twist is that, for once, there is no twist."
    ]
  }
};

/**
 * Select a resurrection twist based on accusation correctness, mystery twist, and RNG.
 * Stores the chosen twist type on narrative.flags.resurrectionTwistType for later reference.
 * @param {Object} params
 * @param {Object} params.gameState
 * @param {Object} params.rng
 * @param {boolean} params.didAccuseCorrectly
 * @returns {{type:string,label:string,summary:string,beatHint:string,suggestedScene:string}}
 */
export function selectResurrectionTwist({ gameState, rng, didAccuseCorrectly }) {
  const existingType = gameState.narrative.flags["resurrectionTwistType"];
  if (existingType && TWIST_DEFINITIONS[existingType]) {
    const def = TWIST_DEFINITIONS[existingType];
    return {
      type: existingType,
      label: def.label,
      summary: def.summary,
      beatHint: def.beatHint,
      suggestedScene: rng.pick(def.suggestedScenes)
    };
  }

  const baseMysteryTwist = gameState.mystery ? gameState.mystery.twist : null;
  const pool = [];

  // Weight twist options based on investigation outcome and base twist
  if (!didAccuseCorrectly) {
    // Wrong accusation: more likely to get a sharp reversal
    pool.push(
      RESURRECTION_TWISTS.COMPANION_BETRAYAL,
      RESURRECTION_TWISTS.COMPANION_BETRAYAL,
      RESURRECTION_TWISTS.MISTAKEN_IDENTITY,
      RESURRECTION_TWISTS.DIVINE_PAWN
    );
  } else {
    // Correct accusation: often a thematic or moral twist
    pool.push(
      RESURRECTION_TWISTS.NECESSARY_SACRIFICE,
      RESURRECTION_TWISTS.SELF_DEFENSE,
      RESURRECTION_TWISTS.DIVINE_PAWN,
      RESURRECTION_TWISTS.NONE
    );
  }

  // Nudge based on mystery.twist, if present
  if (baseMysteryTwist === "ritual-sacrifice") {
    pool.push(RESURRECTION_TWISTS.NECESSARY_SACRIFICE, RESURRECTION_TWISTS.NECESSARY_SACRIFICE);
  } else if (baseMysteryTwist === "jealous-rage") {
    pool.push(RESURRECTION_TWISTS.SELF_DEFENSE);
  } else if (baseMysteryTwist === "accidental-godslaying") {
    pool.push(RESURRECTION_TWISTS.DIVINE_PAWN, RESURRECTION_TWISTS.MISTAKEN_IDENTITY);
  } else if (baseMysteryTwist === "cosmic-conspiracy") {
    pool.push(RESURRECTION_TWISTS.DIVINE_PAWN, RESURRECTION_TWISTS.DIVINE_PAWN);
  }

  const chosenType = rng.pick(pool.length ? pool : Object.values(RESURRECTION_TWISTS));
  const def = TWIST_DEFINITIONS[chosenType] || TWIST_DEFINITIONS[RESURRECTION_TWISTS.NONE];

  // Persist twist type for later reference / epilogue integration
  gameState.narrative.flags["resurrectionTwistType"] = chosenType;

  return {
    type: chosenType,
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