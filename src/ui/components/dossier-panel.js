export function createDossierPanel({ root, eventBus }) {
  let activeTab = "suspects"; // 'suspects' or 'clues'
  let currentMysteryState = null;

  // Skeleton
  root.innerHTML = "";
  const container = document.createElement("div");
  container.className = "dossier-panel";

  // Header
  const header = document.createElement("div");
  header.className = "dossier-panel__header";
  header.textContent = "Case Files";
  container.appendChild(header);

  // Tabs
  const tabsContainer = document.createElement("div");
  tabsContainer.className = "dossier-panel__tabs";
  
  const suspectTab = createTab("Suspects", "suspects");
  const clueTab = createTab("Clues", "clues");
  
  tabsContainer.appendChild(suspectTab);
  tabsContainer.appendChild(clueTab);
  container.appendChild(tabsContainer);

  // Content
  const contentArea = document.createElement("div");
  contentArea.className = "dossier-panel__content";
  container.appendChild(contentArea);

  root.appendChild(container);

  function createTab(label, key) {
    const btn = document.createElement("button");
    btn.className = `dossier-tab ${activeTab === key ? "dossier-tab--active" : ""}`;
    btn.textContent = label;
    btn.onclick = () => {
      activeTab = key;
      updateTabs();
      renderContent();
    };
    return btn;
  }

  function updateTabs() {
    suspectTab.className = `dossier-tab ${activeTab === "suspects" ? "dossier-tab--active" : ""}`;
    clueTab.className = `dossier-tab ${activeTab === "clues" ? "dossier-tab--active" : ""}`;
  }

  function renderContent() {
    contentArea.innerHTML = "";
    
    if (!currentMysteryState) {
      contentArea.innerHTML = `<div class="dossier-empty">No active investigation.</div>`;
      return;
    }

    if (activeTab === "suspects") {
      renderSuspects();
    } else {
      renderClues();
    }
  }

  function renderSuspects() {
    const suspects = currentMysteryState.suspects; // Map
    if (!suspects || suspects.size === 0) {
      contentArea.innerHTML = `<div class="dossier-empty">No known suspects.</div>`;
      return;
    }

    for (const suspect of suspects.values()) {
      const item = document.createElement("div");
      item.className = "dossier-item";
      
      const header = document.createElement("div");
      header.className = "dossier-item__header";
      header.innerHTML = `
        <span class="dossier-item__name">${suspect.name}</span>
        <span class="dossier-item__role">${suspect.role}</span>
      `;

      const details = document.createElement("div");
      details.className = "dossier-item__details";
      details.style.display = "none";
      
      // Motive
      if (suspect.motive) {
        details.innerHTML += `
          <div class="dossier-item__detail-row">
            <span class="dossier-item__label">Motive</span>
            ${suspect.motive}
          </div>
        `;
      }

      // Alibi
      if (suspect.alibi) {
        details.innerHTML += `
          <div class="dossier-item__detail-row">
            <span class="dossier-item__label">Alibi</span>
            ${suspect.alibi.statement}
          </div>
        `;
      }
      
      header.onclick = () => {
        const isHidden = details.style.display === "none";
        details.style.display = isHidden ? "block" : "none";
        header.style.background = isHidden ? "rgba(255,255,255,0.05)" : "";
      };

      item.appendChild(header);
      item.appendChild(details);
      contentArea.appendChild(item);
    }
  }

  function renderClues() {
    const cluesMap = currentMysteryState.clues?.all;
    const discoveredIds = currentMysteryState.clues?.discovered;
    
    if (!cluesMap || !discoveredIds || discoveredIds.size === 0) {
      contentArea.innerHTML = `<div class="dossier-empty">No clues discovered yet.</div>`;
      return;
    }

    for (const id of discoveredIds) {
      const clue = cluesMap.get(id);
      if (!clue) continue;

      const item = document.createElement("div");
      item.className = "dossier-item";
      
      const header = document.createElement("div");
      header.className = "dossier-item__header";
      header.innerHTML = `
        <span class="dossier-item__name">${clue.label}</span>
        <span class="dossier-item__role">${clue.type}</span>
      `;

      const details = document.createElement("div");
      details.className = "dossier-item__details";
      details.style.display = "none";
      
      details.innerHTML += `
        <div class="dossier-item__detail-row">
          ${clue.description}
        </div>
      `;
      
      header.onclick = () => {
        const isHidden = details.style.display === "none";
        details.style.display = isHidden ? "block" : "none";
        header.style.background = isHidden ? "rgba(255,255,255,0.05)" : "";
      };

      item.appendChild(header);
      item.appendChild(details);
      contentArea.appendChild(item);
    }
  }

  function update({ mystery }) {
    currentMysteryState = mystery;
    renderContent();
  }

  return { update };
}

