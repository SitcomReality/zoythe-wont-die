import { HERO_ARCHETYPES, WORLD_TONES } from "../../config/constants.js";

export function createNewGameScreen({ root, onStart, onCancel }) {
  root.innerHTML = "";

  const container = document.createElement("div");
  container.className = "menu-screen";

  const title = document.createElement("h2");
  title.className = "menu-screen__title";
  title.style.fontSize = "1.5rem";
  title.textContent = "Configure Narrative";

  const form = document.createElement("div");
  form.className = "new-game-form";

  // Seed Input
  const seedGroup = createFormGroup("Narrative Seed", "Random seed for procedural generation");
  const seedInput = document.createElement("input");
  seedInput.className = "form-input";
  seedInput.placeholder = "Leave empty for random";
  seedInput.value = "";
  seedGroup.appendChild(seedInput);

  // Tone Select
  const toneGroup = createFormGroup("World Tone", "The prevailing mood of the Interregnum");
  const toneSelect = document.createElement("select");
  toneSelect.className = "form-select";
  addOption(toneSelect, "random", "Random");
  Object.values(WORLD_TONES).forEach(t => addOption(toneSelect, t, t.charAt(0).toUpperCase() + t.slice(1)));
  toneGroup.appendChild(toneSelect);

  // Archetype Bias
  const arcGroup = createFormGroup("Protagonist Archetype", "Initial bias for your hero's personality");
  const arcSelect = document.createElement("select");
  arcSelect.className = "form-select";
  addOption(arcSelect, "random", "Random / None");
  Object.values(HERO_ARCHETYPES).forEach(a => addOption(arcSelect, a, a.charAt(0).toUpperCase() + a.slice(1)));
  arcGroup.appendChild(arcSelect);

  // Rail Strictness
  const railGroup = createFormGroup("Divine Intervention", "How aggressively the gods (system) steer your fate");
  const railSelect = document.createElement("select");
  railSelect.className = "form-select";
  addOption(railSelect, "standard", "Standard");
  addOption(railSelect, "loose", "Loose (More Freedom)");
  addOption(railSelect, "strict", "Strict (Heavy Railroading)");
  railGroup.appendChild(railSelect);

  form.appendChild(seedGroup);
  form.appendChild(toneGroup);
  form.appendChild(arcGroup);
  form.appendChild(railGroup);

  const actions = document.createElement("div");
  actions.className = "menu-screen__actions";

  const startBtn = document.createElement("button");
  startBtn.className = "menu-btn menu-btn--primary";
  startBtn.textContent = "Begin Journey";
  startBtn.onclick = () => {
    onStart({
      seed: seedInput.value || null,
      tone: toneSelect.value === "random" ? null : toneSelect.value,
      archetype: arcSelect.value === "random" ? null : arcSelect.value,
      railStrictness: railSelect.value
    });
  };

  const cancelBtn = document.createElement("button");
  cancelBtn.className = "menu-btn";
  cancelBtn.textContent = "Back";
  cancelBtn.onclick = onCancel;

  actions.appendChild(startBtn);
  actions.appendChild(cancelBtn);

  container.appendChild(title);
  container.appendChild(form);
  container.appendChild(actions);

  root.appendChild(container);
}

function createFormGroup(label, hint) {
  const group = document.createElement("div");
  group.className = "form-group";

  const labelEl = document.createElement("label");
  labelEl.className = "form-label";
  labelEl.textContent = label;

  group.appendChild(labelEl);

  if (hint) {
    const hintEl = document.createElement("span");
    hintEl.className = "form-hint";
    hintEl.textContent = hint;
    group.appendChild(hintEl);
  }

  return group;
}

function addOption(select, value, text) {
  const opt = document.createElement("option");
  opt.value = value;
  opt.textContent = text;
  select.appendChild(opt);
}