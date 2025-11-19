export function createStatusBar({ root, gameState }) {
  root.innerHTML = "";

  const bar = document.createElement("div");
  bar.style.height = "100%";
  bar.style.display = "flex";
  bar.style.alignItems = "center";
  bar.style.justifyContent = "space-between";
  bar.style.padding = "0 10px";
  bar.style.fontSize = "0.72rem";
  bar.style.color = "var(--text-muted)";

  const left = document.createElement("div");
  const right = document.createElement("div");

  bar.appendChild(left);
  bar.appendChild(right);
  root.appendChild(bar);

  function render() {
    const { player, world, narrative } = gameState;
    left.textContent = `${player.archetype} • ${world.tone}`;
    right.textContent = `Beat ${narrative.beatIndex + 1}`;
  }

  return { render };
}

