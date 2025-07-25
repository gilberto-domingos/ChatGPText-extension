"use strict";
// content.ts
/// <reference types="chrome" />
console.log("✅ Text Expander content script loaded!");
let expansions = {};
function loadExpansions() {
    chrome.storage.sync.get("expansions", (data) => {
        expansions = data.expansions || {};
        console.log("📦 Expansions loaded:", expansions);
    });
}
chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "sync" && changes.expansions) {
        expansions = changes.expansions.newValue || {};
        console.log("🔁 Expansions updated:", expansions);
    }
});
loadExpansions();
function detectInputType(target) {
    if (!(target instanceof HTMLElement))
        return null;
    if (target.tagName === "TEXTAREA")
        return "textarea";
    if (target.tagName === "INPUT")
        return "input";
    if (target.isContentEditable)
        return "contenteditable";
    return null;
}
function expandInInputField(element, triggerWord, replacement) {
    const start = element.selectionStart || 0;
    const value = element.value;
    const left = value.substring(0, start);
    const right = value.substring(start);
    const regex = new RegExp(`\\b${triggerWord}$`);
    if (!regex.test(left))
        return;
    const newLeft = left.replace(regex, replacement + " ");
    element.value = newLeft + right;
    const cursorPos = newLeft.length;
    element.setSelectionRange(cursorPos, cursorPos);
}
function expandInContentEditable(target, triggerWord, replacement) {
    const selection = window.getSelection();
    if (!selection || !selection.rangeCount)
        return;
    const range = selection.getRangeAt(0);
    const node = range.startContainer;
    const offset = range.startOffset;
    let startOffset = offset;
    while (startOffset > 0) {
        const char = node.textContent?.[startOffset - 1];
        if (!char || /\s/.test(char))
            break;
        startOffset--;
    }
    const word = node.textContent?.substring(startOffset, offset);
    if (!word || !(word in expansions))
        return;
    range.setStart(node, startOffset);
    range.setEnd(node, offset);
    range.deleteContents();
    range.insertNode(document.createTextNode(expansions[word] + " "));
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
}
function handleInput(event) {
    const target = event.target;
    const type = detectInputType(target);
    if (!type)
        return;
    if (!(target instanceof HTMLElement))
        return;
    let text = "";
    if (type === "input" || type === "textarea") {
        const field = target;
        const caret = field.selectionStart || 0;
        text = field.value.substring(0, caret);
    }
    else if (type === "contenteditable") {
        text = target.innerText;
    }
    const words = text.trim().split(/\s+/);
    const lastWord = words[words.length - 1];
    if (!lastWord || !(lastWord in expansions))
        return;
    if (type === "input" || type === "textarea") {
        expandInInputField(target, lastWord, expansions[lastWord]);
    }
    else if (type === "contenteditable") {
        expandInContentEditable(target, lastWord, expansions[lastWord]);
    }
}
function observeDOMReadyAndAttach() {
    const observer = new MutationObserver(() => {
        const inputs = document.querySelectorAll("input, textarea, [contenteditable='true']");
        if (inputs.length > 0) {
            observer.disconnect();
            document.addEventListener("input", handleInput);
            console.log("📡 Universal input listener attached.");
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
}
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", observeDOMReadyAndAttach);
}
else {
    observeDOMReadyAndAttach();
}
