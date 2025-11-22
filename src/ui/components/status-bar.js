export function createStatusBar({ root, gameState, eventBus }) {
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
    
    // Build center content with heroism and a menu button for wider screens
    center.innerHTML = heroismDots ? `<span class="status-bar__heroism" title="Heroism">${heroismDots}</span>` : "";
    
    // Add menu button to status center (desktop)
    const menuBtn = document.createElement("button");
    menuBtn.textContent = "Menu";
    menuBtn.style.marginLeft = "10px";
    menuBtn.style.border = "none";
    menuBtn.style.background = "transparent";
    menuBtn.style.color = "var(--accent)";
    menuBtn.style.cursor = "pointer";
    menuBtn.style.fontSize = "0.9rem";
    menuBtn.addEventListener("click", () => {
      if (eventBus) eventBus.emit("ui:menu:open");
    });
    
    center.appendChild(menuBtn);
    
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

