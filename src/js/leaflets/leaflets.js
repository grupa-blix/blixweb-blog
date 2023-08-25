import Swiper from "swiper";
import { Scrollbar, Navigation, Mousewheel, FreeMode, Manipulation } from "swiper/modules";
import { isDesktop, getLeafletUrl, getBrandUrl } from "../utils";

let carousels = [];
let newestLeaflets, promotedLeaflets;

const getNewestLeaflets = async () => {
  const res = await fetch("https://fancy.blix.app/api/blog/leaflets/new");
  const data = await res.json();
  return data.leaflets;
};

const getPromotedLeaflets = async () => {
  const res = await fetch("https://fancy.blix.app/api/blog/leaflets/promoted");
  const data = await res.json();
  return data.PromotedPart2;
};

const leafletSizeData = {
  mobile: {
    defaultWidth: 150,
    spaceBetween: 12,
  },
  desktop: {
    defaultWidth: 282,
    spaceBetween: 24,
  },
};

const setSlidesPerView = () => {
  const containerMaxWidth = window.innerWidth > 1248 ? 1248 : window.innerWidth;
  const sizeData = isDesktop() ? leafletSizeData.desktop : leafletSizeData.mobile;
  const { defaultWidth, spaceBetween } = sizeData;

  return parseInt((containerMaxWidth - 48 + spaceBetween) / (defaultWidth + spaceBetween), 10);
};

const desktopOptions = {
  freeMode: true,
  mousewheel: {
    forceToAxis: true,
  },
};

const options = {
  modules: [Scrollbar, Navigation, Mousewheel, FreeMode, Manipulation],
  init: false,
  direction: "horizontal",
  draggable: true,
  scrollbar: {
    el: ".swiper-scrollbar",
    draggable: true,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  spaceBetween: 12,
  slidesPerView: setSlidesPerView(),
  breakpoints: {
    992: {
      spaceBetween: 24,
    },
  },
  ...(isDesktop() && desktopOptions),
};

const setCarouselSlides = (currentCarousel, leafletsData) => {
  let indexToRemoveArray = [];

  currentCarousel.slides.forEach((slide, index) => {
    if (index >= leafletsData.length) indexToRemoveArray.push(index);
  });

  currentCarousel.removeSlide(indexToRemoveArray);
};

const setLeaflet = (leaflet, currentLeafletData) => {
  const leafletCoverLink = leaflet.querySelector(".leaflet__cover-link");
  const leafletCoverImg = leaflet.querySelector(".leaflet__cover img");
  const leafletAvailability = leaflet.querySelector(".leaflet__availability");
  const leafletAvailabilityLabel = leaflet.querySelector(".availability__label");
  const leafletBrandLogoLink = leaflet.querySelector(".leaflet__brand-logo-link");
  const leafletBrandLogoImg = leaflet.querySelector(".leaflet__brand-logo");
  const leafletBrandNameLink = leaflet.querySelector(".leaflet__brand-name-link");
  const leafletBrandName = leaflet.querySelector(".leaflet__brand-name");
  const leafletNameLink = leaflet.querySelector(".leaflet__leaflet-name-link");
  const leafletName = leaflet.querySelector(".leaflet__leaflet-name");
  const { id, brand, name, availability, thumbnail } = currentLeafletData;
  const { slug, name: brandName, thumbnail: brandThumbnail } = brand;
  const { class: availabilityClass, message } = availability;
  const leafletUrl = getLeafletUrl(slug, id);
  const brandUrl = getBrandUrl(slug);

  leafletCoverLink.href = leafletUrl;
  leafletCoverLink.title = name;
  leafletCoverImg.src = thumbnail;
  leafletCoverImg.alt = name;
  leafletCoverImg.title = name;
  leafletAvailability.classList.add(availabilityClass);
  leafletAvailabilityLabel.innerText = message;
  leafletBrandLogoLink.href = brandUrl;
  leafletBrandLogoLink.title = brandName;
  leafletBrandLogoImg.src = brandThumbnail;
  leafletBrandLogoImg.alt = brandName;
  leafletBrandNameLink.href = brandUrl;
  leafletBrandNameLink.title = brandName;
  leafletBrandName.innerText = brandName;
  leafletNameLink.href = leafletUrl;
  leafletNameLink.title = name;
  leafletName.innerText = name;

  setTimeout(() => leaflet.classList.remove("loading"), 200);
};

window.addEventListener("DOMContentLoaded", async () => {
  const leafletsCarousels = document.querySelectorAll(".section__swiper--leaflets");

  leafletsCarousels.forEach((carousel) => {
    const swiper = new Swiper(carousel, options);

    swiper.on("resize", () => {
      swiper.params.slidesPerView = setSlidesPerView();
    });

    swiper.init();
    carousels.push(swiper);
  });

  newestLeaflets = await getNewestLeaflets();
  promotedLeaflets = await getPromotedLeaflets();

  leafletsCarousels.forEach((carousel, i) => {
    const currentCarousel = carousels[i];
    const leafletsData = carousel.dataset.leaflets === "newest" ? newestLeaflets : promotedLeaflets;
    setCarouselSlides(currentCarousel, leafletsData);

    const leaflets = carousel.querySelectorAll(".leaflet");
    leaflets.forEach((leaflet, j) => {
      const currentLeafletData = leafletsData[j];
      setLeaflet(leaflet, currentLeafletData);
    });
  });
});
