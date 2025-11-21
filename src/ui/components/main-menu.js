export function createMainMenu({ root, onContinue, onNewGame, onHistory, hasSave }) {
  root.innerHTML = "";
  
  const container = document.createElement("div");
  container.className = "menu-screen";
  
  const title = document.createElement("h1");
  title.className = "menu-screen__title";
  title.textContent = "Zoythe Won't Die";
  
  // Insert small intervening text "in the"
  const inBetween = document.createElement("div");
  inBetween.className = "menu-screen__in-between";
  inBetween.textContent = "in the";
  inBetween.style.fontSize = "0.9rem";
  inBetween.style.color = "var(--text-muted)";
  inBetween.style.margin = "6px 0";
  inBetween.style.letterSpacing = "0.12em";
  inBetween.style.textTransform = "lowercase";
  
  const subtitle = document.createElement("p");
  subtitle.className = "menu-screen__subtitle";
  subtitle.textContent = "Supernal Interregnum";
  // Make the final line slightly larger and bolder
  subtitle.style.fontSize = "1.15rem";
  subtitle.style.fontWeight = "700";
  subtitle.style.marginTop = "0";
  
  const actions = document.createElement("div");
  actions.className = "menu-screen__actions";
  
  const continueBtn = document.createElement("button");
  continueBtn.className = "menu-btn menu-btn--primary";
  continueBtn.textContent = "Continue Story";
  continueBtn.disabled = !hasSave;
  continueBtn.onclick = onContinue;
  
  const newGameBtn = document.createElement("button");
  newGameBtn.className = "menu-btn";
  newGameBtn.textContent = "New Game";
  newGameBtn.onclick = onNewGame;
  
  const historyBtn = document.createElement("button");
  historyBtn.className = "menu-btn";
  historyBtn.textContent = "Previous Adventures";
  historyBtn.onclick = onHistory;
  
  const footer = document.createElement("div");
  footer.className = "menu-screen__footer";
  footer.textContent = "v0.2.0 - Pre-Alpha Build";
  
  actions.appendChild(continueBtn);
  actions.appendChild(newGameBtn);
  actions.appendChild(historyBtn);
  
  container.appendChild(title);
  container.appendChild(inBetween);
  container.appendChild(subtitle);
  container.appendChild(actions);
  container.appendChild(footer);
  
  root.appendChild(container);
  
  return {};
}

