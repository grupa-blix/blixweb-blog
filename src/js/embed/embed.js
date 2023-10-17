import Swiper from "swiper";
import { Navigation, Zoom, Mousewheel, Manipulation } from "swiper/modules";
import { isDesktop, getLeafletUrl } from "../utils";
import dayjs from "dayjs";
import { addAdultOverlayClickHandlers, isUserAdult } from "../adult-content/adult-content";
import { initPills, getTrackScrolled } from "../pills/pills";
import infoIcon from "../../img/info.svg";
import leafletPlaceholder from "../../img/embed-placeholder.png";

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
  const res = await fetch(`https://blix.pl/api/blog/leaflet/brand/${brandSlug}/${leafletId}`);
  const data = await res.json();
  return data;
};

const getLeafletBySearch = async (searchQuery) => {
  let query;

  if (searchQuery) {
    query = searchQuery;
  } else {
    const firstPill = document.querySelector(".bottom-wrapper__embed-pills .pill.active");

    if (firstPill) {
      query = firstPill.dataset.phrase;
    } else return;
  }

  const res = await fetch(`https://blix.pl/api/blog/leaflet/search/${query}`);
  const data = await res.json();

  if (data.pages) {
    const dataToArray = Object.keys(data.pages).map((key) => data.pages[key]);
    const arrayWithUrls = dataToArray.map((el) => {
      return {
        ...el,
        page_uri: data.leaflet_urls[el.leafletId] + "?pageNumber=" + (parseInt(el.page, 10) + 1),
        hasAlcohol: data.alcohol_leaflets.includes(el.leafletId),
      };
    });
    return arrayWithUrls;
  } else {
    return data;
  }
};

const generateDate = (value, format) => (value ? dayjs(value.date).format(format) : "");

const adultContent = (brandThumbnail) => {
  return `
    <div class="adult-content-overlay">
      ${brandThumbnail ? `<img src="${brandThumbnail}" class="adult-content-overlay__img"/>` : ""}
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
                      <img class="leaflet__brand-logo brand-logo lazyload" src="${
                        brand.thumbnail
                      }" loading="lazy"alt="${brand.name}">
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

const generateSinglePage = (data) => {
  const { page, hidePage, additionalLeaflets, hasAlcohol, brandThumbnail, leafletName } = data;
  const slide = document.createElement("div");
  const imageUrl = page.image_url
    ? page.image_url.replace("$$$EXT$$$", "webp").replace("$$$BUCKET$$$", 800)
    : page.imageUrl.replace(".jpg", ".webp") + "?bucket=800";

  const addOverlay = hasAlcohol || page.hasAlcohol;
  const alt = leafletName ? leafletName + ` - strona ${page.page + 1}` : `Strona ${page.page + 1}`;

  slide.classList.add("swiper-slide");
  slide.innerHTML = `
    <div class="swiper-zoom-container">
      <div class="swiper-zoom-target${hidePage ? " hidden" : ""}">
        <div class="page-wrapper swipe-zoom-target" data-uri="${page.page_uri}">
          ${addOverlay && !isUserAdult() && !additionalLeaflets ? adultContent(brandThumbnail) : ""}
          <img src="${imageUrl}" class="page-img" loading="lazy" alt="${alt}"/>
          ${additionalLeaflets ? generateAdditionalLeaflets(additionalLeaflets) : ""}
        </div>
      </div>
    </div>
  `;
  return slide;
};

const generateDoublePage = (data) => {
  const {
    leftPage,
    rightPage,
    hideLeftPage,
    hideRightPage,
    additionalLeafletsOnLeft,
    additionalLeafletsOnRight,
    hasAlcohol,
    brandThumbnail,
    leafletName,
  } = data;
  const slide = document.createElement("div");
  const leftImageUrl = leftPage.image_url.replace("$$$EXT$$$", "webp").replace("$$$BUCKET$$$", 800);
  const rightImageUrl = rightPage.image_url.replace("$$$EXT$$$", "webp").replace("$$$BUCKET$$$", 800);
  const leftAlt = leafletName ? leafletName + ` - strona ${leftPage.page + 1}` : `Strona ${leftPage.page + 1}`;
  const rightAlt = leafletName ? leafletName + ` - strona ${rightPage.page + 1}` : `Strona ${rightPage.page + 1}`;

  slide.classList.add("swiper-slide");
  slide.innerHTML = `
    <div class="swiper-zoom-container">
      <div class="swiper-zoom-target">
        <div class="page-wrapper swipe-zoom-target${hideLeftPage ? " hidden" : ""}" data-uri="${leftPage.page_uri}">
          ${hasAlcohol && !isUserAdult() && !additionalLeafletsOnLeft ? adultContent(brandThumbnail) : ""}
          <img src="${leftImageUrl}" class="page-img" loading="lazy" alt="${leftAlt}" />
          ${additionalLeafletsOnLeft ? generateAdditionalLeaflets(additionalLeafletsOnLeft) : ""}
        </div>
        <div class="page-wrapper swipe-zoom-target${hideRightPage ? " hidden" : ""}" data-uri="${rightPage.page_uri}">
          ${hasAlcohol && !isUserAdult() && !additionalLeafletsOnRight ? adultContent(brandThumbnail) : ""}
          <img src="${rightImageUrl}" class="page-img" loading="lazy" alt="${rightAlt}" />
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
  const brandThumbnail = leaflet.brand ? leaflet.brand.thumbnail : null;
  const leafletName = leaflet.viewer ? leaflet.viewer.leaflet_name : null;
  let hasAlcohol = leaflet.viewer ? leaflet.viewer.has_alcohol : false;

  if (isUserAdult()) {
    hasAlcohol = false;
  }

  embed.classList.add("loading");

  if (isDouble && isBrandLeaflet) {
    pages.forEach((page, index) => {
      if (index === 0) {
        const data = {
          leftPage: page,
          rightPage: page,
          hideLeftPage: true,
          hideRightPage: false,
          additionalLeafletsOnLeft: null,
          additionalLeafletsOnRight: null,
          hasAlcohol,
          brandThumbnail,
          leafletName,
        };
        wrapper.appendChild(generateDoublePage(data));
      } else if (index % 2 !== 0) {
        if (index + 1 === pages.length) {
          const data = {
            leftPage: pages[index - 1],
            rightPage: pages[index - 1],
            hideLeftPage: true,
            hideRightPage: true,
            additionalLeafletsOnLeft: additionalLeaflets,
            additionalLeafletsOnRight: null,
            hasAlcohol,
            brandThumbnail,
            leafletName,
          };
          wrapper.appendChild(generateDoublePage(data));
        } else if (pages[index + 1] && index + 2 !== pages.length) {
          const data = {
            leftPage: page,
            rightPage: pages[index + 1],
            hideLeftPage: false,
            hideRightPage: false,
            additionalLeafletsOnLeft: null,
            additionalLeafletsOnRight: null,
            hasAlcohol,
            brandThumbnail,
            leafletName,
          };
          wrapper.appendChild(generateDoublePage(data));
        } else {
          const data = {
            leftPage: page,
            rightPage: page,
            hideLeftPage: false,
            hideRightPage: true,
            additionalLeafletsOnLeft: null,
            additionalLeafletsOnRight: additionalLeaflets,
            hasAlcohol,
            brandThumbnail,
            leafletName,
          };
          wrapper.appendChild(generateDoublePage(data));
        }
      } else return;
    });
  } else {
    pages.forEach((page, index) => {
      if (index === pages.length - 1 && isBrandLeaflet) {
        const data = {
          page: pages[index - 1],
          hidePage: true,
          additionalLeaflets: additionalLeaflets,
          hasAlcohol,
          brandThumbnail,
          leafletName,
        };
        wrapper.appendChild(generateSinglePage(data));
      } else {
        const data = {
          page: page,
          hidePage: false,
          additionalLeaflets: null,
          hasAlcohol,
          brandThumbnail,
          leafletName,
        };
        wrapper.appendChild(generateSinglePage(data));
      }
    });
  }

  if (placeholder) wrapper.removeChild(placeholder);

  addAdultOverlayClickHandlers();

  setTimeout(() => {
    if (isBrandLeaflet) handleMessageDisplay(embed, leaflet);
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

const handleRecipeEmbed = async (embed, swiper) => {
  const embedWrapper = embed.closest(".bottom-wrapper__embed");

  if (!embedWrapper) {
    return;
  }

  const pillsTrack = embedWrapper.querySelector(".pills__track");
  const anchors = document.querySelectorAll(".bottom-wrapper__ingredients-inner-wrapper a");

  if (anchors.length === 0) {
    return;
  }

  anchors.forEach((anchor, index) => {
    const btn = document.createElement("button");
    btn.innerText = decodeURIComponent(anchor.href.split("=")[1]).replaceAll("-", " ");
    btn.dataset.phrase = decodeURIComponent(anchor.href.split("=")[1]);
    btn.classList.add("pill");

    pillsTrack.appendChild(btn);

    if (index === 0) btn.classList.add("active");

    btn.addEventListener("pointerup", async (b) => {
      if (getTrackScrolled()) return;
      embed.classList.add("loading");

      if (embed.querySelector(".message-box")) {
        const messageBox = embed.querySelector(".message-box");
        embed.removeChild(messageBox);
        embed.classList.remove("with-message-box");
      }

      const leaflet = await getLeafletBySearch(decodeURIComponent(anchor.href.split("=")[1]));

      setTimeout(() => {
        swiper.removeAllSlides();

        if (leaflet.emptyState) {
          handleEmptyState(embed, leaflet, false, btn.innerText);
          swiper.updateSlides();
          swiper.slideTo(0);
        } else {
          generatePages(embed, false, leaflet, false);
          swiper.updateSlides();
          swiper.slideTo(0);
          loadAdjacentPages(embed);
        }
      }, 200);
    });
  });
};

const removeEmbed = (embed) => {
  if (embed.closest(".bottom-wrapper")) {
    const parent = embed.closest(".bottom-wrapper");
    const bottomWrapper = parent.querySelector(".bottom-wrapper__embed");
    parent.removeChild(bottomWrapper);
  } else {
    embed.remove();
  }
};

const handleMessageDisplay = (embed, leaflet) => {
  if (embed.querySelector(".message-box")) return;

  if (leaflet.emptyState) {
    embed.classList.add("with-message-box");
    const messageBox = document.createElement("div");
    messageBox.classList.add("message-box");

    if (leaflet.isBrandLeaflet) {
      messageBox.innerHTML = `
      <img src="${infoIcon}" alt="Informacja"/>
      <span>Ta gazetka straciła ważność. Poznaj najnowsze promocje w innych sklepach.</span>
    `;
    } else {
      messageBox.innerHTML = `
      <img src="${infoIcon}" alt="Informacja"/>
      <span>Aktualnie nie mamy ofert na ${leaflet.productName.toLowerCase()}. Poznaj najnowsze promocje w Blix.</span>
    `;
    }

    embed.appendChild(messageBox);
  } else if (parseInt(embed.dataset.leafletId, 10) !== 0 && parseInt(embed.dataset.leafletId, 10) !== leaflet.id) {
    embed.classList.add("with-message-box");
    const messageBox = document.createElement("div");
    messageBox.classList.add("message-box");
    messageBox.innerHTML = `
        <img src="${infoIcon}" alt="Informacja"/>
        <span>Gazetka niedostępna. Poznaj aktualne promocje w gazetce ${leaflet.brand.name}.</span>
      `;
    embed.appendChild(messageBox);
  } else if (embed.classList.contains("archival")) {
    embed.classList.add("with-message-box");
    const messageBox = document.createElement("div");
    messageBox.classList.add("message-box");
    messageBox.innerHTML = `
        <img src="${infoIcon}" alt="Informacja"/>
        <span>Ta gazetka straciła ważność. Poznaj aktualne promocje w gazetce ${leaflet.brand.name}</span>
      `;
    embed.appendChild(messageBox);
  }
};

const handleEmptyState = (embed, leaflet, isBrandLeaflet, productName) => {
  const wrapper = embed.querySelector(".swiper-wrapper");
  leaflet = { ...leaflet, isBrandLeaflet, productName };

  embed.classList.add("empty");

  if (!wrapper.querySelector(".placeholder")) {
    const wrapper = embed.querySelector(".swiper-wrapper");
    const slide = document.createElement("div");

    slide.classList.add("swiper-slide", "placeholder");

    slide.innerHTML =
      `<div class="page-wrapper"><img src="${leafletPlaceholder}" class="page-img">` +
      generateAdditionalLeaflets(leaflet.emptyState) +
      "</div>";

    wrapper.appendChild(slide);

    setTimeout(() => {
      handleMessageDisplay(embed, leaflet);
      embed.classList.remove("loading");
      slide.classList.remove("placeholder");
    }, 200);
  } else {
    const placeholder = wrapper.querySelector(".placeholder");

    placeholder.querySelector(".page-wrapper").innerHTML =
      placeholder.querySelector(".page-wrapper").innerHTML + generateAdditionalLeaflets(leaflet.emptyState);

    setTimeout(() => {
      handleMessageDisplay(embed, leaflet);
      embed.classList.remove("loading");
      placeholder.classList.remove("placeholder");
    }, 200);
  }

  addAdultOverlayClickHandlers();
};

const initEmbed = async (embed) => {
  const swiperContainer = embed.querySelector(".swiper");
  const swiper = new Swiper(swiperContainer, options);
  const zoomInBtn = embed.querySelector(".swiper__zoom-in-btn");
  const zoomOutBtn = embed.querySelector(".swiper__zoom-out-btn");
  const { brandSlug, leafletId, searchPhrase } = embed.dataset;
  const isBrandLeaflet = brandSlug;

  await handleRecipeEmbed(embed, swiper);

  const pillsTrackWrapper = embed.closest(".bottom-wrapper__embed");

  if (pillsTrackWrapper) {
    const pillsTrack = pillsTrackWrapper.querySelector(".pills__track");
    initPills(pillsTrack);
  }

  const leaflet = isBrandLeaflet
    ? await getLeafletByBrand(brandSlug, leafletId)
    : await getLeafletBySearch(searchPhrase);

  if (leaflet.emptyState) {
    handleEmptyState(embed, leaflet, isBrandLeaflet, searchPhrase);
    return;
  } else if (!(await leaflet) || (await leaflet.length) === 0) {
    removeEmbed(embed);
    return;
  }

  if (isBrandLeaflet) {
    embed.dataset.mode = isDesktop() ? "double" : "single";
    if (leaflet.badge.message === "archiwalna") embed.classList.add("archival");
  }

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
};

window.addEventListener("DOMContentLoaded", () => {
  const embeds = document.querySelectorAll(".embed");

  if (embeds.length === 0) return;

  embeds.forEach((embed) => {
    initEmbed(embed);
  });
});
