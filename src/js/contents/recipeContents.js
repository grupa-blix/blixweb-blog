const scrollTo = (element) => {
  const yOffset = document.querySelector(".navbar__outer").offsetHeight;
  const y = element.getBoundingClientRect().top + window.pageYOffset - yOffset;

  window.scrollTo({ top: y, behavior: "smooth" });
};

window.addEventListener("DOMContentLoaded", () => {
  const contentItems = document.querySelectorAll(".contents li");

  contentItems.forEach((item) => {
    item.addEventListener("click", () => {
      const { scrollElement } = item.dataset;
      const element = document.querySelector(`[data-scroll=${scrollElement}]`);
      scrollTo(element);
    });
  });
});
