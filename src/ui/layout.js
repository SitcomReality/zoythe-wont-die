import { createTextPanel } from "./components/text-panel.js";
import { createChoiceList } from "./components/choice-list.js";
import { createStatusBar } from "./components/status-bar.js";
import { createHistoryPanel } from "./components/history-panel.js";
import { createMobileFooter } from "./components/mobile-footer.js";

export function mountLayout({ statusRoot, textRoot, choicesRoot, eventBus, gameState }) {
  const textPanel = createTextPanel({ root: textRoot });
  const choiceList = createChoiceList({ root: choicesRoot, eventBus });
  const statusBar = createStatusBar({ root: statusRoot, gameState });
  
  // Determine if mobile
  const isMobile = window.innerWidth <= 768;
  
  // Create history panel (hidden by default on mobile)
  const historyContainer = document.createElement("div");
  historyContainer.id = "ui-history";
  historyContainer.className = "app-history";
  if (isMobile) {
    historyContainer.classList.add("app-history--mobile-hidden");
  }
  document.querySelector(".app-frame").insertBefore(historyContainer, document.querySelector(".app-main"));
  
  const historyPanel = createHistoryPanel({ root: historyContainer });
  
  // Create mobile footer
  let mobileFooter = null;
  if (isMobile) {
    const footerContainer = document.createElement("div");
    footerContainer.id = "ui-mobile-footer";
    document.body.appendChild(footerContainer);
    
    mobileFooter = createMobileFooter({ 
      root: footerContainer,
      onHistoryToggle() {
        historyContainer.classList.toggle("app-history--mobile-hidden");
      }
    });
  }

  function renderText({ title, body }) {
    textPanel.render({ title, body });
  }

  function renderChoices({ choices }) {
    choiceList.render({ choices });
  }

  function renderStatus(payload) {
    statusBar.render(payload);
  }

  function renderHistory({ history }) {
    historyPanel.render({ history });
  }

  // initial blank state
  renderText({ title: "", body: "" });
  renderChoices({ choices: [] });
  renderStatus({});
  renderHistory({ history: [] });

  return {
    renderText,
    renderChoices,
    renderStatus,
    renderHistory
  };
}