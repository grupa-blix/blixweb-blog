const toggleShareModal = (open = false) => {
  const shareModal = document.querySelector(".share-modal");

  if (open === true) {
    shareModal.classList.add("share-modal--opened");
  } else {
    shareModal.classList.remove("share-modal--opened");
  }
};

const handleShareClick = async () => {
  try {
    await navigator.share({
      url: window.location.href,
    });
  } catch (e) {
    if (!e.toString().includes("AbortError")) {
      toggleShareModal(true);
    }
  }
};

window.addEventListener("DOMContentLoaded", () => {
  const shareBtn = document.querySelector(".share__btn");
  const shareCloseBtn = document.querySelector(".share-modal__close-btn");
  const shareBg = document.querySelector(".share-modal__bg");

  shareBtn.addEventListener("click", handleShareClick);
  shareCloseBtn.addEventListener("click", toggleShareModal);
  shareBg.addEventListener("click", toggleShareModal);
});
