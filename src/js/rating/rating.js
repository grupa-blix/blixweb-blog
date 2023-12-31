const endpoint =
  window.location.origin === "https://blix.pl" ? "https://blix.pl/blog/wp-json/blog/rate/" : "/wp-json/blog/rate/";
const handleNoStorageData = () => {
  const ratedPosts = JSON.parse(localStorage.getItem("ratedPosts"));
  if (!ratedPosts) localStorage.setItem("ratedPosts", JSON.stringify([]));
};

const updateAlreadyRatedPosts = (postId) => {
  const ratedPosts = JSON.parse(localStorage.getItem("ratedPosts"));
  ratedPosts.push(postId);
  localStorage.setItem("ratedPosts", JSON.stringify(ratedPosts));
};

const checkIfAlreadyRated = (postId) => {
  const likedPosts = localStorage.getItem("ratedPosts");
  return likedPosts.includes(postId);
};

const updateProgress = (rating) => {
  const ratingProgress = document.querySelector(".rating__progress");
  const progressPercentage = rating.toFixed(1) * 20;
  const spacing = Math.floor(rating) * 4 > 16 ? 16 : Math.floor(rating) * 4;
  const progress = (progressPercentage / 100) * 104 + spacing;
  ratingProgress.style.width = `${progress}px`;
};

const hideStars = () => {
  const rating = document.querySelector(".rating");
  rating.classList.add("rated");
};

const handleStarHover = (starBtn, starBtns) => {
  const progress = document.querySelector(".rating__progress");
  const { rating } = starBtn.dataset;

  starBtns.forEach((btn, i) => {
    if (i + 1 <= rating) btn.classList.add("active");
  });

  progress.classList.add("d-none");
};

const clearStarsHover = (starBtns) => {
  const progress = document.querySelector(".rating__progress");

  starBtns.forEach((btn) => {
    btn.classList.remove("active");
  });

  progress.classList.remove("d-none");
};

const handleStarClick = async (starBtn) => {
  const { rating } = starBtn.dataset;
  const { postId } = starBtn.closest(".rating").dataset;
  const ratingValue = document.querySelector(".rating__value");

  const res = await fetch(endpoint, {
    method: "POST",
    body: JSON.stringify({
      postId,
      rating,
    }),
  });

  const { newRating } = await res.json();
  ratingValue.innerText = parseFloat(newRating).toFixed(1);
  updateAlreadyRatedPosts(postId);
  updateProgress(parseFloat(newRating));
  hideStars();
};

window.addEventListener("DOMContentLoaded", () => {
  const rating = document.querySelector(".rating");
  const starBtns = document.querySelectorAll(".rating__btns-wrapper .star");

  if (!rating) return;

  const { postId } = rating.dataset;

  handleNoStorageData();

  if (checkIfAlreadyRated(postId)) {
    hideStars();
  } else {
    starBtns.forEach((starBtn, i) => {
      starBtn.addEventListener("mouseenter", () => {
        handleStarHover(starBtn, starBtns);
      });

      starBtn.addEventListener("mouseleave", () => {
        clearStarsHover(starBtns);
      });

      starBtn.addEventListener("click", () => {
        handleStarClick(starBtn);
      });
    });
  }
});
