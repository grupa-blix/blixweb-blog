import iconClose from "../../img/x-icon.svg";

const getAdultCookie = () => {
  const cookies = document.cookie.split(";");
  const adultCookie = cookies.find((el) => {
    const key = el.split("=")[0];
    return key.trim() === "isUserAdult";
  });

  return adultCookie;
};

const setAdultCookie = (value) => {
  const adultCookie = getAdultCookie();
  const d = new Date();
  let adultCookieValue;

  if (value) {
    adultCookieValue = value;
  } else if (adultCookie) {
    const currentValue = adultCookie.split("=")[1];
    adultCookieValue = currentValue;
  } else {
    return;
  }

  d.setTime(d.getTime() + 400 * 24 * 60 * 60 * 1000);
  document.cookie = `isUserAdult=${adultCookieValue}; expires=${d.toUTCString()}; path=/`;
};

const isUserAdult = () => {
  const adultCookie = getAdultCookie();

  if (adultCookie && adultCookie.split("=")[1] === "true") {
    return true;
  }

  return false;
};

const removeAdultOverlays = () => {
  const adultOverlays = document.querySelectorAll(".adult-content-overlay");
  adultOverlays.forEach((overlay) => {
    const parent = overlay.parentElement;
    parent.removeChild(overlay);
  });
};

const removeAdultModalFromDOM = () => {
  const adultModal = document.querySelector(".adult-content-modal");
  document.body.removeChild(adultModal);
};

const handleAdultConfirm = () => {
  setAdultCookie(true);
  removeAdultModalFromDOM();
  removeAdultOverlays();
};

const setModalListeners = () => {
  const overlay = document.querySelector(".adult-content-modal__overlay");
  const closeBtn = document.querySelector(".adult-content-modal__btn-close");
  const leaveBtn = document.querySelector(".adult-content-modal__btn-leave");
  const confirmBtn = document.querySelector(".adult-content-modal__btn-confirm");

  overlay.addEventListener("click", removeAdultModalFromDOM);
  closeBtn.addEventListener("click", removeAdultModalFromDOM);
  leaveBtn.addEventListener("click", removeAdultModalFromDOM);
  confirmBtn.addEventListener("click", handleAdultConfirm);
};

const appendAdultModalToDOM = (e) => {
  e.preventDefault();
  e.stopImmediatePropagation();

  const modal = document.createElement("div");
  modal.classList.add("adult-content-modal");
  modal.innerHTML = `
    <div class="adult-content-modal__overlay"></div>
    <div class="adult-content-modal__card">
      <button class="adult-content-modal__btn-close"><img src="${iconClose}" /></button>
      <h2>Potwierdź swój wiek</h2>
      <p>Gazetka zawiera ofertę alkoholową i jest przeznaczona tylko dla osób pełnoletnich. Potwierdzam, że jestem osobą pełnoletnią oraz wyrażam intencję uzyskiwania dostępu, zapoznawania się oraz otrzymywania informacji handlowych dotyczących napojów alkoholowych.</p>
      <div class="adult-content-modal__btns-wrapper">
        <button class="button adult-content-modal__btn-leave ga-adultcontent-popup-no">Wychodzę</button>
        <button class="button button--green adult-content-modal__btn-confirm ga-adultcontent-popup-yes">Potwierdzam</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  setModalListeners();
};

const addAdultOverlayClickHandlers = () => {
  const adultOverlays = document.querySelectorAll(".adult-content-overlay");
  adultOverlays.forEach((overlay) => {
    overlay.addEventListener("click", appendAdultModalToDOM);
  });
};

const handleAdultContent = () => {
  setAdultCookie();
  addAdultOverlayClickHandlers();
};

export { handleAdultContent, addAdultOverlayClickHandlers, isUserAdult };
