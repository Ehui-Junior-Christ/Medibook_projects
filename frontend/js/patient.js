document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".tab-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const wrapper = button.closest("[data-tabs]");
      if (!wrapper) {
        return;
      }
      wrapper.querySelectorAll(".tab-btn").forEach((node) => node.classList.remove("active"));
      wrapper.querySelectorAll(".tab-content").forEach((node) => node.classList.remove("active"));
      button.classList.add("active");
      const target = wrapper.querySelector(`#${button.dataset.target}`);
      if (target) {
        target.classList.add("active");
      }
    });
  });
});
