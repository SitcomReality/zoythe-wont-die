export function createMobileFooter({ root, onHistoryToggle }) {
  root.innerHTML = "";

  const footer = document.createElement("div");
  footer.className = "mobile-footer";

  const historyBtn = document.createElement("button");
  historyBtn.className = "mobile-footer__btn";
  historyBtn.setAttribute("aria-label", "Toggle story history");
  historyBtn.innerHTML = "📖 History";

  historyBtn.addEventListener("click", () => {
    onHistoryToggle();
  });

  footer.appendChild(historyBtn);
  root.appendChild(footer);

  return { footer };
}

