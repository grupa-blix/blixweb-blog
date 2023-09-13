const scrollTo = (element) => {
  const yOffset = document.querySelector(".navbar__outer").offsetHeight;
  const y = element.getBoundingClientRect().top + window.pageYOffset - yOffset;

  window.scrollTo({ top: y, behavior: "smooth" });
};

window.addEventListener("DOMContentLoaded", () => {
  const contentItems = document.querySelectorAll(".contents li");

  contentItems.forEach((item) => {
    const anchor = item.querySelector("a");
    const { scrollElement } = item.dataset;
    const element = document.querySelector(`[data-scroll=${scrollElement}]`);

    anchor.addEventListener("click", (e) => {
      e.preventDefault();
      hash = anchor.href;
      window.location = hash;
    });

    item.addEventListener("click", () => {
      scrollTo(element);
    });

    if (decodeURIComponent(window.location.href).split("#")[1] === decodeURIComponent(anchor.href).split("#")[1]) {
      setTimeout(() => {
        scrollTo(element);
      }, 1000);
    }
  });
});
