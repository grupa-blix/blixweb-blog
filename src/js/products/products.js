import Swiper from "swiper";
import { Scrollbar, Navigation, Mousewheel, FreeMode, Manipulation } from "swiper/modules";
import { getProductUrl, isDesktop } from "../utils";
import { addAdultOverlayClickHandlers, isUserAdult } from "../adult-content/adult-content";

let carousels = [];

const setProductAnalytics = (product, index, isLast) => {
  const sectionLabel = product.closest(".swiper").dataset.gaLabel;
  product.addEventListener("click", () => {
    dataLayer.push({
      event: "BLOG_PRODUCT_CLICK",
      sectionLabel,
      position: index + 1,
      isLast,
    });
  });
};

const getBestProducts = async () => {
  const res = await fetch("https://blix.pl/api/blog/offers/best");
  const data = await res.json();
  return data.offers;
};

const productSizeData = {
  mobile: {
    defaultWidth: 150,
    spaceBetween: 12,
  },
  desktop: {
    defaultWidth: 180,
    spaceBetween: 24,
  },
};

const setSlidesPerView = () => {
  const containerMaxWidth = window.innerWidth > 1248 ? 1248 : window.innerWidth;
  const sizeData = isDesktop() ? productSizeData.desktop : productSizeData.mobile;
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

const setCarouselSlides = (currentCarousel, productsData) => {
  let indexToRemoveArray = [];

  currentCarousel.slides.forEach((slide, index) => {
    if (index >= productsData.length) indexToRemoveArray.push(index);
  });

  currentCarousel.removeSlide(indexToRemoveArray);
};

const adultContent = () => {
  const overlay = document.createElement("div");
  overlay.classList.add("adult-content-overlay");
  overlay.innerHTML = `
      <span class="adult-content-overlay__label">Zawartość dla osób pełnoletnich</span>
      <button class="adult-content-overlay__button button button--green">Odblokuj</button>
  `;

  return overlay;
};

const setProduct = (product, currentProductData) => {
  const productLink = product.closest(".product__link");
  const productImg = product.querySelector(".product__img");
  const productName = product.querySelector(".product__name");
  const productPrice = product.querySelector(".product__price");
  const { thumbnail, name, slug, hash, price, hasAlcohol } = currentProductData;

  productLink.href = getProductUrl(slug, hash);
  productImg.src = thumbnail;
  productImg.alt = name;
  productName.innerText = name;
  productPrice.innerText = `${parseFloat(price / 100)
    .toFixed(2)
    .replace(".", ",")} zł`;

  if (hasAlcohol && !isUserAdult()) {
    product.prepend(adultContent());
  }

  setTimeout(() => product.classList.remove("loading"), 200);
};

window.addEventListener("DOMContentLoaded", async () => {
  const productsCarousels = document.querySelectorAll(".section__swiper--products");

  productsCarousels.forEach((carousel) => {
    const swiper = new Swiper(carousel, options);

    swiper.on("resize", () => {
      swiper.params.slidesPerView = setSlidesPerView();
    });

    swiper.init();
    carousels.push(swiper);
  });

  const bestProducts = await getBestProducts();

  productsCarousels.forEach((carousel, i) => {
    const currentCarousel = carousels[i];
    setCarouselSlides(currentCarousel, bestProducts);

    const products = carousel.querySelectorAll(".product");
    products.forEach((product, j) => {
      const currentProductData = bestProducts[j];
      setProduct(product, currentProductData);
      setProductAnalytics(product, j, j === products.length - 1);
    });
  });

  addAdultOverlayClickHandlers();
});
