import { CHOICE_CLASSIFICATIONS } from "../config/constants.js";
import { CONSEQUENCE_TYPES } from "./consequence-tracker.js";

export function classifyChoice(choice) {
  const classifications = new Set();

  // Look for explicit classification in choice object
  if (choice.classification) {
    if (Array.isArray(choice.classification)) {
      choice.classification.forEach(c => classifications.add(c));
    } else {
      classifications.add(choice.classification);
    }
  }

  // Infer from label and id
  const text = (choice.label + " " + choice.id).toLowerCase();

  if (text.includes("accept") || text.includes("embrace") || text.includes("step toward")) {
    classifications.add(CHOICE_CLASSIFICATIONS.ACCEPT_QUEST);
    classifications.add(CHOICE_CLASSIFICATIONS.ADVANCE);
  }

  if (text.includes("refuse") || text.includes("turn away") || text.includes("reject")) {
    classifications.add(CHOICE_CLASSIFICATIONS.REFUSE_QUEST);
    classifications.add(CHOICE_CLASSIFICATIONS.RETREAT);
  }

  if (text.includes("fight") || text.includes("attack") || text.includes("strike")) {
    classifications.add(CHOICE_CLASSIFICATIONS.FIGHT);
  }

  if (text.includes("flee") || text.includes("run") || text.includes("escape")) {
    classifications.add(CHOICE_CLASSIFICATIONS.FLEE);
  }

  if (text.includes("mercy") || text.includes("spare") || text.includes("forgive")) {
    classifications.add(CHOICE_CLASSIFICATIONS.MERCY);
  }

  if (text.includes("sacrifice") || text.includes("give up") || text.includes("offer yourself")) {
    classifications.add(CHOICE_CLASSIFICATIONS.SACRIFICE);
  }

  if (text.includes("betray") || text.includes("abandon")) {
    classifications.add(CHOICE_CLASSIFICATIONS.BETRAY_ALLY);
  }

  // Investigation Logic
  if (text.includes("examine") || text.includes("look at") || text.includes("search") || text.includes("investigate") || text.includes("check")) {
    classifications.add(CHOICE_CLASSIFICATIONS.INVESTIGATE);
    classifications.add(CHOICE_CLASSIFICATIONS.ANALYZE);
  }

  if (text.includes("ask") || text.includes("question") || text.includes("talk") || text.includes("interrogate") || text.includes("speak")) {
    classifications.add(CHOICE_CLASSIFICATIONS.INTERROGATE);
  }

  if (text.includes("accuse") || text.includes("blame") || text.includes("charge")) {
    classifications.add(CHOICE_CLASSIFICATIONS.ACCUSE);
  }

  return Array.from(classifications);
}

/**
 * Identify consequence potential of a choice based on classification
 * @param {string[]} classifications - Choice classifications
 * @returns {string[]} Consequence types that might apply
 */
export function identifyConsequencePotential(classifications) {
  const consequencePotential = new Set();

  for (const c of classifications) {
    switch (c) {
      case CHOICE_CLASSIFICATIONS.BETRAY_ALLY:
        consequencePotential.add(CONSEQUENCE_TYPES.RELATIONSHIP_SHIFT);
        consequencePotential.add(CONSEQUENCE_TYPES.REPUTATION_IMPACT);
        consequencePotential.add(CONSEQUENCE_TYPES.NPC_BEHAVIOR_SHIFT);
        break;
      case CHOICE_CLASSIFICATIONS.MERCY:
        consequencePotential.add(CONSEQUENCE_TYPES.RELATIONSHIP_SHIFT);
        consequencePotential.add(CONSEQUENCE_TYPES.NPC_BEHAVIOR_SHIFT);
        break;
      case CHOICE_CLASSIFICATIONS.CRUELTY:
        consequencePotential.add(CONSEQUENCE_TYPES.MORAL_CORRUPTION);
        consequencePotential.add(CONSEQUENCE_TYPES.REPUTATION_IMPACT);
        break;
      case CHOICE_CLASSIFICATIONS.INVESTIGATE:
        consequencePotential.add(CONSEQUENCE_TYPES.INVESTIGATION_REVEAL);
        consequencePotential.add(CONSEQUENCE_TYPES.CLUE_GENERATION);
        break;
      case CHOICE_CLASSIFICATIONS.INTERROGATE:
        consequencePotential.add(CONSEQUENCE_TYPES.INVESTIGATION_REVEAL);
        consequencePotential.add(CONSEQUENCE_TYPES.NPC_BEHAVIOR_SHIFT);
        break;
      case CHOICE_CLASSIFICATIONS.ACCUSE:
        consequencePotential.add(CONSEQUENCE_TYPES.SUSPECT_ELIMINATION);
        consequencePotential.add(CONSEQUENCE_TYPES.INVESTIGATION_BLOCK);
        break;
      case CHOICE_CLASSIFICATIONS.SACRIFICE:
        consequencePotential.add(CONSEQUENCE_TYPES.RELATIONSHIP_SHIFT);
        consequencePotential.add(CONSEQUENCE_TYPES.MORAL_CORRUPTION);
        break;
      case CHOICE_CLASSIFICATIONS.ACCEPT_QUEST:
        consequencePotential.add(CONSEQUENCE_TYPES.RELATIONSHIP_SHIFT);
        consequencePotential.add(CONSEQUENCE_TYPES.TIME_PRESSURE);
        break;
      case CHOICE_CLASSIFICATIONS.REFUSE_QUEST:
        consequencePotential.add(CONSEQUENCE_TYPES.INVESTIGATION_BLOCK);
        consequencePotential.add(CONSEQUENCE_TYPES.REPUTATION_IMPACT);
        break;
    }
  }

  return Array.from(consequencePotential);
}

export function getChoiceDelta(choice, classifications) {
  const delta = { player: {}, world: {} };

  // Apply explicit effects
  if (choice.effects) {
    Object.assign(delta, choice.effects);
  }

  // Infer effects from classifications
  for (const c of classifications) {
    switch (c) {
      case CHOICE_CLASSIFICATIONS.ACCEPT_QUEST:
        delta.player.heroism = (delta.player.heroism || 0) + 1;
        delta.player.resolve = (delta.player.resolve || 0) + 1;
        break;
      case CHOICE_CLASSIFICATIONS.REFUSE_QUEST:
        delta.player.doubt = (delta.player.doubt || 0) + 1;
        break;
      case CHOICE_CLASSIFICATIONS.MERCY:
        delta.player.compassion = (delta.player.compassion || 0) + 1;
        delta.player.heroism = (delta.player.heroism || 0) + 1;
        break;
      case CHOICE_CLASSIFICATIONS.SACRIFICE:
        delta.player.devotion = (delta.player.devotion || 0) + 2;
        delta.player.heroism = (delta.player.heroism || 0) + 2;
        break;
      case CHOICE_CLASSIFICATIONS.BETRAY_ALLY:
        delta.player.heroism = (delta.player.heroism || 0) - 2;
        delta.player.doubt = (delta.player.doubt || 0) + 1;
        break;
      case CHOICE_CLASSIFICATIONS.FIGHT:
        delta.player.ambition = (delta.player.ambition || 0) + 1;
        break;
      case CHOICE_CLASSIFICATIONS.INVESTIGATE:
      case CHOICE_CLASSIFICATIONS.ANALYZE:
        delta.player.resolve = (delta.player.resolve || 0) + 1;
        break;
      case CHOICE_CLASSIFICATIONS.INTERROGATE:
        delta.player.doubt = (delta.player.doubt || 0) + 1; // Questioning leads to doubt
        break;
      case CHOICE_CLASSIFICATIONS.ACCUSE:
        delta.player.ambition = (delta.player.ambition || 0) + 2;
        delta.player.heroism = (delta.player.heroism || 0) + 1;
        break;
    }
  }

  return delta;
}