import { CHOICE_CLASSIFICATIONS } from "../config/constants.js";

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

  return Array.from(classifications);
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
    }
  }

  return delta;
}