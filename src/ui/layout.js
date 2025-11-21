import { createTextPanel } from "./components/text-panel.js";
import { createChoiceList } from "./components/choice-list.js";
import { createStatusBar } from "./components/status-bar.js";
import { createHistoryPanel } from "./components/history-panel.js";
import { createDossierPanel } from "./components/dossier-panel.js";
import { createActionInput } from "./components/action-input.js";
import { createMobileFooter } from "./components/mobile-footer.js";
import { createMainMenu } from "./components/main-menu.js";
import { createNewGameScreen } from "./components/new-game-screen.js";

export function mountLayout({ rootSelector = "#app-root", eventBus }) {
  const root = document.querySelector(rootSelector);
  const frame = root.querySelector(".app-frame");
  
  // 1. Left Column: History
  const historyContainer = document.createElement("div");
  historyContainer.className = "app-history";
  frame.innerHTML = ""; // Clear existing scaffold
  frame.appendChild(historyContainer);

  // 2. Center Column: Main
  const mainArea = document.createElement("div");
  mainArea.className = "app-main";
  frame.appendChild(mainArea);

  // 3. Right Column: Dossier
  const dossierContainer = document.createElement("div");
  dossierContainer.className = "app-dossier";
  frame.appendChild(dossierContainer);

  // --- Main Area Sub-Containers ---
  const gameContainer = document.createElement("div");
  gameContainer.className = "layout-game-container";
  gameContainer.style.display = "flex";
  gameContainer.style.flexDirection = "column";
  gameContainer.style.height = "100%";
  gameContainer.style.gap = "16px";

  const menuContainer = document.createElement("div");
  menuContainer.className = "layout-menu-container";
  menuContainer.style.display = "none";
  
  mainArea.appendChild(gameContainer);
  mainArea.appendChild(menuContainer);

  // Game Structure
  const statusRoot = document.createElement("div");
  statusRoot.className = "app-status";
  
  const textRoot = document.createElement("div");
  textRoot.className = "app-text";
  
  const inputAreaRoot = document.createElement("div");
  inputAreaRoot.className = "app-input-area";

  const choicesRoot = document.createElement("div");
  choicesRoot.className = "app-choices";

  const inputRoot = document.createElement("div");
  inputRoot.className = "app-input";

  inputAreaRoot.appendChild(choicesRoot);
  inputAreaRoot.appendChild(inputRoot);

  gameContainer.appendChild(statusRoot);
  gameContainer.appendChild(textRoot);
  gameContainer.appendChild(inputAreaRoot);

  // --- Component Initialization ---
  const textPanel = createTextPanel({ root: textRoot, eventBus });
  const choiceList = createChoiceList({ root: choicesRoot, eventBus });
  const actionInput = createActionInput({ root: inputRoot, eventBus });
  const historyPanel = createHistoryPanel({ root: historyContainer });
  const dossierPanel = createDossierPanel({ root: dossierContainer, eventBus });
  
  let statusBar = null;

  // --- Mobile Handling ---
  const isMobile = window.innerWidth <= 768;
  
  // Initialize hidden states for mobile overlays
  if (isMobile) {
    historyContainer.classList.add("app-history--mobile-hidden");
    dossierContainer.classList.add("app-dossier--mobile-hidden");
    
    const footerContainer = document.createElement("div");
    document.body.appendChild(footerContainer);
    
    createMobileFooter({ 
      root: footerContainer,
      onHistoryToggle: () => {
        historyContainer.classList.toggle("app-history--mobile-hidden");
        dossierContainer.classList.add("app-dossier--mobile-hidden"); // Close other
      },
      onDossierToggle: () => {
        dossierContainer.classList.toggle("app-dossier--mobile-hidden");
        historyContainer.classList.add("app-history--mobile-hidden"); // Close other
      }
    });
  } else {
    // On Desktop, hide history initially if menu is shown?
    // The showGame/showMenu functions handle display properties of containers
  }

  // --- View Switchers ---

  function showMainMenu({ onContinue, onNewGame, onHistory, hasSave }) {
    gameContainer.style.display = "none";
    menuContainer.style.display = "block";
    historyContainer.style.display = "none"; 
    dossierContainer.style.display = "none";
    
    createMainMenu({ root: menuContainer, onContinue, onNewGame, onHistory, hasSave });
  }

  function showNewGame({ onStart, onCancel }) {
    gameContainer.style.display = "none";
    menuContainer.style.display = "block";
    // Keep sidebars hidden
    historyContainer.style.display = "none"; 
    dossierContainer.style.display = "none";
    
    createNewGameScreen({ root: menuContainer, onStart, onCancel });
  }

  function showGame(gameState) {
    menuContainer.style.display = "none";
    gameContainer.style.display = "flex";
    
    // Restore sidebar visibility for desktop
    if (!isMobile) {
      historyContainer.style.display = "flex";
      dossierContainer.style.display = "flex";
    }
    
    statusBar = createStatusBar({ root: statusRoot, gameState });
    statusBar.render();
    
    // Initial render of dossier
    if (gameState.mystery) {
      dossierPanel.update({ mystery: gameState.mystery });
    }
  }

  // --- Event Linking ---
  eventBus.on("narrative:loading", () => {
    textPanel.setLoading();
    choiceList.hide();
    actionInput.setDisabled(true);
  });

  function renderText(payload) { textPanel.render(payload); }
  function renderChoices(payload) { 
    choiceList.render(payload); 
    actionInput.setDisabled(false); // Re-enable input when choices appear
  }
  function renderStatus(payload) { if(statusBar) statusBar.render(payload); }
  function renderHistory(payload) { historyPanel.render(payload); }
  function renderDossier(payload) { if(payload.mystery) dossierPanel.update(payload); }
  function renderLoading() { textPanel.setLoading(); }

  return {
    showMainMenu,
    showNewGame,
    showGame,
    renderText,
    renderChoices,
    renderStatus,
    renderHistory,
    renderDossier,
    renderLoading
  };
}