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
    
    // Center: heroism indicator
    const heroismLevel = Math.max(0, Math.min(5, Math.floor(player.heroism / 2)));
    const heroismDots = "✦".repeat(heroismLevel);
    
    center.innerHTML = heroismDots ? `<span class="status-bar__heroism" title="Heroism">${heroismDots}</span>` : "";
    
    // Right: beat progress, current beat name, and urgency indicator
    const pageNum = narrative.beatIndex != null ? narrative.beatIndex + 1 : "?";
    const lastBeatId = narrative.lastBeatId || "";
    const beatName = lastBeatId ? lastBeatId.split(":").pop() : "—";
    const repeatCount = narrative.beatRepeatCount > 0 ? ` [${narrative.beatRepeatCount + 1}]` : "";
    const urgencyBar = narrative.urgencyLevel > 0 ? ` ◆`.repeat(Math.min(narrative.urgencyLevel, 3)) : "";
    
    right.textContent = `${pageNum} • ${beatName}${repeatCount}${urgencyBar}`;
  }

  return { render };
}

