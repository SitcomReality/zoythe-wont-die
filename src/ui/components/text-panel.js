export function createTextPanel({ root, eventBus }) {
  root.innerHTML = "";

  const container = document.createElement("div");
  container.className = "text-panel";

  const headerRow = document.createElement("div");
  headerRow.style.display = "flex";
  headerRow.style.alignItems = "center";
  headerRow.style.justifyContent = "space-between";
  headerRow.style.gap = "12px";

  const titleEl = document.createElement("div");
  titleEl.className = "text-panel__title";

  const regenBtn = document.createElement("button");
  regenBtn.className = "text-panel__regen";
  regenBtn.textContent = "Regenerate";
  regenBtn.style.display = "none";
  regenBtn.style.border = "none";
  regenBtn.style.background = "transparent";
  regenBtn.style.color = "var(--accent)";
  regenBtn.style.cursor = "pointer";
  regenBtn.style.fontSize = "0.85rem";
  regenBtn.style.padding = "6px 8px";
  regenBtn.title = "Regenerate this page (new seed)";

  headerRow.appendChild(titleEl);
  headerRow.appendChild(regenBtn);

  const bodyEl = document.createElement("div");
  bodyEl.className = "text-panel__body";

  const loadingEl = document.createElement("div");
  loadingEl.className = "text-panel__loading";
  loadingEl.innerHTML = `<div class="spinner"></div><span>Consulting the Stars...</span>`;

  container.appendChild(headerRow);
  container.appendChild(bodyEl);
  container.appendChild(loadingEl);
  root.appendChild(container);

  regenBtn.addEventListener("click", () => {
    // Ask app to regenerate current beat
    if (eventBus) {
      eventBus.emit("ui:regenerate:beat");
    }
    // show loading state immediately
    setLoading();
  });

  function render({ title, body }) {
    // Fade in the content
    titleEl.classList.remove("text-panel__title--hidden");
    bodyEl.classList.remove("text-panel__body--hidden");
    loadingEl.classList.remove("text-panel__loading--visible");

    titleEl.textContent = title || "";
    bodyEl.textContent = body || "";

    // Show regenerate when content visible
    regenBtn.style.display = "inline-block";
  }

  function setLoading() {
    // Fade out content and fade in loading
    titleEl.classList.add("text-panel__title--hidden");
    bodyEl.classList.add("text-panel__body--hidden");
    loadingEl.classList.add("text-panel__loading--visible");

    // hide regen while waiting
    regenBtn.style.display = "none";
  }

  return { render, setLoading };
}

