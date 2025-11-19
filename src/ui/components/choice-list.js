export function createChoiceList({ root, eventBus }) {
  root.innerHTML = "";

  const container = document.createElement("div");
  container.className = "choice-list";

  root.appendChild(container);

  function render({ choices }) {
    container.innerHTML = "";
    if (!choices || !choices.length) return;

    for (const choice of choices) {
      const btn = document.createElement("button");
      btn.className = "choice-list__button";

      const labelSpan = document.createElement("span");
      labelSpan.className = "choice-list__label";
      labelSpan.textContent = choice.label;

      btn.appendChild(labelSpan);

      if (choice.hint) {
        const hintSpan = document.createElement("span");
        hintSpan.className = "choice-list__hint";
        hintSpan.textContent = choice.hint;
        btn.appendChild(hintSpan);
      }

      btn.addEventListener("click", () => {
        eventBus.emit("ui:choice:selected", choice);
      });

      container.appendChild(btn);
    }
  }

  return { render };
}

