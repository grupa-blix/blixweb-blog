import { clearDataLayer } from "../utils";
import { setCookie } from "../cookies";

const appPromoBanner = document.querySelector(".app-promo");

const getVariation = () => {
  const { variation } = appPromoBanner.dataset;
  return variation;
};

const sendViewEvent = () => {
  const variation = getVariation();

  dataLayer.push({
    event: "AppPromo-Bottomsheet-View",
    variation,
    placement: "blog",
  });

  clearDataLayer();
};

const sendClickEvent = (action) => {
  const variation = getVariation();

  dataLayer.push({
    event: "AppPromo-Bottomsheet-Click",
    action,
    variation,
    placement: "blog",
  });

  clearDataLayer();
};

const handleBannerView = () => {
  sendViewEvent();
  setCookie("app-promo-displayed", true, true, 86400000);
};

const appBtnClick = () => {
  appPromoBanner.parentElement.removeChild(appPromoBanner);
  sendClickEvent("buttonclick_store");
};

const webBtnClick = () => {
  appPromoBanner.parentElement.removeChild(appPromoBanner);
  sendClickEvent("buttonclick_web");
};

const addButtonHandlers = () => {
  const appBtn = appPromoBanner.querySelector(".button--app");
  const webBtn = appPromoBanner.querySelector(".button--web");

  appBtn.addEventListener("click", appBtnClick);
  webBtn.addEventListener("click", webBtnClick);
};

const showBannerWithDelay = () => {
  setTimeout(() => {
    appPromoBanner.dataset.visible = "true";
    handleBannerView();
    addButtonHandlers();
  }, 7000);
};

window.addEventListener("DOMContentLoaded", () => {
  if (appPromoBanner) {
    const { visible } = appPromoBanner.dataset;

    if (visible === "false") {
      showBannerWithDelay();
    } else {
      handleBannerView();
      addButtonHandlers();
    }
  }
});
