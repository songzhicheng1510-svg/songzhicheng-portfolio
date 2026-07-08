const buttons = document.querySelectorAll(".filter-button");
const cards = document.querySelectorAll(".project-card");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

const revealItems = document.querySelectorAll(
  ".section, .project-card, .case-brief > div, .case-content article, .gallery-grid figure"
);

revealItems.forEach((item, index) => {
  item.classList.add("reveal-on-scroll");

  if (item.classList.contains("project-card")) {
    item.style.setProperty("--reveal-delay", `${Math.min(index * 55, 330)}ms`);
  }
});

if (reduceMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  revealItems.forEach((item) => revealObserver.observe(item));
}
