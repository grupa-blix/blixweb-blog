import Swiper from "swiper";
import { Scrollbar, Navigation, Mousewheel, FreeMode, Manipulation } from "swiper/modules";
import { isDesktop, getLeafletUrl } from "../utils";

let carousels = [];
let newestLeaflets = [];
let promotedLeaflets = [];
let brandLeaflets = [];
let categoryLeaflets = [];

const getNewestLeaflets = async () => {
  const res = await fetch("https://blix.pl/api/blog/leaflets/new");
  const data = await res.json();
  return data.leaflets;
};

const getPromotedLeaflets = async () => {
  const res = await fetch("https://blix.pl/api/blog/leaflets/promoted");
  const data = await res.json();
  return [...data.PromotedPart1, ...data.PromotedPart2];
};

const getBrandLeaflets = async (slug) => {
  const res = await fetch("https://blix.pl/api/blog/leaflets/brand/" + slug);
  const data = await res.json();
  return data.leaflets;
};

const getCategoryLeaflets = async (category) => {
  const res = await fetch("https://blix.pl/api/blog/leaflets/category/" + category);
  const data = await res.json();
  return data.leaflets;
};

const leafletSizeData = {
  mobile: {
    defaultWidth: 150,
    spaceBetween: 12,
  },
  desktop: {
    defaultWidth: 180,
    spaceBetween: 24,
  },
  desktopSmall: {
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

const setSlidesPerViewSmall = () => {
  const containerMaxWidth = window.innerWidth > 1248 ? 1248 : window.innerWidth;
  const sizeData = isDesktop() ? leafletSizeData.desktopSmall : leafletSizeData.mobile;
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
  const leafletLink = leaflet.querySelector(".leaflet__link");
  const leafletCoverImg = leaflet.querySelector(".leaflet__cover img");
  const leafletAvailability = leaflet.querySelector(".leaflet__availability");
  const leafletAvailabilityLabel = leaflet.querySelector(".availability__label");
  const leafletBrandLogoImg = leaflet.querySelector(".leaflet__brand-logo");
  const leafletBrandName = leaflet.querySelector(".leaflet__brand-name");
  const leafletName = leaflet.querySelector(".leaflet__leaflet-name");
  const { id, brand, name, availability, thumbnail } = currentLeafletData;
  const { slug, name: brandName, thumbnail: brandThumbnail } = brand;
  const { class: availabilityClass, message } = availability;
  const leafletUrl = getLeafletUrl(slug, id);

  leafletLink.href = leafletUrl;
  leafletLink.title = name;
  leafletCoverImg.src = thumbnail;
  leafletCoverImg.alt = name;
  leafletCoverImg.title = name;
  leafletAvailability.classList.add(availabilityClass);
  leafletAvailabilityLabel.innerText = message;
  leafletBrandLogoImg.src = brandThumbnail;
  leafletBrandLogoImg.alt = brandName;
  leafletBrandName.innerText = brandName;
  leafletName.innerText = name;

  setTimeout(() => leaflet.classList.remove("loading"), 200);
};

window.addEventListener("DOMContentLoaded", async () => {
  const leafletsCarousels = document.querySelectorAll(".section__swiper--leaflets");
  const isNewestCarousel = document.querySelector(".section__swiper--leaflets[data-leaflets=newest]");
  const isBrandCarousel = document.querySelector(".section__swiper--leaflets[data-leaflets=brand]");
  const isCategoryCarousel = document.querySelector(".section__swiper--leaflets[data-leaflets=category]");
  let brandSlug;
  let category;

  leafletsCarousels.forEach(async (carousel) => {
    const isSmall = carousel.classList.contains("section__swiper--leaflets-small");
    const swiper = new Swiper(carousel, isSmall ? { ...options, slidesPerView: setSlidesPerViewSmall() } : options);

    swiper.on("resize", () => {
      swiper.params.slidesPerView = isSmall ? setSlidesPerViewSmall() : setSlidesPerView();
    });

    swiper.init();

    if (carousel.dataset.brand) brandSlug = carousel.dataset.brand;
    if (carousel.dataset.category) category = carousel.dataset.category;

    carousels.push(swiper);
  });

  promotedLeaflets = await getPromotedLeaflets();

  if (isNewestCarousel) {
    newestLeaflets = await getNewestLeaflets();
  }

  if (isBrandCarousel) {
    brandLeaflets = await getBrandLeaflets(brandSlug);
  }

  if (isCategoryCarousel) {
    categoryLeaflets = await getCategoryLeaflets(category);
  }

  leafletsCarousels.forEach((carousel, i) => {
    const currentCarousel = carousels[i];
    const { leaflets: carouselLeaflets } = carousel.dataset;
    let leafletsData;

    switch (carouselLeaflets) {
      case "newest":
        leafletsData = newestLeaflets;
        break;
      case "promoted":
        leafletsData = promotedLeaflets;
        break;
      case "brand":
        leafletsData = brandLeaflets;
        break;
      case "category":
        leafletsData = categoryLeaflets;
        break;
      default:
        break;
    }

    leafletsData = leafletsData.filter((data) => {
      return data.thumbnail != null;
    });

    setCarouselSlides(currentCarousel, leafletsData);

    const leaflets = carousel.querySelectorAll(".leaflet");
    leaflets.forEach((leaflet, j) => {
      const currentLeafletData = leafletsData[j];
      setLeaflet(leaflet, currentLeafletData);
    });
  });
});
