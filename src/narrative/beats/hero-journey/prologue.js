import { LOOP_PHASES } from "../../../config/constants.js";
import { generateBeatContent } from "../../engine/llm-service.js";

export function registerPrologueBeat({ beatOrchestrator, gameState }) {
  const id = "heroJourney:intro:prologue";

  const beat = {
    id,
    async enter({ gameState, terminology, previousPage, previousChoice }) {
      let stage = gameState.narrative.flags["prologueStage"] || 0;
      let instructions = "";
      let choiceLabel = "";

      if (stage === 0) {
        instructions = `
Phase: AWARENESS.
The protagonist has just died. They are lying in darkness.
They cannot see yet. They feel the sensation of the soul ${terminology.fragmenting_soul || "unraveling"} but hitting a hard floor instead of oblivion.
The sensation is ${terminology.existence_distress || "wrong"}.
Establish the central mystery immediately: "You are dead. But you are still here. And you don't remember who killed you."
Action: The ONLY available action is to open eyes.
`;
        choiceLabel = "Open your eyes.";
      } else if (stage === 1) {
        instructions = `
Phase: VISION.
The eyes open. The world is ${terminology.colorless_world || "grey"} and filled with ${terminology.glitch || "glitches"}.
Describe the immediate environment (the floor, the sky, the silence).
The protagonist is still lying down.
Action: The ONLY available action is to stand up.
`;
        choiceLabel = "Stand up.";
      } else {
        instructions = `
Phase: ORIENTATION.
The protagonist is standing in the ${terminology.afterlife || "Interregnum"}.
The ${terminology.numb_quiet || "silence"} is heavy.
The protagonist looks down at their own body/remains.
Action: Move to investigate the body (Call to Adventure).
`;
        choiceLabel = "Look at your remains.";
      }

      // Increment stage for next time (if we loop or for internal tracking)
      // Note: applying choice advances beat, but we track granular progress here
      gameState.narrative.flags["prologueStage"] = stage + 1;

      const content = await generateBeatContent({
        gameState,
        instructions,
        beatId: id,
        previousPage,
        previousChoice
      });

      // Force the specific choice for this stage of the prologue
      const choices = [{
        id: `${id}:continue`,
        label: choiceLabel,
        hint: null,
        classification: [],
        effects: {}
      }];

      return {
        phase: LOOP_PHASES.INTRO,
        text: { title: content.title, body: content.body },
        shouldAdvance: content.shouldAdvance,
        choices
      };
    },

    applyChoice(choice, { gameState }) {
      // Only advance to Call to Adventure if we've finished the standing up phase
      const stage = gameState.narrative.flags["prologueStage"];
      if (stage >= 3) {
        return "heroJourney:intro:callToAdventure";
      }
      // Otherwise loop back to prologue to process next stage
      return "heroJourney:intro:prologue";
    }
  };

  beatOrchestrator.registerBeat(id, beat);
}