import Swiper from "swiper";
import { Navigation, Zoom, Mousewheel, Manipulation } from "swiper/modules";
import { isDesktop, getLeafletUrl } from "../utils";
import dayjs from "dayjs";
import { addAdultOverlayClickHandlers, isUserAdult } from "../adult-content/adult-content";

const options = {
  modules: [Navigation, Zoom, Mousewheel, Manipulation],
  init: false,
  direction: "horizontal",
  draggable: true,
  passiveListeners: false,
  slidesPerView: 1,
  loop: true,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  zoom: {
    maxRatio: 2,
  },
  mousewheel: {
    forceToAxis: true,
  },
};

const getLeafletByBrand = async (brandSlug, leafletId = 0) => {
  const res = await fetch(`https://fancy.blix.app/api/blog/leaflet/brand/${brandSlug}/${leafletId}`);
  const data = await res.json();
  return data;
};

const getLeafletBySearch = async (searchQuery) => {
  let query;

  if (!searchQuery) {
    const firstAnchor = document.querySelector(".bottom-wrapper__ingredients-inner-wrapper a");
    query = firstAnchor.href.split("=")[1];
  } else {
    query = searchQuery;
  }

  const res = await fetch(`https://fancy.blix.app/api/blog/leaflet/search/${query}`);
  const data = await res.json();

  const dataToArray = Object.keys(data.pages).map((key) => data.pages[key]);
  const arrayWithUrls = dataToArray.map((el) => {
    return {
      ...el,
      page_uri: data.leaflet_urls[el.leafletId] + "?pageNumber=" + el.page,
    };
  });
  return arrayWithUrls;
};

const generateDate = (value, format) => (value ? dayjs(value.date).format(format) : "");

const adultContent = (brandThumbnail) => {
  return `
    <div class="adult-content-overlay adult-content-overlay--small">
      <img src="${brandThumbnail}" class="adult-content-overlay__img"/>
      <span class="adult-content-overlay__label">Zawartość dla osób pełnoletnich</span>
      <button class="adult-content-overlay__button button button--green">Odblokuj</button>
    </div>
  `;
};

const generateAdditionalLeaflets = (lastPageData) => `
    <div class="page-wrapper page-wrapper--additional">
        <h4>Zobacz inne gazetki</h4>
        <div class="leaflets">
          ${lastPageData.leaflets
            .map((leaflet) => {
              const { id, name, brandId, dateStart, dateEnd, hasAlcohol } = leaflet;
              const cover = lastPageData.coverPages[id].imageUrl.replace("jpg", "webp");
              const brand = lastPageData.brands.find((b) => b.id === brandId);
              const leafletUrl = getLeafletUrl(brand.slug, id);
              let leafletName = name;

              if (leafletName === "Gazetka") {
                if (dateStart && dateEnd) {
                  leafletName = `${leafletName} ${generateDate(dateStart, "DD.MM")} - ${generateDate(
                    dateEnd,
                    "DD.MM"
                  )}`;
                } else if (dateStart && !dateEnd) {
                  leafletName = `${leafletName} od ${generateDate(dateStart, "DD.MM")}`;
                } else if (!dateStart && dateEnd) {
                  leafletName = `${leafletName} do ${generateDate(dateEnd, "DD.MM")}`;
                }
              }

              return `
                <div class="leaflet small">
                  ${hasAlcohol && !isUserAdult() ? adultContent(brand.thumbnail) : ""}
                  <a href="${leafletUrl}" class="leaflet__link">
                    <div class="leaflet__cover-wrapper">
                      <img src="${cover}" alt="${leaflet.name}"
                      class="leaflet__cover" width="360" height="510" loading="lazy">
                      <button class="leaflet__btn-cta button">
                        <i class="icon-eye"></i>
                        <span>Zobacz</span>
                      </button>
                    </div>
                    <div class="leaflet__info">
                      <img class="leaflet__brand-logo brand-logo lazyload" src="${brand.thumbnail}" loading="lazy">
                      <h6 class="leaflet__brand-name">${brand.name}</h6>
                      <span class="leaflet__leaflet-name">${leafletName}</span>
                    </div>
                  </a>
                </div>
              `;
            })
            .join("")}
        </div>
    </div>
  `;

const generateSinglePage = (page, hidePage = false, additionalLeaflets = null) => {
  const slide = document.createElement("div");
  const imageUrl = page.image_url
    ? page.image_url.replace("$$$EXT$$$", "webp").replace("$$$BUCKET$$$", 800)
    : page.imageUrl.replace(".jpg", ".webp") + "?bucket=800";

  slide.classList.add("swiper-slide");
  slide.innerHTML = `
    <div class="swiper-zoom-container">
      <div class="swiper-zoom-target${hidePage ? " hidden" : ""}">
        <div class="page-wrapper swipe-zoom-target" data-uri="${page.page_uri}">
          <img src="${imageUrl}" class="page-img" loading="lazy"/>
          ${additionalLeaflets ? generateAdditionalLeaflets(additionalLeaflets) : ""}
        </div>
      </div>
    </div>
  `;
  return slide;
};

const generateDoublePage = (
  leftPage,
  rightPage,
  hideLeftPage = false,
  hideRightPage = false,
  additionalLeafletsOnLeft = null,
  additionalLeafletsOnRight = null
) => {
  const slide = document.createElement("div");
  const leftImageUrl = leftPage.image_url.replace("$$$EXT$$$", "webp").replace("$$$BUCKET$$$", 800);
  const rightImageUrl = rightPage.image_url.replace("$$$EXT$$$", "webp").replace("$$$BUCKET$$$", 800);
  slide.classList.add("swiper-slide");
  slide.innerHTML = `
    <div class="swiper-zoom-container">
      <div class="swiper-zoom-target">
        <div class="page-wrapper swipe-zoom-target${hideLeftPage ? " hidden" : ""}" data-uri="${leftPage.page_uri}">
          <img src="${leftImageUrl}" class="page-img" loading="lazy" />
          ${additionalLeafletsOnLeft ? generateAdditionalLeaflets(additionalLeafletsOnLeft) : ""}
        </div>
        <div class="page-wrapper swipe-zoom-target${hideRightPage ? " hidden" : ""}" data-uri="${rightPage.page_uri}">
          <img src="${rightImageUrl}" class="page-img" loading="lazy" />
          ${additionalLeafletsOnRight ? generateAdditionalLeaflets(additionalLeafletsOnRight) : ""}
        </div>
      </div>
    </div>
  `;
  return slide;
};

const generatePages = (embed, isDouble, leaflet, isBrandLeaflet) => {
  const wrapper = embed.querySelector(".swiper-wrapper");
  const placeholder = wrapper.querySelector(".placeholder");
  const pages = leaflet.viewer ? leaflet.viewer.pages : leaflet;
  const additionalLeaflets = leaflet.lastPageData ? leaflet.lastPageData : null;

  embed.classList.add("loading");

  if (isDouble && isBrandLeaflet) {
    pages.forEach((page, index) => {
      if (index === 0) {
        wrapper.appendChild(generateDoublePage(page, page, true));
      } else if (index % 2 !== 0) {
        if (index + 1 === pages.length) {
          wrapper.appendChild(generateDoublePage(pages[index - 1], pages[index - 1], true, true, additionalLeaflets));
        } else if (pages[index + 1] && index + 2 !== pages.length) {
          wrapper.appendChild(generateDoublePage(page, pages[index + 1]));
        } else {
          wrapper.appendChild(generateDoublePage(page, page, false, true, null, additionalLeaflets));
        }
      } else return;
    });
  } else {
    pages.forEach((page, index) => {
      if (index === pages.length - 1 && isBrandLeaflet) {
        wrapper.appendChild(generateSinglePage(pages[index - 1], true, additionalLeaflets));
      } else {
        wrapper.appendChild(generateSinglePage(page));
      }
    });
  }

  if (placeholder) wrapper.removeChild(placeholder);

  addAdultOverlayClickHandlers();

  setTimeout(() => {
    embed.classList.remove("loading");
  }, 200);
};

const loadAdjacentPages = (embed) => {
  const adjacentImages = [
    ...embed.querySelectorAll(".swiper-slide-prev .page-img"),
    ...embed.querySelectorAll(".swiper-slide-next .page-img"),
  ];

  adjacentImages.forEach((img) => {
    img.removeAttribute("loading");
  });
};

const setLeafletBtn = (embed) => {
  const specialBtnAnchor = embed.querySelector(".swiper__special-buttons a");
  const { uri } = embed.querySelector(".swiper-slide-active .page-wrapper")
    ? embed.querySelector(".swiper-slide-active .page-wrapper").dataset
    : embed.querySelector(".swiper-slide .page-wrapper").dataset;
  specialBtnAnchor.href = uri;
};

const udpateCoversOnZoom = (embed, swiper) => {
  const pages = embed.querySelectorAll(".page-img");

  pages.forEach((page) => {
    if (swiper.zoom.scale === 1 && page.src.includes("bucket=3000")) {
      page.src = page.src.replace("bucket=3000", "bucket=800");
    } else if (swiper.zoom.scale > 1 && page.src.includes("bucket=800")) {
      page.src = page.src.replace("bucket=800", "bucket=3000");
    }
  });
};

window.addEventListener("DOMContentLoaded", () => {
  const embeds = document.querySelectorAll(".embed");

  if (embeds.length === 0) return;

  embeds.forEach(async (embed) => {
    const swiperContainer = embed.querySelector(".swiper");
    const swiper = new Swiper(swiperContainer, options);
    const zoomInBtn = embed.querySelector(".swiper__zoom-in-btn");
    const zoomOutBtn = embed.querySelector(".swiper__zoom-out-btn");
    const { brandSlug, leafletId, searchPhrase } = embed.dataset;
    const isBrandLeaflet = brandSlug;
    const leaflet = isBrandLeaflet
      ? await getLeafletByBrand(brandSlug, leafletId)
      : await getLeafletBySearch(searchPhrase);

    if (isBrandLeaflet) embed.dataset.mode = isDesktop() ? "double" : "single";
    let isDouble = embed.dataset.mode === "double";

    generatePages(embed, isDouble, leaflet, isBrandLeaflet);

    zoomInBtn.addEventListener("click", () => {
      if (swiper.zoom.scale === 1) {
        swiper.zoom.in(1.5);
      } else {
        swiper.zoom.in(2);
      }
    });

    zoomOutBtn.addEventListener("click", () => {
      if (swiper.zoom.scale === 2) {
        swiper.zoom.in(1.5);
      } else {
        swiper.zoom.out();
      }
    });

    swiper.on("zoomChange", () => {
      setTimeout(() => {
        udpateCoversOnZoom(embed, swiper);
      }, 500);
    });

    swiper.on("slideChangeTransitionEnd", () => {
      loadAdjacentPages(embed);

      setTimeout(() => {
        setLeafletBtn(embed);
      }, 500);
    });

    swiper.on("afterInit", () => {
      loadAdjacentPages(embed);

      setTimeout(() => {
        setLeafletBtn(embed);
      }, 500);
    });

    swiper.init();

    window.addEventListener("resize", () => {
      isDouble = embed.dataset.mode === "double";

      if (isDesktop() && !isDouble && isBrandLeaflet) {
        isDouble = true;
        embed.dataset.mode = "double";
        swiper.removeAllSlides();
        generatePages(embed, isDouble, leaflet, isBrandLeaflet);
        swiper.slideTo(0);
      } else if (!isDesktop() && isDouble && isBrandLeaflet) {
        isDouble = false;
        embed.dataset.mode = "single";
        swiper.removeAllSlides();
        generatePages(embed, isDouble, leaflet, isBrandLeaflet);
        swiper.slideTo(0);
      }
    });
  });
});
