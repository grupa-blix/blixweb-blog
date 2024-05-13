import { DESKTOP_BREAKPOINT, LARGE_DESKTOP_BREAKPOINT, TABLET_BREAKPOINT } from "./constants";

const fancyUrl = "https://fancy.blix.app/";
const blixUrl = "https://blix.pl/";

const isProd = () => window.location.host === "blix.pl";

const isMobile = () => window.innerWidth < TABLET_BREAKPOINT;

const isTablet = () => TABLET_BREAKPOINT < window.innerWidth && window.innerWidth < DESKTOP_BREAKPOINT;

const isDesktop = () => window.innerWidth >= DESKTOP_BREAKPOINT;

const isDesktopLarge = () => window.innerWidth >= LARGE_DESKTOP_BREAKPOINT;

const isGrid = (element) => element.dataset.view === "grid";

const clearDataLayer = () => {
  dataLayer.push(function () {
    this.reset();
  });
};

const getTopbarHeight = () => {
  const topbar = document.querySelector(".topbar");

  return topbar ? topbar.offsetHeight : 0;
};

const getHeaderHeight = () => {
  const navbar = document.querySelector(".navbar");

  return navbar && isMobile() ? navbar.offsetHeight : 0;
};

const getLeafletUrl = (brandSlug, leafletId) => {
  return `${blixUrl}sklep/${brandSlug}/gazetka/${leafletId}`;
};

const getBrandUrl = (brandSlug) => {
  return `${blixUrl}sklep/${brandSlug}`;
};

const getProductUrl = (productSlug, productHash) => {
  return `${blixUrl}produkt/${productSlug},${productHash}`;
};

const detectSwipe = (flipType, direction) => {
  dataLayer.push({
    event: "LEAFLET_PAGE_CHANGE",
    placement: "blog",
    flipType,
    direction,
  });

  clearDataLayer();
};

const handleScrollSwipe = (swiper) => {
  const currentIndex = swiper.realIndex;
  const prevIndex = swiper.previousRealIndex;
  const slidesLength = swiper.slides.length;
  const startEndTransition = currentIndex === slidesLength - 1 && prevIndex === 0;
  const endStartTransition = currentIndex === 0 && prevIndex === slidesLength - 1;
  let direction = "forward";

  if ((currentIndex < prevIndex && !endStartTransition) || startEndTransition) {
    direction = "backward";
  }

  detectSwipe("scroll", direction);
};

const isAppleDevice = () => (navigator ? /iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent) : false);

export {
  isProd,
  isMobile,
  isTablet,
  isDesktop,
  isDesktopLarge,
  isGrid,
  getTopbarHeight,
  getHeaderHeight,
  getLeafletUrl,
  getBrandUrl,
  getProductUrl,
  detectSwipe,
  handleScrollSwipe,
  clearDataLayer,
  isAppleDevice,
};
