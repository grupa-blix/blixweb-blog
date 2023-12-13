const endpoint =
  window.location.origin === "https://blix.pl" ? "https://blix.pl/blog/wp-json/blog/like/" : "/wp-json/blog/like/";
const handleNoStorageData = () => {
  const likedPosts = JSON.parse(localStorage.getItem("likedPosts"));
  if (!likedPosts) localStorage.setItem("likedPosts", JSON.stringify([]));
};

const handleThumbDisplay = () => {
  const likes = document.querySelector(".likes");
  const detailsLikes = document.querySelector(".details__likes");
  const { postId } = likes.dataset;
  const isAlreadyLiked = checkIfAlreadyLiked(postId);

  if (isAlreadyLiked) {
    likes.classList.add("liked");
    detailsLikes.classList.add("liked");
  } else {
    likes.classList.remove("liked");
    detailsLikes.classList.remove("liked");
  }
};

const handleLikesCountDisplay = () => {
  const likesValue = document.querySelector(".likes .value");
  const detailsLike = document.querySelector(".details__likes");

  if (parseInt(likesValue.innerText) !== 0) {
    likesValue.classList.remove("hidden");
    detailsLike.classList.remove("hidden");
  } else {
    likesValue.classList.add("hidden");
    detailsLike.classList.add("hidden");
  }
};

const checkIfAlreadyLiked = (postId) => {
  const likedPosts = localStorage.getItem("likedPosts");
  return likedPosts.includes(postId);
};

const updateAlreadyLikedPosts = (postId, isAlreadyLiked) => {
  const likedPosts = JSON.parse(localStorage.getItem("likedPosts"));

  if (isAlreadyLiked) {
    likedPosts.splice(likedPosts.indexOf(postId), 1);
  } else {
    likedPosts.push(postId);
  }

  localStorage.setItem("likedPosts", JSON.stringify(likedPosts));
};

const handleLikesClick = async () => {
  const likes = document.querySelector(".likes");
  const detailsLikes = document.querySelector(".details__likes");
  const { postId } = likes.dataset;
  const isAlreadyLiked = checkIfAlreadyLiked(postId);
  let modifier = 1;

  if (isAlreadyLiked) modifier = -1;

  const res = await fetch(endpoint, {
    method: "POST",
    body: JSON.stringify({
      postId,
      modifier,
    }),
  });

  const { newValue } = await res.json();
  likes.querySelector(".value").innerText = newValue;
  detailsLikes.querySelector("span").innerText = newValue;
  updateAlreadyLikedPosts(postId, isAlreadyLiked);
  handleThumbDisplay();
  handleLikesCountDisplay();
};

window.addEventListener("DOMContentLoaded", () => {
  const likes = document.querySelector(".likes");

  if (!likes) return;

  const detailsLikes = document.querySelector(".main__details .details__likes");

  handleNoStorageData();
  handleThumbDisplay();
  handleLikesCountDisplay();

  likes.addEventListener("click", handleLikesClick);
  detailsLikes.addEventListener("click", () => {
    likes.click();
  });
});
