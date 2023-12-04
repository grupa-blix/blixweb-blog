const scrollTo = (element) => {
  const yOffset = document.querySelector(".navbar__outer").offsetHeight;
  const y = element.getBoundingClientRect().top + window.pageYOffset - yOffset;

  window.scrollTo({ top: y, behavior: "smooth" });
};

window.addEventListener("DOMContentLoaded", async () => {
  const contents = document.querySelector(".contents");
  const contentsList = document.querySelector(".contents__list");
  const contentHeadings = Array.from(document.querySelectorAll(".content .wp-block-heading")).filter((el) => {
    return el.tagName === "H2" || el.tagName == "H3";
  });
  let initialScrollElement = null;

  if (contentHeadings.length === 0) {
    return;
  } else {
    contents.classList.remove("d-none");
    const promises = Array.from(contentHeadings).map(async (heading) => {
      const smallerHeadings = ["H3", "H4", "H5", "H6"];
      const li = document.createElement("li");
      const a = document.createElement("a");
      const headingId = heading.innerText.toLowerCase().replaceAll(" ", "-");
      const itemHref = "#" + heading.innerText.toLowerCase().replaceAll(" ", "-");

      heading.id = headingId;
      a.innerText = heading.innerText;
      a.href = itemHref;

      if (decodeURIComponent(window.location.href).split("#")[1] === headingId) initialScrollElement = heading;
      if (smallerHeadings.includes(heading.nodeName)) li.classList.add("with-margin");

      a.addEventListener("click", (e) => {
        e.preventDefault();
        hash = a.href;
        window.location = hash;
      });

      li.addEventListener("click", () => {
        scrollTo(heading);
      });

      li.appendChild(a);
      contentsList.appendChild(li);
    });

    await Promise.all(promises);

    if (initialScrollElement) {
      setTimeout(() => {
        scrollTo(initialScrollElement);
      }, 1000);
    }
  }
});
