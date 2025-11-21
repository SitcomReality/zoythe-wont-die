export function createHistoryPanel({ root }) {
  root.innerHTML = "";

  const container = document.createElement("div");
  container.className = "history-panel";

  const header = document.createElement("div");
  header.className = "history-panel__header";
  header.textContent = "Story History";

  const list = document.createElement("div");
  list.className = "history-panel__list";

  container.appendChild(header);
  container.appendChild(list);
  root.appendChild(container);

  function render({ history, choiceHistory = [] }) {
    list.innerHTML = "";
    if (!history || !history.length) return;

    for (const [idx, entry] of history.entries()) {
      const item = document.createElement("div");
      item.className = "history-panel__item";

      const summary = document.createElement("button");
      summary.className = "history-panel__summary";
      
      const titleEl = document.createElement("div");
      titleEl.className = "history-panel__entry-title";
      titleEl.textContent = entry.title || `Page ${idx + 1}`;

      const previewEl = document.createElement("div");
      previewEl.className = "history-panel__entry-preview";
      const preview = entry.body ? entry.body.split('\n')[0].substring(0, 60) : '';
      previewEl.textContent = preview + (preview.length === 60 ? '...' : '');

      summary.appendChild(titleEl);
      summary.appendChild(previewEl);

      const detail = document.createElement("div");
      detail.className = "history-panel__detail";
      detail.style.display = "none";

      const bodyEl = document.createElement("div");
      bodyEl.className = "history-panel__entry-body";
      bodyEl.textContent = entry.body || '';

      detail.appendChild(bodyEl);

      let expanded = false;
      summary.addEventListener("click", () => {
        expanded = !expanded;
        detail.style.display = expanded ? "block" : "none";
        item.classList.toggle("history-panel__item--expanded", expanded);
      });

      item.appendChild(summary);
      item.appendChild(detail);
      list.appendChild(item);

      // Insert the choice the player submitted to reach the next page (if any)
      // We expect choiceHistory entries to include .beatIndex which corresponds to the beat index at time of choice.
      // The choice that led to this page will have been recorded at the previous beatIndex.
      // For page at index `idx`, the triggering choice's beatIndex is `idx - 1`.
      const submitted = choiceHistory
        .slice() // copy
        .reverse()
        .find(c => c.beatIndex === (idx - 1));
      
      const choiceContainer = document.createElement("div");
      choiceContainer.className = "history-panel__choice-row";

      if (submitted && submitted.choice) {
        const choiceBtn = document.createElement("button");
        choiceBtn.className = "history-panel__choice-summary";
        // Show single-line trimmed preview; full text in expanded area
        const choiceLabel = typeof submitted.choice.label === "string" ? submitted.choice.label : (submitted.choice || {}).label || "";
        choiceBtn.textContent = choiceLabel.length > 80 ? choiceLabel.substring(0, 77) + "..." : choiceLabel;

        // When clicked, toggle a tiny popup/expand to show full choice
        const full = document.createElement("div");
        full.className = "history-panel__choice-full";
        full.style.display = "none";
        full.textContent = choiceLabel;

        choiceBtn.addEventListener("click", () => {
          const visible = full.style.display === "block";
          full.style.display = visible ? "none" : "block";
        });

        choiceContainer.appendChild(choiceBtn);
        choiceContainer.appendChild(full);
      } else {
        // If no choice recorded, show a muted placeholder for continuity
        const placeholder = document.createElement("div");
        placeholder.className = "history-panel__choice-placeholder";
        placeholder.textContent = "—";
        choiceContainer.appendChild(placeholder);
      }

      list.appendChild(choiceContainer);
    }
  }

  return { render };
}

