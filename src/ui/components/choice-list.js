export function createChoiceList({ root, eventBus }) {
  root.innerHTML = "";

  const container = document.createElement("div");
  container.style.display = "flex";
  container.style.flexDirection = "column";
  container.style.gap = "12px";

  root.appendChild(container);

  function render({ choices }) {
    container.innerHTML = "";
    if (!choices || !choices.length) return;

    for (const choice of choices) {
      const btn = document.createElement("button");
      btn.textContent = choice.label;
      btn.style.width = "100%";
      btn.style.padding = "18px 24px";
      btn.style.borderRadius = "12px";
      btn.style.border = "1px solid rgba(255,255,255,0.1)";
      btn.style.background = "rgba(20, 22, 24, 0.96)";
      btn.style.color = "var(--text-main)";
      btn.style.fontSize = "1.05rem";
      btn.style.display = "flex";
      btn.style.alignItems = "center";
      btn.style.justifyContent = "space-between";
      btn.style.gap = "12px";
      btn.style.cursor = "pointer";
      btn.style.transition = "background 0.2s, border-color 0.2s, transform 0.1s";

      btn.onpointerup = () => {
        btn.style.transform = "scale(0.98)";
        setTimeout(() => eventBus.emit("ui:choice:selected", choice), 50);
      };
      
      // Hover/Active states via JS since inline styles are used
      btn.onpointerenter = () => {
        btn.style.borderColor = "rgba(230, 179, 90, 0.4)";
        btn.style.background = "rgba(30, 32, 34, 1)";
      };
      btn.onpointerleave = () => {
        btn.style.borderColor = "rgba(255,255,255,0.1)";
        btn.style.background = "rgba(20, 22, 24, 0.96)";
      };

      if (choice.hint) {
        const labelSpan = document.createElement("span");
        labelSpan.textContent = choice.label;

        const hintSpan = document.createElement("span");
        hintSpan.textContent = choice.hint;
        hintSpan.style.fontSize = "0.85rem";
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

