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
      const smallerHeadings = ["H3", "H4", "H5", "H6"];
      const li = document.createElement("li");
      li.innerText = heading.innerText;

      if (smallerHeadings.includes(heading.nodeName)) li.classList.add("with-margin");

      li.addEventListener("click", () => {
        scrollTo(heading);
      });

      contentsList.appendChild(li);
    });
  }
});
