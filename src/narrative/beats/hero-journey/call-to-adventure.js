import { LOOP_PHASES } from "../../../config/constants.js";
import { generateBeatContent } from "../../engine/llm-service.js";

export function registerCallToAdventureBeat({ beatOrchestrator }) {
  const id = "heroJourney:intro:callToAdventure";

  const beat = {
    id,
    async enter({ gameState, terminology }) {
      const mystery = gameState.mystery;
      const weapon = mystery ? mystery.weapon.name : "an unknown weapon";

      const instructions = `
        This is the 'Call to Adventure', which is now 'The Discovery of the Corpse'.
        The protagonist stands over their own mortal body (or what remains of it).
        They see the glint of the ${terminology.weapon}: ${weapon}.
        The ${terminology.reality} around them is ${terminology.glitch}ing.
        The Call is the realization: The system of death is broken because YOU were murdered illegally (or the ${terminology.dead_god} was).
        You must solve your own ${terminology.murder_mystery} to fix the loop or escape it.
        Required Choice Types:
        - ${terminology.investigate} the body/${terminology.weapon} (Accept Quest / Investigate)
        - Deny the ${terminology.reality} / Try to flee (Refuse)
      `;

      const content = await generateBeatContent({ 
        gameState, 
        instructions, 
        beatId: id 
      });

      const choices = content.choices.map(c => ({
        ...c,
        id: `${id}:${c.id}`
      }));

      return {
        phase: LOOP_PHASES.INTRO,
        text: { title: content.title, body: content.body },
        choices
      };
    },

    applyChoice(choice, { gameState }) {
      // Transition to meeting the "Mentor" (who might be a suspect)
      return "heroJourney:intro:meetingMentor";
    }
  };

  beatOrchestrator.registerBeat(id, beat);
}