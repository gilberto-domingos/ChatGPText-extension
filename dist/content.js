"use strict";
/// <reference types="chrome" />
console.log("Text Expander content script carregado!");
let expansions = {};
// Carrega os atalhos do storage do Chrome
function loadExpansions() {
    chrome.storage.sync.get("expansions", (data) => {
        expansions = data.expansions || {};
        console.log("Expansions carregadas:", expansions);
    });
}
// Atualiza automaticamente se o storage for modificado
chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "sync" && changes.expansions) {
        expansions = changes.expansions.newValue || {};
        console.log("Expansions atualizadas dinamicamente:", expansions);
    }
});
loadExpansions();
document.addEventListener("input", (event) => {
    var _a;
    const target = event.target;
    if (!target.isContentEditable)
        return;
    const text = target.innerText || "";
    const words = text.split(/\s+/);
    const lastWord = words[words.length - 1];
    const expanded = expansions[lastWord];
    if (expanded) {
        const selection = window.getSelection();
        if (!selection || !selection.rangeCount)
            return;
        const range = selection.getRangeAt(0);
        const node = range.startContainer;
        const offset = range.startOffset;
        let startOffset = offset;
        while (startOffset > 0) {
            const char = (_a = node.textContent) === null || _a === void 0 ? void 0 : _a[startOffset - 1];
            if (!char || /\s/.test(char))
                break;
            startOffset--;
        }
        range.setStart(node, startOffset);
        range.setEnd(node, offset);
        range.deleteContents();
        range.insertNode(document.createTextNode(expanded + " "));
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
    }
});
