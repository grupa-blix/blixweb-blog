import interact from "interactjs";

let responseId = 0;

const clearForm = () => {
  const form = document.querySelector(".comments-bottomsheet form");
  form.querySelector("input[name=name]").value = "";
  form.querySelector("textarea").value = "";
};

const unwrapForm = () => {
  if (window.innerWidth >= 1200) return;
  const leftCol = document.querySelector(".comments-bottomsheet .left-col");
  const headerWrapper = document.querySelector(".comments-bottomsheet__header-wrapper");
  leftCol.classList.add("left-col--unwrapped");
  headerWrapper.classList.add("extended");
};

const wrapForm = () => {
  if (window.innerWidth >= 1200) return;
  const leftCol = document.querySelector(".comments-bottomsheet .left-col");
  const headerWrapper = document.querySelector(".comments-bottomsheet__header-wrapper");
  leftCol.classList.remove("left-col--unwrapped");
  headerWrapper.classList.remove("extended");
  clearRespond();
};

const openCommentsBottomsheet = () => {
  const commentsBottomsheet = document.querySelector(".comments-bottomsheet");
  commentsBottomsheet.classList.add("opened");
  document.querySelector("html").classList.add("no-scroll");
};

const closeCommentsBottomsheet = () => {
  const commentsBottomsheet = document.querySelector(".comments-bottomsheet");
  commentsBottomsheet.classList.remove("opened");
  document.querySelector("html").classList.remove("no-scroll");

  wrapForm();
};

const isUserAllowed = async (token) => {
  const formData = new FormData();
  formData.append("action", "recaptcha");
  formData.append("recaptcha", token);

  const res = await fetch(myAjax.ajaxurl, {
    method: "post",
    body: formData,
  });

  const data = await res.json();
  const { score } = data;

  if (score > 0.3) return true;
  return false;
};

const handleSubmitSuccess = () => {
  const messageBox = document.querySelector(".message-box");
  const success = document.querySelector(".message-box__success");

  messageBox.classList.remove("d-none");
  success.classList.remove("d-none");
};

const handleSubmitError = () => {
  const messageBox = document.querySelector(".message-box");
  const error = document.querySelector(".message-box__error");

  messageBox.classList.remove("d-none");
  error.classList.remove("d-none");
};

const submitForm = () => {
  grecaptcha.ready(function () {
    grecaptcha.execute("6LfyoAYoAAAAAOiSqybJkDqsng6R4U0PlzQCKQzI", { action: "submit" }).then(async function (token) {
      const isAllowed = await isUserAllowed(token);

      if (isAllowed) {
        const form = document.querySelector(".comments-bottomsheet form");
        const { postId } = form.dataset;
        const formData = new FormData();

        formData.append("action", "recipe_comment");
        formData.append("comment_post_ID", postId);
        formData.append("comment_author", form.querySelector("input[name=name]").value);
        formData.append("comment_content", form.querySelector("textarea").value);
        formData.append("comment_parent", responseId);

        const res = await fetch(myAjax.ajaxurl, {
          method: "post",
          body: formData,
        });

        const { status } = res;

        clearForm();

        if (status === 200) handleSubmitSuccess();
        else handleSubmitError();
      } else {
        handleSubmitError();
      }
    });
  });
};

const handleRespond = (btn) => {
  const comment = btn.closest(".single-comment");
  const { commentId, commentAuthor } = comment.dataset;
  const messageBox = document.querySelector(".message-box");
  const response = document.querySelector(".message-box__response");
  const responseAuthor = document.querySelector(".response__author");

  responseAuthor.innerText = commentAuthor;
  messageBox.classList.remove("d-none");
  response.classList.remove("d-none");

  responseId = commentId;
  unwrapForm();
};

const clearRespond = () => {
  const messageBox = document.querySelector(".message-box");
  const response = document.querySelector(".message-box__response");
  const success = document.querySelector(".message-box__success");

  messageBox.classList.add("d-none");
  response.classList.add("d-none");
  success.classList.add("d-none");

  responseId = 0;
};

const handleResizability = () => {
  interact(".comments-bottomsheet__content").resizable({
    edges: {
      top: true,
    },
    listeners: {
      move(event) {
        const eventTarget = event.target;
        let { y } = eventTarget.dataset;

        y = (parseFloat(y) || 0) + event.deltaRect.top;

        Object.assign(eventTarget.style, {
          height: `${event.rect.height}px`,
        });

        Object.assign(eventTarget.dataset, { y });

        if (event.rect.height / window.innerHeight < 0.4) {
          closeCommentsBottomsheet();
          Object.assign(eventTarget.style, {
            height: `80%`,
          });
          delete eventTarget.dataset.y;
        }
      },
    },
  });
};

window.addEventListener("DOMContentLoaded", () => {
  const comments = document.querySelector(".comments");

  if (!comments) return;

  const detailsComments = document.querySelector(".data__comments");
  const commentsBackBtn = document.querySelector(".comments-bottomsheet .back-btn");
  const commentsCloseBtn = document.querySelector(".comments-bottomsheet .close-btn");
  const commentsBg = document.querySelector(".comments-bottomsheet__bg");
  const commentsTextarea = document.querySelector(".comments-bottomsheet textarea");
  const commentsInput = document.querySelector(".comments-bottomsheet input");
  const commentsForm = document.querySelector(".comments-bottomsheet form");
  const respondBtns = document.querySelectorAll(".single-comment__respond");
  const responseClearBtn = document.querySelector(".response__clear-btn");

  comments.addEventListener("click", openCommentsBottomsheet);
  if (detailsComments) detailsComments.addEventListener("click", openCommentsBottomsheet);
  commentsBackBtn.addEventListener("click", wrapForm);
  commentsCloseBtn.addEventListener("click", closeCommentsBottomsheet);
  commentsBg.addEventListener("click", closeCommentsBottomsheet);
  commentsTextarea.addEventListener("focus", unwrapForm);
  commentsForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (commentsTextarea.value.length < 5 || commentsInput.value.length < 3) return;
    clearRespond();
    submitForm();
  });
  respondBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      clearRespond();
      handleRespond(btn);
    });
  });
  responseClearBtn.addEventListener("click", clearRespond);

  handleResizability();
});
