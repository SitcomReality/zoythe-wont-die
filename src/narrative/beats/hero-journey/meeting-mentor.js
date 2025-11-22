import { LOOP_PHASES, NPC_ROLES, CHOICE_CLASSIFICATIONS } from "../../../config/constants.js";
import { getNPCsByRole } from "../../../systems/npc-manager.js";
import { enhanceMentorNPC } from "../../../systems/mentor-generator.js";
import { generateBeatContent } from "../../engine/llm-service.js";
import meetingMentorPrompt from "../../../prompts/hero/meetingMentor.js";

export function registerMeetingMentorBeat({ beatOrchestrator, gameState }) {
  const id = "heroJourney:intro:meetingMentor";

  const beat = {
    id,
    async enter({ gameState, beatRepeatCount, previousPage, previousChoice }) {
      const mentors = getNPCsByRole(gameState.npcRoster, NPC_ROLES.MENTOR);
      let mentor = mentors.length > 0 ? Array.from(mentors.values())[0] : null;

      // Ensure mentor exists and has enhanced profile
      if (mentor) {
        if (!mentor.met) {
          mentor.met = true;
          gameState.player.addRelationship(mentor);
        }
        // Phase 3: Enhance mentor with specific archetype/personality if not present
        if (!mentor.mentorType) {
          enhanceMentorNPC(mentor, gameState.rng);
        }
      }

      const mentorName = mentor ? mentor.name : "The Stranger";
      const mentorDesc = mentor ? mentor.descriptor : "a figure shrouded in mystery";
      const mentorType = mentor ? mentor.mentorType : "mysterious_stranger";
      const mentorPersonality = mentor ? mentor.personality : null;

      // Use the new dynamic prompt function
      const instructions = meetingMentorPrompt({
        mentorName,
        mentorDesc,
        mentorType,
        mentorPersonality,
        interactionStage: beatRepeatCount
      });

      const content = await generateBeatContent({ 
        gameState, 
        instructions, 
        beatId: id,
        previousPage,
        previousChoice
      });

      const choices = content.choices.map(c => ({
        ...c,
        id: `${id}:${c.id}`
      }));

      return {
        phase: LOOP_PHASES.INTRO,
        text: { title: content.title, body: content.body },
        shouldAdvance: content.shouldAdvance,
        choices
      };
    },

    applyChoice(choice, { gameState }) {
      // Heuristic to decide whether to stay or go based on choice text/id
      const text = (choice.label + " " + choice.id).toLowerCase();
      const isAdvance = text.includes("accept") || 
                        text.includes("move") || 
                        text.includes("trust") ||
                        text.includes("dismiss") ||
                        text.includes("advance") ||
                        text.includes("go ");
      
      // If player wants to investigate/question, stay in beat
      // But impose a limit (e.g. 2 rounds of questioning) so they don't get stuck forever
      if (!isAdvance && gameState.narrative.beatRepeatCount < 2) {
         // Return null to stay in current beat (orchestrator handles repeat count)
         return null; 
      }

      return "heroJourney:tests:firstTrial";
    }
  };

  beatOrchestrator.registerBeat(id, beat);
}

