import { createTextPanel } from "./components/text-panel.js";
import { createChoiceList } from "./components/choice-list.js";
import { createStatusBar } from "./components/status-bar.js";

export function mountLayout({ statusRoot, textRoot, choicesRoot, eventBus, gameState }) {
  const textPanel = createTextPanel({ root: textRoot });
  const choiceList = createChoiceList({ root: choicesRoot, eventBus });
  const statusBar = createStatusBar({ root: statusRoot, gameState });

  function renderText({ title, body }) {
    textPanel.render({ title, body });
  }

  function renderChoices({ choices }) {
    choiceList.render({ choices });
  }

  function renderStatus(payload) {
    statusBar.render(payload);
  }

  // initial blank state
  renderText({ title: "", body: "" });
  renderChoices({ choices: [] });
  renderStatus({});

  return {
    renderText,
    renderChoices,
    renderStatus
  };
}