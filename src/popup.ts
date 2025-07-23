/// <reference types="chrome" />

const shortcutInput = document.getElementById("shortcut") as HTMLInputElement;
const expandedInput = document.getElementById(
  "expanded"
) as HTMLTextAreaElement;
const saveBtn = document.getElementById("save") as HTMLButtonElement;
const list = document.getElementById("list") as HTMLDivElement;

type Expansions = Record<string, string>;
let editingKey: string | null = null;

function render(): void {
  chrome.storage.sync.get("expansions", (data: { expansions?: Expansions }) => {
    list.innerHTML = "";
    const expansions = data.expansions || {};

    for (const [key, value] of Object.entries(expansions)) {
      const card = document.createElement("div");
      card.className = "card p-2";

      const content = document.createElement("div");
      content.className = "mb-2";
      content.textContent = `${key} → ${value}`;
      card.appendChild(content);

      const btnGroup = document.createElement("div");
      btnGroup.className = "d-flex justify-content-end gap-2";

      const editBtn = document.createElement("button");
      editBtn.textContent = "Editar";
      editBtn.className = "btn btn-sm btn-outline-primary";
      editBtn.onclick = () => {
        shortcutInput.value = key;
        expandedInput.value = value;
        editingKey = key;
      };
      btnGroup.appendChild(editBtn);

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Excluir";
      deleteBtn.className = "btn btn-sm btn-outline-danger";
      deleteBtn.onclick = () => {
        delete expansions[key];
        chrome.storage.sync.set({ expansions }, render);
      };
      btnGroup.appendChild(deleteBtn);

      card.appendChild(btnGroup);
      list.appendChild(card);
    }
  });
}

saveBtn.addEventListener("click", () => {
  const key = shortcutInput.value.trim();
  const value = expandedInput.value.trim();
  if (!key || !value) return;

  chrome.storage.sync.get("expansions", (data: { expansions?: Expansions }) => {
    const expansions = data.expansions || {};

    if (editingKey && editingKey !== key) {
      delete expansions[editingKey];
    }

    expansions[key] = value;
    chrome.storage.sync.set({ expansions }, () => {
      render();
      shortcutInput.value = "";
      expandedInput.value = "";
      editingKey = null;
    });
  });
});

render();
