import { LOOP_PHASES } from "../../../config/constants.js";
import { generateBeatContent } from "../../engine/llm-service.js";
import callToAdventurePrompt from "../../../prompts/hero/callToAdventure.js";

export function registerCallToAdventureBeat({ beatOrchestrator }) {
  const id = "heroJourney:intro:callToAdventure";

  const beat = {
    id,
    async enter({ gameState, terminology }) {
      const mystery = gameState.mystery;
      const weapon = mystery ? mystery.weapon.name : "an unknown weapon";

      // Substitute in the weapon where prompt expects it
      const instructions = callToAdventurePrompt.replace("${weapon}", weapon);

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