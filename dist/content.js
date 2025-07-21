"use strict";
console.log("Text Expander content script carregado!");
const expansions = {
    dacm: "profissionalmente como programador senior no mercado e de acordo com as convenções da Microsoft e boas práticas",
    omw: "On my way!",
    brb: "Be right back.",
    ty: "Thank you!",
};
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
