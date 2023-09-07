import Swiper from "swiper";
import { Scrollbar, Navigation, Mousewheel, FreeMode, Manipulation } from "swiper/modules";
import { getProductUrl, isDesktop } from "../utils";

let carousels = [];

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

const setProduct = (products, currentProductsData) => {
  const productsLink = products.closest(".product__link");
  const productsImg = products.querySelector(".product__img");
  const productsName = products.querySelector(".product__name");
  const productsPrice = products.querySelector(".product__price");
  const { thumbnail, name, slug, hash, price } = currentProductsData;

  productsLink.href = getProductUrl(slug, hash);
  productsImg.src = thumbnail;
  productsImg.alt = name;
  productsName.innerText = name;
  productsPrice.innerText = `${parseFloat(price / 100)
    .toFixed(2)
    .replace(".", ",")} zł`;

  setTimeout(() => products.classList.remove("loading"), 200);
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
    products.forEach((products, j) => {
      const currentProducttData = bestProducts[j];
      setProduct(products, currentProducttData);
    });
  });
});
