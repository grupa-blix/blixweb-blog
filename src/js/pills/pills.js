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
  if (dx !== 0) trackScrolled = true;
  handleTrackPositionChange(currentTrack);
};

const pillsPointerUpHandler = (e) => {
  document.removeEventListener("pointermove", pillsPointerMoveHandler);
  document.removeEventListener("pointerup", pillsPointerUpHandler);

  currentTrack = null;
  unsetTrackScrolled();
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

const selectPill = (pill) => {
  const pillsWrapper = pill.closest(".pills__track");
  const otherPills = pillsWrapper.querySelectorAll(".pill");

  otherPills.forEach((otherPill) => {
    otherPill.classList.remove("active");
  });

  pill.classList.add("active");
};

const handlePillClick = (pill) => {
  if (!getTrackScrolled()) {
    if (pill.href) {
      window.location.href = pill.href;
    } else {
      selectPill(pill);
    }
  } else {
    unsetTrackScrolled();
  }
};

const initSinglePill = (pillsTrack) => {
  const pills = pillsTrack.querySelectorAll(".pill");
  const pillsButtonRight = pillsTrack.querySelector(".pills__button--right");
  const pillsButtonLeft = pillsTrack.querySelector(".pills__button--left");

  pills.forEach((pill) => {
    pill.addEventListener("click", (e) => {
      e.preventDefault();
      handlePillClick(pill);
    });
  });

  if (pillsTrack.scrollWidth > pillsTrack.offsetWidth) {
    pillsTrack.addEventListener("pointerdown", pillsPointerDownHandler);
    pillsTrack.addEventListener("scroll", handleTrackPositionChange);
  }

  if (pillsButtonRight) {
    handleButtonDisplay(pillsButtonRight);
    pillsButtonRight.addEventListener("pointerdown", (e) => e.stopPropagation);
    pillsButtonRight.addEventListener("pointerup", (e) => handleTrackButtonClick(e, true));
  }

  if (pillsButtonLeft) {
    pillsButtonLeft.addEventListener("pointerdown", (e) => e.stopPropagation);
    pillsButtonLeft.addEventListener("pointerup", (e) => handleTrackButtonClick(e, false));
  }

  window.addEventListener("resize", () => {
    handleButtonDisplay(pillsButtonLeft);
    handleButtonDisplay(pillsButtonRight);
  });
};

const initPills = (track) => {
  if (track) {
    initSinglePill(track);
  } else {
    const pillsTracks = document.querySelectorAll(".pills__track");

    pillsTracks.forEach((pillsTrack) => {
      initSinglePill(pillsTrack);
    });
  }
};

window.addEventListener("DOMContentLoaded", () => {
  initPills();
});

export { initPills, getTrackScrolled, unsetTrackScrolled };
