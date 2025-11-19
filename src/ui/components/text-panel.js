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
  loadingEl.style.display = "none";

  container.appendChild(titleEl);
  container.appendChild(bodyEl);
  container.appendChild(loadingEl);
  root.appendChild(container);

  function render({ title, body }) {
    loadingEl.style.display = "none";
    titleEl.style.display = "block";
    bodyEl.style.display = "block";
    
    titleEl.textContent = title || "";
    bodyEl.textContent = body || "";
  }

  function setLoading() {
    loadingEl.style.display = "flex";
    titleEl.style.display = "none";
    bodyEl.style.display = "none";
  }

  return { render, setLoading };
}

