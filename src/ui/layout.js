import { createTextPanel } from "./components/text-panel.js";
import { createChoiceList } from "./components/choice-list.js";
import { createStatusBar } from "./components/status-bar.js";
import { createHistoryPanel } from "./components/history-panel.js";
import { createMobileFooter } from "./components/mobile-footer.js";
import { createMainMenu } from "./components/main-menu.js";
import { createNewGameScreen } from "./components/new-game-screen.js";

export function mountLayout({ rootSelector = "#app-root", eventBus }) {
  const root = document.querySelector(rootSelector);
  const frame = root.querySelector(".app-frame");
  const mainArea = frame.querySelector(".app-main");
  
  // Ensure basic structure exists in mainArea for gameplay
  // We'll toggle visibility of these vs menu containers
  
  // Containers
  const gameContainer = document.createElement("div");
  gameContainer.className = "layout-game-container";
  gameContainer.style.display = "none";
  gameContainer.style.height = "100%";
  gameContainer.style.display = "flex";
  gameContainer.style.flexDirection = "column";
  gameContainer.style.gap = "16px";

  const menuContainer = document.createElement("div");
  menuContainer.className = "layout-menu-container";
  menuContainer.style.display = "none";
  menuContainer.style.height = "100%";
  menuContainer.style.overflowY = "auto";
  
  // Setup Game Container Structure
  const statusRoot = document.createElement("div");
  statusRoot.className = "app-status";
  const textRoot = document.createElement("div");
  textRoot.className = "app-text";
  const choicesRoot = document.createElement("div");
  choicesRoot.className = "app-choices";
  
  gameContainer.appendChild(statusRoot);
  gameContainer.appendChild(textRoot);
  gameContainer.appendChild(choicesRoot);
  
  // Clear main area and append our high-level containers
  mainArea.innerHTML = "";
  mainArea.appendChild(gameContainer);
  mainArea.appendChild(menuContainer);

  // Components
  const textPanel = createTextPanel({ root: textRoot, eventBus });
  const choiceList = createChoiceList({ root: choicesRoot, eventBus });
  // StatusBar requires gameState, but we might not have it yet. 
  // We'll init it properly when game starts or mock it.
  let statusBar = null; 
  
  // Mobile & History setup
  const isMobile = window.innerWidth <= 768;
  const historyContainer = document.createElement("div");
  historyContainer.className = "app-history";
  if (isMobile) historyContainer.classList.add("app-history--mobile-hidden");
  frame.insertBefore(historyContainer, mainArea);
  const historyPanel = createHistoryPanel({ root: historyContainer });
  
  if (isMobile) {
    const footerContainer = document.createElement("div");
    document.body.appendChild(footerContainer);
    createMobileFooter({ 
      root: footerContainer,
      onHistoryToggle: () => historyContainer.classList.toggle("app-history--mobile-hidden")
    });
  }

  // View Switcher
  function showMainMenu({ onContinue, onNewGame, onHistory, hasSave }) {
    gameContainer.style.display = "none";
    menuContainer.style.display = "block";
    historyContainer.style.display = "none"; // Hide history in menu
    createMainMenu({ root: menuContainer, onContinue, onNewGame, onHistory, hasSave });
  }

  function showNewGame({ onStart, onCancel }) {
    gameContainer.style.display = "none";
    menuContainer.style.display = "block";
    historyContainer.style.display = "none";
    createNewGameScreen({ root: menuContainer, onStart, onCancel });
  }

  function showGame(gameState) {
    menuContainer.style.display = "none";
    gameContainer.style.display = "flex";
    historyContainer.style.display = isMobile ? "none" : "flex"; // Restore history visibility rules
    
    // Re-init status bar with active state
    statusBar = createStatusBar({ root: statusRoot, gameState });
    statusBar.render();
  }

  // Wire up loading state
  eventBus.on("narrative:loading", () => {
    textPanel.setLoading();
    choiceList.hide();
  });

  function renderText(payload) { 
    textPanel.render(payload); 
  }
  function renderChoices(payload) { 
    choiceList.render(payload); 
  }
  function renderStatus(payload) { if(statusBar) statusBar.render(payload); }
  function renderHistory(payload) { historyPanel.render(payload); }
  function renderLoading() { textPanel.setLoading(); }

  return {
    showMainMenu,
    showNewGame,
    showGame,
    renderText,
    renderChoices,
    renderStatus,
    renderHistory,
    renderLoading
  };
}