console.log("Text Expander content script carregado!");

const expansions: Record<string, string> = {
  omw: "On my way!",
  brb: "Be right back.",
  ty: "Thank you!",
};

document.addEventListener("input", (event) => {
  const target = event.target as HTMLElement;
  if (!target.isContentEditable) return;

  const text = target.innerText || "";

  const words = text.split(/\s+/);
  const lastWord = words[words.length - 1];

  const expanded = expansions[lastWord];
  if (expanded) {
    const selection = window.getSelection();
    if (!selection || !selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const node = range.startContainer;
    const offset = range.startOffset;

    let startOffset = offset;
    while (startOffset > 0) {
      const char = node.textContent?.[startOffset - 1];
      if (!char || /\s/.test(char)) break;
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
