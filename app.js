const buttons = document.querySelectorAll(".filter-button");
const cards = document.querySelectorAll(".project-card");
buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    buttons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    cards.forEach((card) => {
      const categories = card.dataset.category.split(" ");
      card.classList.toggle("is-hidden", !(filter === "all" || categories.includes(filter)));
    });
  });
});
