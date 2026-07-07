const buttons = document.querySelectorAll(".filter-button");
const cards = document.querySelectorAll(".project-card");

buttons.forEach((button) => {
  button.setAttribute("aria-pressed", button.classList.contains("active") ? "true" : "false");

  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    buttons.forEach((item) => {
      item.classList.remove("active");
      item.setAttribute("aria-pressed", "false");
    });

    button.classList.add("active");
    button.setAttribute("aria-pressed", "true");

    cards.forEach((card) => {
      const categories = card.dataset.category.split(" ");
      card.classList.toggle("is-hidden", !(filter === "all" || categories.includes(filter)));
    });
  });
});
