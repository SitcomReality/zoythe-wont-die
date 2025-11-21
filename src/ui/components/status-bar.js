export function createStatusBar({ root, gameState }) {
  root.innerHTML = "";

  const bar = document.createElement("div");
  bar.className = "status-bar";

  const left = document.createElement("div");
  left.className = "status-bar__left";
  
  const center = document.createElement("div");
  center.className = "status-bar__center";
  
  const right = document.createElement("div");
  right.className = "status-bar__right";

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
      <span class="status-bar__threat" title="Threat Level">${threatDots}</span>
      ${heroismDots ? `<span class="status-bar__heroism" title="Heroism">${heroismDots}</span>` : ""}
    `;
    
    // Right: beat progress and current beat name
    const pageNum = narrative.beatIndex != null ? narrative.beatIndex + 1 : "?";
    const lastBeatId = narrative.lastBeatId || "";
    // Derive a short beat name from id (use last segment after ':' if present)
    const beatName = lastBeatId ? lastBeatId.split(":").pop() : "—";
    right.textContent = `${pageNum} • ${beatName}`;
  }

  return { render };
}

