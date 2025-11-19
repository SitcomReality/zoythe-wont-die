import { LOOP_PHASES } from "../../../config/constants.js";
import { generateBeatContent } from "../../engine/llm-service.js";

export function registerCallToAdventureBeat({ beatOrchestrator }) {
  const id = "heroJourney:intro:callToAdventure";

  const beat = {
    id,
    async enter({ gameState }) {
      const instructions = `
        This is the 'Call to Adventure'. 
        The protagonist is at their home/shelter.
        A divine sign (falling star, bleeding moon, etc) signals the beginning of the end.
        The Call must be introduced.
        Required Choice Types: 
        - Accept/Advance (starts quest)
        - Refuse (hesitation)
      `;

      // Generate content via LLM
      const content = await generateBeatContent({ 
        gameState, 
        instructions, 
        beatId: id 
      });

      // Post-process choices to match ID schema if needed, 
      // but we'll trust the Orchestrator's generic handling mostly.
      // We just ensure IDs are unique enough.
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
      // Regardless of choice (Accept/Refuse), the mentor appears next,
      // though refusals might trigger rails later.
      return "heroJourney:intro:meetingMentor";
    }
  };

  beatOrchestrator.registerBeat(id, beat);
}