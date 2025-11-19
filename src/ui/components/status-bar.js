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
  bar.style.gap = "12px";

  const left = document.createElement("div");
  left.style.display = "flex";
  left.style.gap = "8px";
  left.style.alignItems = "center";
  
  const center = document.createElement("div");
  center.style.display = "flex";
  center.style.gap = "6px";
  center.style.fontSize = "0.68rem";
  
  const right = document.createElement("div");

  bar.appendChild(left);
  bar.appendChild(center);
  bar.appendChild(right);
  root.appendChild(bar);

  function render() {
    const { player, world, narrative } = gameState;
    
    // Left: archetype and tone
    left.textContent = `${player.archetype} • ${world.tone}`;
    
    // Center: threat and heroism indicators
    const threatDots = "●".repeat(Math.min(world.homeThreatLevel, 5));
    const heroismLevel = Math.max(0, Math.min(5, Math.floor(player.heroism / 2)));
    const heroismDots = "✦".repeat(heroismLevel);
    
    center.innerHTML = `
      <span style="color: var(--danger); opacity: 0.7;" title="Threat Level">${threatDots}</span>
      ${heroismDots ? `<span style="color: var(--accent); opacity: 0.8;" title="Heroism">${heroismDots}</span>` : ""}
    `;
    
    // Right: beat progress
    right.textContent = `${narrative.beatIndex + 1}`;
  }

  return { render };
}

