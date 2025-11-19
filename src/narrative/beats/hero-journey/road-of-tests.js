import { LOOP_PHASES } from "../../../config/constants.js";
import { generateInterregnumEffect } from "../../../systems/interregnum-effects.js";

export function registerRoadOfTestsBeat({ beatOrchestrator, gameState, rng }) {
  const firstTrialId = "heroJourney:tests:firstTrial";
  const urgentTrialId = "heroJourney:tests:urgentTrial";
  const cursedTrialId = "heroJourney:tests:cursedTrial";

  // First Trial
  const firstTrial = {
    id: firstTrialId,
    enter({ gameState, rng }) {
      const effect = generateInterregnumEffect({ rng, severity: 1 });
      gameState.world.addEffect(effect);

      const title = "Trial of the Dying Heavens";
      const body = `The path forward splits before a divine wound in reality. ${effect.description}. To reach the MacGuffin, you must pass through this chaos. You see three paths: a direct charge through the center, a careful route along the edge, or a hidden passage that demands sacrifice.`;

      const choices = [
        {
          id: `${firstTrialId}:direct`,
          label: "Charge through the center.",
          hint: "Bold.",
          classification: ["direct", "fight"],
          effects: { player: { ambition: 2, resolve: 1 } }
        },
        {
          id: `${firstTrialId}:cautious`,
          label: "Follow the edge carefully.",
          hint: "Careful.",
          classification: ["cautious"],
          effects: { player: { resolve: 1 } }
        },
        {
          id: `${firstTrialId}:sacrifice`,
          label: "Offer blood to the hidden passage.",
          hint: "Sacrifice.",
          classification: ["sacrifice"],
          effects: { player: { devotion: 2, compassion: 1 } }
        }
      ];

      return {
        phase: LOOP_PHASES.ASCENT,
        text: { title, body },
        choices
      };
    },

    applyChoice(choice, { gameState }) {
      gameState.world.homeThreatLevel += 1;
      return "heroJourney:ordeal:heartOfInterregnum";
    }
  };

  // Urgent Trial (railroad-triggered)
  const urgentTrial = {
    id: urgentTrialId,
    enter({ gameState, rng }) {
      const effect = generateInterregnumEffect({ rng, severity: 2 });
      gameState.world.addEffect(effect);

      const title = "Crisis Accelerates";
      const body = `Time fractures. ${effect.description}. News reaches you: home is worse than you feared. The ${gameState.world.homeThreat.name} escalates. You must move faster, risk more, or everything you love will be ash.`;

      const choices = [
        {
          id: `${urgentTrialId}:desperate`,
          label: "Sprint through danger. No time for caution.",
          hint: "Desperate.",
          classification: ["direct", "fight"],
          effects: { player: { ambition: 2, resolve: 2, doubt: 1 }, world: { homeThreatLevel: 1 } }
        },
        {
          id: `${urgentTrialId}:strategic`,
          label: "Find a shortcut. Think clearly.",
          hint: "Clever.",
          classification: ["clever"],
          effects: { player: { resolve: 2 } }
        }
      ];

      return {
        phase: LOOP_PHASES.ASCENT,
        text: { title, body },
        choices
      };
    },

    applyChoice(choice, { gameState }) {
      return "heroJourney:ordeal:heartOfInterregnum";
    }
  };

  // Cursed Trial (railroad-triggered for betrayals)
  const cursedTrial = {
    id: cursedTrialId,
    enter({ gameState, rng }) {
      const effect = generateInterregnumEffect({ rng, severity: 2 });
      gameState.world.addEffect(effect);

      const title = "Divine Judgment";
      const body = `The gods notice betrayal. ${effect.description}. A curse settles on your shoulders—punishment for broken oaths and abandoned allies. You must atone, or the curse will follow you to the end.`;

      const choices = [
        {
          id: `${cursedTrialId}:atone`,
          label: "Seek atonement. Make amends.",
          hint: "Redemptive.",
          classification: ["mercy", "sacrifice"],
          effects: { player: { devotion: 2, compassion: 2, doubt: -1 } }
        },
        {
          id: `${cursedTrialId}:endure`,
          label: "Endure the curse. Press on.",
          hint: "Defiant.",
          classification: ["direct"],
          effects: { player: { resolve: 2, ambition: 1 } }
        }
      ];

      return {
        phase: LOOP_PHASES.ASCENT,
        text: { title, body },
        choices
      };
    },

    applyChoice(choice, { gameState }) {
      return "heroJourney:ordeal:heartOfInterregnum";
    }
  };

  beatOrchestrator.registerBeat(firstTrialId, firstTrial);
  beatOrchestrator.registerBeat(urgentTrialId, urgentTrial);
  beatOrchestrator.registerBeat(cursedTrialId, cursedTrial);
}