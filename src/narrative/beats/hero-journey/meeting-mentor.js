import { LOOP_PHASES, NPC_ROLES } from "../../../config/constants.js";
import { getNPCsByRole } from "../../../systems/npc-manager.js";

export function registerMeetingMentorBeat({ beatOrchestrator, gameState }) {
  const id = "heroJourney:intro:meetingMentor";

  const beat = {
    id,
    enter({ gameState }) {
      const mentors = getNPCsByRole(gameState.npcRoster, NPC_ROLES.MENTOR);
      const mentor = mentors.length > 0 ? Array.from(mentors.values())[0] : null;

      if (mentor && !mentor.met) {
        mentor.met = true;
        gameState.player.addRelationship(mentor);
      }

      const mentorName = mentor ? mentor.name : "a weathered stranger";
      const mentorDesc = mentor ? mentor.descriptor : "someone who has seen gods die";

      const title = "The Guide in the Wasteland";
      const body = `You find ${mentorName} at the edge of the blighted lands. ${mentorDesc}. They speak without looking at you: "The path you walk is older than memory. The MacGuffin you seek—${gameState.world.primaryMacGuffin.name}—lies at the heart of the Interregnum. I can show you the way, but the cost of knowledge is always paid in scars."`;

      const choices = [
        {
          id: `${id}:acceptGuidance`,
          label: "Accept their guidance.",
          hint: "Gain wisdom.",
          effects: { 
            player: { resolve: +1, devotion: +1 },
            relationship: mentor ? { npcId: mentor.id, delta: +2 } : null
          }
        },
        {
          id: `${id}:questionIntent`,
          label: "Question their intentions.",
          hint: "Remain cautious.",
          effects: { 
            player: { doubt: +1 },
            relationship: mentor ? { npcId: mentor.id, delta: -1 } : null
          }
        },
        {
          id: `${id}:refuseHelp`,
          label: "Refuse their help. Walk alone.",
          hint: "Trust no one.",
          effects: { 
            player: { ambition: +1, doubt: +1 }
          }
        }
      ];

      return {
        phase: LOOP_PHASES.INTRO,
        text: { title, body },
        choices
      };
    },

    applyChoice(choice, { gameState }) {
      const { player } = gameState;

      if (choice.effects?.player) {
        player.applyDelta(choice.effects.player);
      }

      if (choice.effects?.relationship) {
        player.updateRelationship(
          choice.effects.relationship.npcId,
          choice.effects.relationship.delta
        );
      }

      return "heroJourney:tests:firstTrial";
    }
  };

  beatOrchestrator.registerBeat(id, beat);
}