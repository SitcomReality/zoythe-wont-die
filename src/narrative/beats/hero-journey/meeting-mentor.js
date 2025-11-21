import { LOOP_PHASES, NPC_ROLES } from "../../../config/constants.js";
import { getNPCsByRole } from "../../../systems/npc-manager.js";
import { generateBeatContent } from "../../engine/llm-service.js";
import meetingMentorPrompt from "../../prompts/hero/meetingMentor.js";

export function registerMeetingMentorBeat({ beatOrchestrator, gameState }) {
  const id = "heroJourney:intro:meetingMentor";

  const beat = {
    id,
    async enter({ gameState }) {
      const mentors = getNPCsByRole(gameState.npcRoster, NPC_ROLES.MENTOR);
      const mentor = mentors.length > 0 ? Array.from(mentors.values())[0] : null;

      if (mentor && !mentor.met) {
        mentor.met = true;
        gameState.player.addRelationship(mentor);
      }

      const mentorName = mentor ? mentor.name : "a stranger";
      const mentorDesc = mentor ? mentor.descriptor : "mysterious figure";

      // Insert dynamic values into prompt
      const instructions = meetingMentorPrompt
        .replace(/\${mentorName}/g, mentorName)
        .replace(/\${mentorDesc}/g, mentorDesc)
        .replace(/\${macGuffinName}/g, gameState.world.primaryMacGuffin?.name || "MacGuffin");

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
      // Transition to tests
      return "heroJourney:tests:firstTrial";
    }
  };

  beatOrchestrator.registerBeat(id, beat);
}