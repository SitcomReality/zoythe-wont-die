export function createTextPanel({ root }) {
  root.innerHTML = "";

  const container = document.createElement("div");
  container.className = "text-panel";

  const titleEl = document.createElement("div");
  titleEl.className = "text-panel__title";

  const bodyEl = document.createElement("div");
  bodyEl.className = "text-panel__body";

  container.appendChild(titleEl);
  container.appendChild(bodyEl);
  root.appendChild(container);

  function render({ title, body }) {
    titleEl.textContent = title || "";
    bodyEl.textContent = body || "";
  }

  return { render };
}

