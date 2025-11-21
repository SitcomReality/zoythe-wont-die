export function createMobileFooter({ root, onHistoryToggle, onDossierToggle }) {
  root.innerHTML = "";

  const footer = document.createElement("div");
  footer.className = "mobile-footer";

  const historyBtn = document.createElement("button");
  historyBtn.className = "mobile-footer__btn";
  historyBtn.innerHTML = "📖 History";
  
  const dossierBtn = document.createElement("button");
  dossierBtn.className = "mobile-footer__btn";
  dossierBtn.innerHTML = "📁 Dossier";

  historyBtn.addEventListener("click", () => {
    onHistoryToggle();
  });

  dossierBtn.addEventListener("click", () => {
    onDossierToggle();
  });

  footer.appendChild(historyBtn);
  footer.appendChild(dossierBtn);
  root.appendChild(footer);

  return { footer };
}

