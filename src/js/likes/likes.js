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
  const formData = new FormData();

  formData.append("action", "article_like");
  formData.append("postId", postId);

  if (isAlreadyLiked) {
    formData.append("newValue", -1);
  } else {
    formData.append("newValue", 1);
  }

  const res = await fetch(myAjax.ajaxurl, {
    method: "post",
    body: formData,
  });

  const newCount = await res.json();
  likes.querySelector(".value").innerText = newCount;
  detailsLikes.querySelector("span").innerText = newCount;
  updateAlreadyLikedPosts(postId, isAlreadyLiked);
  handleThumbDisplay();
  handleLikesCountDisplay();
};

window.addEventListener("DOMContentLoaded", () => {
  const likes = document.querySelector(".likes");

  handleNoStorageData();
  handleThumbDisplay();
  handleLikesCountDisplay();

  likes.addEventListener("click", handleLikesClick);
});
