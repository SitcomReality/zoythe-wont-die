export function createTextPanel({ root }) {
  root.innerHTML = "";

  const container = document.createElement("div");
  container.className = "text-panel";

  const titleEl = document.createElement("div");
  titleEl.className = "text-panel__title";

  const bodyEl = document.createElement("div");
  bodyEl.className = "text-panel__body";

  const loadingEl = document.createElement("div");
  loadingEl.className = "text-panel__loading";
  loadingEl.innerHTML = `<div class="spinner"></div><span>Consulting the Stars...</span>`;

  container.appendChild(titleEl);
  container.appendChild(bodyEl);
  container.appendChild(loadingEl);
  root.appendChild(container);

  function render({ title, body }) {
    // Fade in the content
    titleEl.classList.remove("text-panel__title--hidden");
    bodyEl.classList.remove("text-panel__body--hidden");
    loadingEl.classList.remove("text-panel__loading--visible");
    
    titleEl.textContent = title || "";
    bodyEl.textContent = body || "";
  }

  function setLoading() {
    // Fade out content and fade in loading
    titleEl.classList.add("text-panel__title--hidden");
    bodyEl.classList.add("text-panel__body--hidden");
    loadingEl.classList.add("text-panel__loading--visible");
  }

  return { render, setLoading };
}

