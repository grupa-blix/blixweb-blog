const pillsTracks = document.querySelectorAll(".pills__track");
let currentTrack = null;
let trackScrolled = false;

const getTrackScrolled = () => trackScrolled;
const unsetTrackScrolled = () => {
  trackScrolled = false;
};

const setCurrentTrack = (e) => {
  if (e.target.classList.contains("pills__track")) {
    currentTrack = e.target;
  } else {
    currentTrack = e.target.closest(".pills__track");
  }
};

const getTrackScroll = () => {
  const { scrollWidth, offsetWidth, scrollLeft } = currentTrack;
  return scrollLeft / (scrollWidth - offsetWidth);
};

const getTrackPosition = () => {
  const { left, x } = currentTrack.dataset;
  return {
    left,
    x,
  };
};

const setTrackPosition = (e) => {
  currentTrack.dataset.left = currentTrack.scrollLeft;
  currentTrack.dataset.x = e.clientX;
};

const setOverlaysOpacity = (value) => {
  const pillsOverlayLeft = currentTrack.querySelector(".pills__overlay--left");
  const pillsOverlayRight = currentTrack.querySelector(".pills__overlay--right");

  if (value > 0.01) {
    pillsOverlayLeft.classList.add("visible");
  } else {
    pillsOverlayLeft.classList.remove("visible");
  }

  if (value < 0.99) {
    pillsOverlayRight.classList.add("visible");
  } else {
    pillsOverlayRight.classList.remove("visible");
  }
};

const handleTrackPositionChange = (e) => {
  if (!currentTrack) setCurrentTrack(e);
  const scrollValue = getTrackScroll();

  if (Number.isNaN(scrollValue)) {
    setOverlaysOpacity(0);
  } else {
    setOverlaysOpacity(scrollValue);
  }
};

const pillsPointerMoveHandler = (e) => {
  const position = getTrackPosition(currentTrack);
  const dx = e.clientX - position.x;
  currentTrack.scrollLeft = position.left - dx;
  trackScrolled = true;
  handleTrackPositionChange(currentTrack);
};

const pillsPointerUpHandler = (e) => {
  document.removeEventListener("pointermove", pillsPointerMoveHandler);
  document.removeEventListener("pointerup", pillsPointerUpHandler);

  currentTrack = null;
};

const pillsPointerDownHandler = (e) => {
  setCurrentTrack(e);
  setTrackPosition(e);

  document.addEventListener("pointermove", pillsPointerMoveHandler);
  document.addEventListener("pointerup", pillsPointerUpHandler);
};

const handleButtonDisplay = (button) => {
  const track = button.closest(".pills__track");
  const pillsOverlayLeft = track.querySelector(".pills__overlay--left");
  const pillsOverlayRight = track.querySelector(".pills__overlay--right");

  if (track.scrollWidth > track.offsetWidth) {
    pillsOverlayRight.classList.add("visible");
  } else {
    pillsOverlayLeft.classList.remove("visible");
    pillsOverlayRight.classList.remove("visible");
  }
};

const handleTrackButtonClick = (e, forward) => {
  setCurrentTrack(e);
  setTrackPosition(e);

  const position = getTrackPosition(currentTrack);
  const positionLeftParsed = parseInt(position.left, 10);
  currentTrack.classList.add("smooth");
  currentTrack.scrollLeft = forward ? positionLeftParsed + 100 : positionLeftParsed - 100;
  handleTrackPositionChange(currentTrack);

  setTimeout(() => {
    currentTrack.classList.remove("smooth");
  }, 200);
};

const handlePillClick = (pill) => {
  if (!getTrackScrolled()) {
    window.location.href = pill.href;
  } else {
    unsetTrackScrolled();
  }
};

window.addEventListener("DOMContentLoaded", () => {
  const pills = document.querySelectorAll(".pill");
  const pillsButtonsRight = document.querySelectorAll(".pills__button--right");
  const pillsButtonsLeft = document.querySelectorAll(".pills__button--left");

  pills.forEach((pill) => {
    pill.addEventListener("click", (e) => {
      e.preventDefault();
      handlePillClick(pill);
    });
  });

  pillsTracks.forEach((track) => {
    if (track.scrollWidth > track.offsetWidth) {
      track.addEventListener("pointerdown", pillsPointerDownHandler);
      track.addEventListener("scroll", handleTrackPositionChange);
    }
  });

  if (pillsButtonsRight) {
    pillsButtonsRight.forEach((buttonRight) => {
      handleButtonDisplay(buttonRight);
      buttonRight.addEventListener("pointerdown", (e) => e.stopPropagation);
      buttonRight.addEventListener("pointerup", (e) => handleTrackButtonClick(e, true));
    });
  }

  if (pillsButtonsLeft) {
    pillsButtonsLeft.forEach((buttonLeft) => {
      buttonLeft.addEventListener("pointerdown", (e) => e.stopPropagation);
      buttonLeft.addEventListener("pointerup", (e) => handleTrackButtonClick(e, false));
    });
  }

  window.addEventListener("resize", () => {
    pillsButtonsLeft.forEach((buttonLeft) => {
      handleButtonDisplay(buttonLeft);
    });

    pillsButtonsRight.forEach((buttonRight) => {
      handleButtonDisplay(buttonRight);
    });
  });
});
