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

      const button = document.createElement("button");
      button.className = "history-panel__button";
      
      const titleEl = document.createElement("div");
      titleEl.className = "history-panel__title";
      titleEl.textContent = entry.title || `Page ${idx + 1}`;

      const contentEl = document.createElement("div");
      contentEl.className = "history-panel__content";
      
      const fullBody = entry.body || '';
      const trimmedBody = fullBody.split('\n')[0].substring(0, 60);
      const isTrimmed = trimmedBody.length === 60 && fullBody.length > 60;
      
      contentEl.textContent = isTrimmed ? trimmedBody + "..." : fullBody;
      contentEl.dataset.full = fullBody;
      contentEl.dataset.trimmed = isTrimmed ? trimmedBody + "..." : fullBody;
      contentEl.dataset.expanded = "false";

      button.appendChild(titleEl);
      button.appendChild(contentEl);

      let expanded = false;
      button.addEventListener("click", () => {
        expanded = !expanded;
        if (expanded) {
          contentEl.textContent = contentEl.dataset.full;
          contentEl.dataset.expanded = "true";
          item.classList.add("history-panel__item--expanded");
        } else {
          contentEl.textContent = contentEl.dataset.trimmed;
          contentEl.dataset.expanded = "false";
          item.classList.remove("history-panel__item--expanded");
        }
      });

      item.appendChild(button);
      list.appendChild(item);

      // Find and render the choice that was submitted after this page
      const nextEntry = history[idx + 1];
      const submitted = choiceHistory.find(c => {
        const ct = c.timestamp || 0;
        const afterPage = ct > (entry.timestamp || 0);
        const beforeNext = nextEntry ? ct <= (nextEntry.timestamp || Infinity) : true;
        return afterPage && beforeNext;
      });

      if (submitted && submitted.choice) {
        const choiceContainer = document.createElement("div");
        choiceContainer.className = "history-panel__choice-row";

        const choiceBtn = document.createElement("button");
        choiceBtn.className = "history-panel__choice-button";
        
        const choiceLabel = typeof submitted.choice.label === "string" ? submitted.choice.label : (submitted.choice || {}).label || "";
        const choiceTrimmed = choiceLabel.length > 80 ? choiceLabel.substring(0, 77) + "..." : choiceLabel;
        
        choiceBtn.textContent = choiceTrimmed;
        choiceBtn.dataset.full = choiceLabel;
        choiceBtn.dataset.trimmed = choiceTrimmed;
        choiceBtn.dataset.expanded = "false";

        let choiceExpanded = false;
        choiceBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          choiceExpanded = !choiceExpanded;
          if (choiceExpanded) {
            choiceBtn.textContent = choiceBtn.dataset.full;
            choiceBtn.dataset.expanded = "true";
            choiceContainer.classList.add("history-panel__choice-row--expanded");
          } else {
            choiceBtn.textContent = choiceBtn.dataset.trimmed;
            choiceBtn.dataset.expanded = "false";
            choiceContainer.classList.remove("history-panel__choice-row--expanded");
          }
        });

        choiceContainer.appendChild(choiceBtn);
        list.appendChild(choiceContainer);
      }
    }
  }

  return { render };
}

