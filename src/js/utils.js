import { DESKTOP_BREAKPOINT, LARGE_DESKTOP_BREAKPOINT, TABLET_BREAKPOINT } from "./constants";

const fancyUrl = "https://fancy.blix.app/";
const blixUrl = "https://blix.pl/";

const isProd = () => window.location.host === "blix.pl";

const isMobile = () => window.innerWidth < TABLET_BREAKPOINT;

const isTablet = () => TABLET_BREAKPOINT < window.innerWidth && window.innerWidth < DESKTOP_BREAKPOINT;

const isDesktop = () => window.innerWidth >= DESKTOP_BREAKPOINT;

const isDesktopLarge = () => window.innerWidth >= LARGE_DESKTOP_BREAKPOINT;

const isGrid = (element) => element.dataset.view === "grid";

const getTopbarHeight = () => {
  const topbar = document.querySelector(".topbar");

  return topbar ? topbar.offsetHeight : 0;
};

const getHeaderHeight = () => {
  const navbar = document.querySelector(".navbar");

  return navbar && isMobile() ? navbar.offsetHeight : 0;
};

const getLeafletUrl = (brandSlug, leafletId) => {
  return `${fancyUrl}sklep/${brandSlug}/gazetka/${leafletId}`;
};

const getBrandUrl = (brandSlug) => {
  return `${fancyUrl}sklep/${brandSlug}`;
};

const getProductUrl = (productSlug, productHash) => {
  return `${fancyUrl}produkt/${productSlug},${productHash}`;
};

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
};
