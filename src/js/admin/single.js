let publishBtn;

const checkFeaturedImage = (e) => {
  e.preventDefault();
  e.stopPropagation();

  const editPostBtn = document.querySelector(".edit-post-sidebar__panel-tab");

  if (!editPostBtn.classList.contains("is-active")) {
    editPostBtn.click();
  }

  setTimeout(() => {
    const featuredImage = document.querySelector(".editor-post-featured-image img");
    if (!featuredImage) {
      alert('Pole "Obrazek wyróżniający" nie może być puste');
    } else {
      publishBtn.removeEventListener("click", checkFeaturedImage);
      publishBtn.click();
      publishBtn.addEventListener("click", checkFeaturedImage);
    }
  }, 1000);
};

const blockPostPublishWithoutImage = () => {
  publishBtn = document.querySelector(".editor-post-publish-button__button");
  if (!publishBtn) return;

  publishBtn.addEventListener("click", checkFeaturedImage);
};

window.addEventListener("load", () => {
  blockPostPublishWithoutImage();
});
