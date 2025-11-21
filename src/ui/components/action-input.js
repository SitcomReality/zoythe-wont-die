export function createActionInput({ root, eventBus }) {
  root.innerHTML = "";

  const container = document.createElement("div");
  container.className = "action-input";

  const input = document.createElement("input");
  input.className = "action-input__field";
  input.type = "text";
  input.placeholder = "Ask, investigate, or act...";
  input.setAttribute("aria-label", "Action Input");

  const button = document.createElement("button");
  button.className = "action-input__btn";
  button.textContent = "Act";

  container.appendChild(input);
  container.appendChild(button);
  root.appendChild(container);

  function submit() {
    const value = input.value.trim();
    if (value) {
      eventBus.emit("ui:input:submit", value);
      input.value = "";
    }
  }

  button.addEventListener("click", submit);
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") submit();
  });

  function setDisabled(disabled) {
    if (disabled) {
      container.classList.add("action-input--disabled");
      input.disabled = true;
      button.disabled = true;
    } else {
      container.classList.remove("action-input--disabled");
      input.disabled = false;
      button.disabled = false;
    }
  }

  return { setDisabled };
}

