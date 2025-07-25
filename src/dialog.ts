function openDialog(): void {
  const dialog = document.getElementById(
    "config-dialog"
  ) as HTMLDialogElement | null;
  if (dialog && typeof dialog.showModal === "function") {
    dialog.showModal();
  } else {
    alert("Este navegador não suporta o elemento <dialog>.");
  }
}

function closeDialog(): void {
  const dialog = document.getElementById(
    "config-dialog"
  ) as HTMLDialogElement | null;
  dialog?.close();
}

document.addEventListener("DOMContentLoaded", () => {
  const openBtn = document.getElementById("openDialog-btn");
  const closeBtn = document.getElementById("closeDialog-btn");

  openBtn?.addEventListener("click", openDialog);
  closeBtn?.addEventListener("click", closeDialog);
});
