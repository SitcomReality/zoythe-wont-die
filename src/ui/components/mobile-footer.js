export function createMobileFooter({ root, onHistoryToggle, onDossierToggle, eventBus }) {
  root.innerHTML = "";

  const footer = document.createElement("div");
  footer.className = "mobile-footer";

  const historyBtn = document.createElement("button");
  historyBtn.className = "mobile-footer__btn";
  historyBtn.innerHTML = "📖 History";
  
  const dossierBtn = document.createElement("button");
  dossierBtn.className = "mobile-footer__btn";
  dossierBtn.innerHTML = "📁 Dossier";

  const menuBtn = document.createElement("button");
  menuBtn.className = "mobile-footer__btn";
  menuBtn.innerHTML = "≡ Menu";

  historyBtn.addEventListener("click", () => {
    onHistoryToggle();
  });

  dossierBtn.addEventListener("click", () => {
    onDossierToggle();
  });

  menuBtn.addEventListener("click", () => {
    if (eventBus) eventBus.emit("ui:menu:open");
  });

  footer.appendChild(historyBtn);
  footer.appendChild(dossierBtn);
  footer.appendChild(menuBtn);
  root.appendChild(footer);

  return { footer };
}

