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
    dataLayer.push(function () {
      this.reset();
    });
    dataLayer.push({
      event: "BLOG_NATIVE_SHARE",
    });
  } catch (e) {
    if (!e.toString().includes("AbortError")) {
      toggleShareModal(true);
    }
  }
};

window.addEventListener("DOMContentLoaded", () => {
  const share = document.querySelector(".share");
  const shareCloseBtn = document.querySelector(".share-modal__close-btn");
  const shareBg = document.querySelector(".share-modal__bg");
  const shareCopyUrl = document.querySelector(".share-modal__url");
  const shareCopyBtn = document.querySelector(".share-modal__copy-btn");

  if (!share) return;

  share.addEventListener("click", handleShareClick);
  shareCloseBtn.addEventListener("click", toggleShareModal);
  shareBg.addEventListener("click", toggleShareModal);
  shareCopyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(shareCopyUrl.innerText);
      dataLayer.push(function () {
        this.reset();
      });
      dataLayer.push({
        event: "BLOG_CLIPBOARD_SHARE",
      });
    } catch (e) {
      console.log(e);
    }

    toggleShareModal();
  });
});
