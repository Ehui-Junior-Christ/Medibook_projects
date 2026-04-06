function openModal(id) {
  const overlay = document.getElementById("overlay");
  if (!overlay) {
    return;
  }
  overlay.classList.add("open");
  document.querySelectorAll(".modal").forEach((modal) => {
    modal.style.display = "none";
  });
  const target = document.getElementById(`modal-${id}`);
  if (target) {
    target.style.display = "block";
  }
}

function closeModal() {
  document.getElementById("overlay")?.classList.remove("open");
}

document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("overlay");
  if (overlay) {
    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) {
        closeModal();
      }
    });
  }
});
