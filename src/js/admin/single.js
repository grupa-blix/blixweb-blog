const blockPostPublishWithoutImage = () => {
  const publishBtn = document.querySelector(".editor-post-publish-button__button");
  if (!publishBtn) return;

  publishBtn.addEventListener("click", (e) => {
    const featuredImage = document.querySelector(".editor-post-featured-image img");
    if (!featuredImage) {
      e.preventDefault();
      e.stopPropagation();
      alert('Pole "Obrazek wyróżniający" nie może być puste');
    }
  });
};

window.addEventListener("load", () => {
  blockPostPublishWithoutImage();
});
