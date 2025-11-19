export function createChoiceList({ root, eventBus, gameState }) {
  root.innerHTML = "";

  const container = document.createElement("div");
  container.style.display = "flex";
  container.style.flexDirection = "column";
  container.style.gap = "6px";

  root.appendChild(container);

  function render({ choices }) {
    container.innerHTML = "";
    if (!choices || !choices.length) return;

    // Back button (shows when there's history)
    if (gameState && Array.isArray(gameState.narrative.history) && gameState.narrative.history.length > 0) {
      const backBtn = document.createElement("button");
      backBtn.textContent = "← Back";
      backBtn.style.width = "100%";
      backBtn.style.padding = "9px 10px";
      backBtn.style.borderRadius = "999px";
      backBtn.style.border = "1px solid rgba(255,255,255,0.04)";
      backBtn.style.background = "rgba(20,20,20,0.96)";
      backBtn.style.color = "var(--text-muted)";
      backBtn.style.fontSize = "0.82rem";
      backBtn.onpointerup = () => {
        const prev = gameState.narrative.history.pop();
        if (prev) {
          eventBus.emit("narrative:runBeat", prev);
          // update status/choices will be triggered by beat orchestrator
        }
      };
      container.appendChild(backBtn);
    }

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

