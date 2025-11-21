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

      // Find the choice that was submitted after this page's timestamp and before the next page's timestamp (if any)
      const nextEntry = history[idx + 1];
      const submitted = choiceHistory.find(c => {
        const ct = c.timestamp || 0;
        const afterPage = ct > (entry.timestamp || 0);
        const beforeNext = nextEntry ? ct <= (nextEntry.timestamp || Infinity) : true;
        return afterPage && beforeNext;
      });

      // Only create and append a choice-row if a submitted choice exists for this page
      if (submitted && submitted.choice) {
        const choiceContainer = document.createElement("div");
        choiceContainer.className = "history-panel__choice-row";

        const choiceBtn = document.createElement("button");
        choiceBtn.className = "history-panel__choice-summary";
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
        list.appendChild(choiceContainer);
      }
      // If no submitted choice for this page, do not render a placeholder row
    }
  }

  return { render };
}

