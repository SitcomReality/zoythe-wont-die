import { LOOP_PHASES } from "../../../config/constants.js";
import { generateInterregnumEffect } from "../../../systems/interregnum-effects.js";
import { generateBeatContent } from "../../engine/llm-service.js";

export function registerRoadOfTestsBeat({ beatOrchestrator, gameState, rng }) {
  const firstTrialId = "heroJourney:tests:firstTrial";
  const urgentTrialId = "heroJourney:tests:urgentTrial";
  const cursedTrialId = "heroJourney:tests:cursedTrial";

  // First Trial
  const firstTrial = {
    id: firstTrialId,
    async enter({ gameState, rng }) {
      const effect = generateInterregnumEffect({ rng, severity: 1 });
      gameState.world.addEffect(effect);

      const instructions = `
        This is an early Road of Tests beat: "Trial of the Dying Heavens".
        The environment is shaped by this Interregnum effect: "${effect.name}" described as: "${effect.description}".
        The protagonist must choose a way through: direct/bold, cautious, or sacrificial.
        Provide 2-3 choices that roughly map to: bold/direct advance, cautious/clever approach, or sacrificial/merciful option.
      `;

      const content = await generateBeatContent({
        gameState,
        instructions,
        beatId: firstTrialId
      });

      const choices = content.choices.map(c => ({
        ...c,
        id: `${firstTrialId}:${c.id}`
      }));

      return {
        phase: LOOP_PHASES.ASCENT,
        text: { title: content.title, body: content.body },
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
    async enter({ gameState, rng }) {
      const effect = generateInterregnumEffect({ rng, severity: 2 });
      gameState.world.addEffect(effect);

      const instructions = `
        This is an urgent Road of Tests beat triggered by divine railroading: "Crisis Accelerates".
        Interregnum effect in play: "${effect.name}" – "${effect.description}".
        Home's threat has escalated; emphasize time pressure and the cost of delay.
        Provide 2-3 choices that feel desperate vs strategic vs perhaps self-sacrificing.
      `;

      const content = await generateBeatContent({
        gameState,
        instructions,
        beatId: urgentTrialId
      });

      const choices = content.choices.map(c => ({
        ...c,
        id: `${urgentTrialId}:${c.id}`
      }));

      return {
        phase: LOOP_PHASES.ASCENT,
        text: { title: content.title, body: content.body },
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
    async enter({ gameState, rng }) {
      const effect = generateInterregnumEffect({ rng, severity: 2 });
      gameState.world.addEffect(effect);

      const instructions = `
        This is a cursed Road of Tests beat: "Divine Judgment".
        It is triggered when the gods notice betrayal.
        Interregnum effect in play: "${effect.name}" – "${effect.description}".
        Emphasize curse, guilt, and the possibility of atonement or defiance.
        Provide 2-3 choices including some form of atonement/mercy versus enduring/defiant advance.
      `;

      const content = await generateBeatContent({
        gameState,
        instructions,
        beatId: cursedTrialId
      });

      const choices = content.choices.map(c => ({
        ...c,
        id: `${cursedTrialId}:${c.id}`
      }));

      return {
        phase: LOOP_PHASES.ASCENT,
        text: { title: content.title, body: content.body },
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

