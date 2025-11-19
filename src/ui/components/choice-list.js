export function createChoiceList({ root, eventBus }) {
  root.innerHTML = "";

  const container = document.createElement("div");
  container.style.display = "flex";
  container.style.flexDirection = "column";
  container.style.gap = "6px";

  root.appendChild(container);

  function render({ choices }) {
    container.innerHTML = "";
    if (!choices || !choices.length) return;

    for (const choice of choices) {
      const btn = document.createElement("button");
      btn.textContent = choice.label;
      btn.style.width = "100%";
      btn.style.padding = "9px 10px";
      btn.style.borderRadius = "999px";
      btn.style.border = "1px solid rgba(255,255,255,0.06)";
      btn.style.background = "rgba(11,12,13,0.96)";
      btn.style.color = "var(--text-main)";
      btn.style.fontSize = "0.82rem";
      btn.style.display = "flex";
      btn.style.alignItems = "center";
      btn.style.justifyContent = "space-between";
      btn.style.gap = "6px";

      btn.onpointerup = () => {
        eventBus.emit("ui:choice:selected", choice);
      };

      if (choice.hint) {
        const labelSpan = document.createElement("span");
        labelSpan.textContent = choice.label;

        const hintSpan = document.createElement("span");
        hintSpan.textContent = choice.hint;
        hintSpan.style.fontSize = "0.7rem";
        hintSpan.style.color = "var(--text-muted)";

        btn.textContent = "";
        btn.appendChild(labelSpan);
        btn.appendChild(hintSpan);
      }

      container.appendChild(btn);
    }
  }

  return { render };
}

