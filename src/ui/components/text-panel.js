export function createTextPanel({ root }) {
  root.innerHTML = "";

  const container = document.createElement("div");
  container.style.height = "100%";
  container.style.display = "flex";
  container.style.flexDirection = "column";
  container.style.padding = "10px 12px";
  container.style.borderRadius = "14px";
  container.style.background = "radial-gradient(circle at top, rgba(230, 179, 90, 0.06), rgba(0,0,0,0.9))";
  container.style.border = "1px solid rgba(255,255,255,0.04)";
  container.style.boxShadow = "0 10px 26px rgba(0,0,0,0.6) inset";

  const titleEl = document.createElement("div");
  titleEl.style.fontSize = "0.78rem";
  titleEl.style.letterSpacing = "0.18em";
  titleEl.style.textTransform = "uppercase";
  titleEl.style.color = "var(--accent)";
  titleEl.style.opacity = "0.9";
  titleEl.style.marginBottom = "4px";

  const bodyEl = document.createElement("div");
  bodyEl.style.flex = "1";
  bodyEl.style.minHeight = "0";
  bodyEl.style.fontSize = "0.9rem";
  bodyEl.style.lineHeight = "1.35";
  bodyEl.style.color = "var(--text-main)";
  bodyEl.style.overflow = "hidden";
  bodyEl.style.textOverflow = "ellipsis";
  bodyEl.style.display = "-webkit-box";
  bodyEl.style.webkitBoxOrient = "vertical";
  bodyEl.style.webkitLineClamp = "8";

  container.appendChild(titleEl);
  container.appendChild(bodyEl);
  root.appendChild(container);

  function render({ title, body }) {
    titleEl.textContent = title || "";
    bodyEl.textContent = body || "";
  }

  return { render };
}

