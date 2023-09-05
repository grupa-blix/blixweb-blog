const scrollTo = (element) => {
  const yOffset = document.querySelector(".navbar__outer").offsetHeight;
  const y = element.getBoundingClientRect().top + window.pageYOffset - yOffset;

  window.scrollTo({ top: y, behavior: "smooth" });
};

window.addEventListener("DOMContentLoaded", () => {
  const contents = document.querySelector(".contents");
  const contentsList = document.querySelector(".contents__list");
  const contentHeadings = document.querySelectorAll(".content .wp-block-heading");

  if (contentHeadings.length === 0) {
    return;
  } else {
    contents.classList.remove("d-none");
    contentHeadings.forEach((heading) => {
      const li = document.createElement("li");
      li.innerText = heading.innerText;

      li.addEventListener("click", () => {
        scrollTo(heading);
      });

      contentsList.appendChild(li);
    });
  }
});
