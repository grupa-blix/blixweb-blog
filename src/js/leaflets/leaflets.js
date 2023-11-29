import Swiper from "swiper";
import { Scrollbar, Navigation, Mousewheel, FreeMode, Manipulation } from "swiper/modules";
import { isDesktop, getLeafletUrl } from "../utils";
import { addAdultOverlayClickHandlers, isUserAdult } from "../adult-content/adult-content";

let carousels = [];
let newestLeaflets = [];
let promotedLeaflets = [];

const setLeafletAnalytics = (leaflet, index, isLast) => {
  const sectionLabel = leaflet.closest(".swiper").dataset.gaLabel;
  const { leafletId, brandId } = leaflet.dataset;
  const leafletName = leaflet.querySelector(".leaflet__leaflet-name").innerText;
  const brandName = leaflet.querySelector(".leaflet__brand-name").innerText;
  leaflet.addEventListener("click", () => {
    dataLayer.push(function () {
      this.reset();
    });
    dataLayer.push({
      event: "BLOG_LEAFLET_CLICK",
      sectionLabel,
      leafletId,
      brandId,
      leafletName,
      brandName,
      position: (index + 1).toString(),
      isLast: isLast.toString(),
    });
  });
};

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

const adultContent = (brandThumbnail) => {
  const overlay = document.createElement("div");
  overlay.classList.add("adult-content-overlay");
  overlay.innerHTML = `
      <img src="${brandThumbnail}" class="adult-content-overlay__img" loading="lazy" />
      <span class="adult-content-overlay__label">Zawartość dla osób pełnoletnich</span>
      <button class="adult-content-overlay__button button button--green">Odblokuj</button>
  `;

  return overlay;
};

const setLeaflet = (leaflet, currentLeafletData) => {
  const leafletLink = leaflet.querySelector(".leaflet__link");
  const leafletCoverImg = leaflet.querySelector(".leaflet__cover img");
  const leafletAvailability = leaflet.querySelector(".leaflet__availability");
  const leafletAvailabilityLabel = leaflet.querySelector(".availability__label");
  const leafletBrandLogoImg = leaflet.querySelector(".leaflet__brand-logo");
  const leafletBrandName = leaflet.querySelector(".leaflet__brand-name");
  const leafletName = leaflet.querySelector(".leaflet__leaflet-name");
  const { id, brand, name, availability, thumbnail, hasAlcohol } = currentLeafletData;
  const { id: brandId, slug, name: brandName, thumbnail: brandThumbnail } = brand;
  const { class: availabilityClass, message } = availability;
  const leafletUrl = getLeafletUrl(slug, id);

  leaflet.dataset.leafletId = id;
  leaflet.dataset.brandId = brandId;
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

  if (hasAlcohol && !isUserAdult()) {
    leaflet.prepend(adultContent(brandThumbnail));
    addAdultOverlayClickHandlers();
  }

  setTimeout(() => leaflet.classList.remove("loading"), 200);
};

window.addEventListener("DOMContentLoaded", async () => {
  const leafletsCarousels = document.querySelectorAll(".section__swiper--leaflets");
  const isNewestCarousel = document.querySelector(".section__swiper--leaflets[data-leaflets=newest]");

  leafletsCarousels.forEach(async (carousel) => {
    const isSmall = carousel.classList.contains("section__swiper--leaflets-small");
    const swiper = new Swiper(carousel, isSmall ? { ...options, slidesPerView: setSlidesPerViewSmall() } : options);

    swiper.on("resize", () => {
      swiper.params.slidesPerView = isSmall ? setSlidesPerViewSmall() : setSlidesPerView();
    });

    swiper.init();
    carousels.push(swiper);
  });

  promotedLeaflets = await getPromotedLeaflets();

  if (isNewestCarousel) {
    newestLeaflets = await getNewestLeaflets();
  }

  leafletsCarousels.forEach(async (carousel, i) => {
    const currentCarousel = carousels[i];
    const { leaflets: carouselLeaflets, brand, category } = carousel.dataset;
    let leafletsData;

    switch (carouselLeaflets) {
      case "newest":
        leafletsData = newestLeaflets;
        break;
      case "promoted":
        leafletsData = promotedLeaflets;
        break;
      case "brand":
        leafletsData = await getBrandLeaflets(brand);
        break;
      case "category":
        leafletsData = await getCategoryLeaflets(category);
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
      setLeafletAnalytics(leaflet, j, j === leaflets.length - 1);
    });
  });
});
