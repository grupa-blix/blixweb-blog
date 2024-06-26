import Swiper from "swiper";
import { Navigation, Zoom, Mousewheel, Manipulation } from "swiper/modules";
import { isDesktop, getLeafletUrl, detectSwipe, handleScrollSwipe, isAppleDevice } from "../utils";
import dayjs from "dayjs";
import { addAdultOverlayClickHandlers, isUserAdult } from "../adult-content/adult-content";
import { initPills, getTrackScrolled } from "../pills/pills";
import infoIcon from "../../img/info.svg";
import leafletPlaceholder from "../../img/embed-placeholder.png";
import handleInserts from "./embed-inserts";
import {
  sendLeafletEnterEvent,
  handleLastPageView,
  addLastPageItemsClickHandlers,
  handlePageView,
} from "./embed-analytics";

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

const setLeafletId = (embed, currentLeafletId) => {
  const activeLeaflet = embed.querySelector(".swiper-slide-active .page-wrapper");
  if (!activeLeaflet || embed.classList.contains("empty")) return;

  const { leafletId } = activeLeaflet.dataset;

  if (leafletId && leafletId != currentLeafletId) {
    sendLeafletEnterEvent(activeLeaflet);
  }
  return leafletId;
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

  query = query.replace("%", "");

  const res = await fetch(`https://blix.pl/api/blog/leaflet/search/${query}`);
  const data = await res.json();

  if (data.pages) {
    const dataToArray = Object.keys(data.pages).map((key) => data.pages[key]);
    const arrayWithUrls = dataToArray.map((el) => {
      return {
        ...el,
        page_uri: data.leaflet_urls[el.leafletId] + "?pageNumber=" + (parseInt(el.page, 10) + 1),
        brandName: data.leaflet_brands[el.leafletId].brand_name,
        brandId: data.leaflet_brands[el.leafletId].brand_id,
        brandLogo: data.leaflet_brands[el.leafletId].brand_logo,
        leafletName: data.leaflet_titles[el.leafletId],
        hasAlcohol: data.alcohol_leaflets.includes(el.leafletId),
        badge: data.leaflet_availability_labels[el.leafletId],
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

const updateNavigation = (embed) => {
  const activePage = embed.querySelector(".swiper-slide-active .page-wrapper");

  if (!activePage || embed.classList.contains("empty")) return;

  const pages = embed.querySelectorAll(".page-wrapper:not(.hidden):not(.page-wrapper--additional)");
  const navigation = embed.querySelector(".navigation");
  const logo = navigation.querySelector(".navigation__brand-logo");
  const name = navigation.querySelector(".navigation__brand-name");
  const badge = navigation.querySelector(".navigation__availability-badge");
  const pageCurrent = navigation.querySelector(".navigation .page-number--current");
  const pageTotal = navigation.querySelector(".navigation .page-number--total");
  const { brandLogo, brandName, availabilityMessage, availabilityClass, pageIndex } = activePage.dataset;
  const progressBar = navigation.querySelector(".navigation__progress-bar-progress");

  logo.src = brandLogo;
  logo.alt = brandName;
  name.innerText = brandName;
  badge.className = "";
  badge.classList.add("navigation__availability-badge", "availability-badge", availabilityClass);
  badge.querySelector(".availability-badge__label").innerText = availabilityMessage;

  if (embed.dataset.mode === "double") {
    const rightPage = embed.querySelectorAll(".swiper-slide-active .page-wrapper")[1];
    const leftPageIndex = pageIndex;
    const { pageIndex: rightPageIndex } = rightPage.dataset;

    if (leftPageIndex && rightPageIndex) {
      pageCurrent.innerText = parseInt(leftPageIndex, 10) + "-" + parseInt(rightPageIndex, 10);
      progressBar.style.width = (parseInt(rightPageIndex, 10) / pages.length) * 100 + "%";
    } else if (leftPageIndex && !rightPageIndex) {
      pageCurrent.innerText = parseInt(leftPageIndex, 10);
      progressBar.style.width = (parseInt(leftPageIndex, 10) / pages.length) * 100 + "%";
    } else if (!leftPageIndex && rightPageIndex) {
      pageCurrent.innerText = parseInt(rightPageIndex, 10);
      progressBar.style.width = (parseInt(rightPageIndex, 10) / pages.length) * 100 + "%";
    } else {
      pageCurrent.innerText = pages.length;
      progressBar.style.width = "100%";
    }
  } else {
    if (pageIndex) {
      pageCurrent.innerText = parseInt(pageIndex, 10);
      progressBar.style.width = (parseInt(pageIndex, 10) / pages.length) * 100 + "%";
    } else {
      pageCurrent.innerText = pages.length;
      progressBar.style.width = "100%";
    }
  }

  pageTotal.innerText = pages.length;
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
                <div class="leaflet small" data-leaflet-id="${id}" data-leaflet-name="${name}" data-brand-id="${brandId}" data-brand-name="${
                brand.name
              }" >
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

const checkIfAppPromoUrl = (clickUrl) => {
  if (clickUrl.includes("utm_campaign%3Dblixapppromo") && isAppleDevice()) {
    return "https://apps.apple.com/app/apple-store/id1012288672?pt=1693141&ct=adinsert&mt=8?utm_source=blixweb&utm_campaign=blixapppromo&utm_medium=adinsert";
  }

  return clickUrl;
};

const generateAdInsert = (inserts, pageIndex) => {
  if (!inserts) return "";

  const insert = inserts.find((ins) => ins.afterPage === pageIndex);

  if (insert && insert.type === 1) {
    const { click_url: clickUrl, src, click_urls: clickUrls, view_urls: viewUrls } = insert;
    const newClickUrl = checkIfAppPromoUrl(clickUrl);

    return `<div class="insert-wrapper" data-click-url="${newClickUrl}">
      <img src="${src}" class="insert-img" draggable="false">
      ${viewUrls.map((url) => `<div class="d-none" data-view-url="${url}"></div>`)}
      ${clickUrls.map((url) => `<div class="d-none" data-click-url="${url}"></div>`)}
    </div>`;
  } else return "";
};

const generateSinglePage = (data) => {
  const {
    page,
    pageIndex,
    hidePage,
    additionalLeaflets,
    hasAlcohol,
    brandThumbnail,
    leafletName,
    leafletId,
    brandName,
    brandId,
    badge,
    inserts,
    isArchival,
  } = data;
  const slide = document.createElement("div");
  const imageUrl = page.image_url
    ? page.image_url.replace("$$$EXT$$$", "webp").replace("$$$BUCKET$$$", 800)
    : page.imageUrl.replace(".jpg", ".webp") + "?bucket=800";

  const addOverlay = hasAlcohol || page.hasAlcohol;
  const alt = leafletName ? leafletName + ` - strona ${page.page + 1}` : `Strona ${page.page + 1}`;
  const dataLeafletName = leafletName ? leafletName : page.leafletName;
  const dataLeafletId = leafletId ? leafletId : page.leafletId;
  const dataBrandName = brandName ? brandName : page.brandName;
  const dataBrandId = brandId ? brandId : page.brandId;
  const dataBrandLogo = brandThumbnail ? brandThumbnail : page.brandLogo;
  const dataBadge = badge ? badge : page.badge;
  const insert = generateAdInsert(inserts, pageIndex);

  slide.classList.add("swiper-slide");
  slide.innerHTML = `
    <div class="swiper-zoom-container">
      <div class="swiper-zoom-target">
        <div class="page-wrapper swipe-zoom-target${hidePage ? " hidden" : ""}" data-uri="${
    page.page_uri
  }" data-leaflet-name="${dataLeafletName}" data-leaflet-id="${dataLeafletId}" data-brand-name="${dataBrandName}" data-brand-id="${dataBrandId}" data-is-archival="${isArchival}" data-brand-logo="${dataBrandLogo}"${
    pageIndex ? `data-page-index=${pageIndex}` : ""
  }
        data-availability-message="${dataBadge.message}" data-availability-class="${dataBadge.class}">
          ${addOverlay && !isUserAdult() && !additionalLeaflets ? adultContent(brandThumbnail) : ""}
            <img src="${imageUrl}" class="page-img" loading="lazy" alt="${alt}"/>
            ${additionalLeaflets ? generateAdditionalLeaflets(additionalLeaflets) : ""}
            ${insert}
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
    leftPageIndex,
    rightPageIndex,
    hideLeftPage,
    hideRightPage,
    additionalLeafletsOnLeft,
    additionalLeafletsOnRight,
    hasAlcohol,
    brandThumbnail,
    leafletName,
    leafletId,
    brandName,
    brandId,
    badge,
    inserts,
    isArchival,
  } = data;
  const slide = document.createElement("div");
  const leftImageUrl = leftPage.image_url.replace("$$$EXT$$$", "webp").replace("$$$BUCKET$$$", 800);
  const rightImageUrl = rightPage.image_url.replace("$$$EXT$$$", "webp").replace("$$$BUCKET$$$", 800);
  const leftAlt = leafletName ? leafletName + ` - strona ${leftPage.page + 1}` : `Strona ${leftPage.page + 1}`;
  const rightAlt = leafletName ? leafletName + ` - strona ${rightPage.page + 1}` : `Strona ${rightPage.page + 1}`;
  const dataBrandLogo = brandThumbnail ? brandThumbnail : leftPage.brandLogo;
  const dataBadge = badge ? badge : leftPage.badge;
  const leftInsert = generateAdInsert(inserts, leftPageIndex);
  const rightInsert = generateAdInsert(inserts, rightPageIndex);

  slide.classList.add("swiper-slide");
  slide.innerHTML = `
    <div class="swiper-zoom-container">
      <div class="swiper-zoom-target">
        <div class="page-wrapper swipe-zoom-target${hideLeftPage ? " hidden" : ""}" data-uri="${
    leftPage.page_uri
  }" data-leaflet-name="${leafletName}" data-leaflet-id="${leafletId}" data-brand-name="${brandName}" data-brand-id="${brandId}" data-is-archival="${isArchival}" data-brand-logo="${dataBrandLogo}" data-availability-message="${
    dataBadge.message
  }" data-availability-class="${dataBadge.class}"${leftPageIndex ? `data-page-index="${leftPageIndex}"` : ""}>
          ${hasAlcohol && !isUserAdult() && !additionalLeafletsOnLeft ? adultContent(brandThumbnail) : ""}
          <img src="${leftImageUrl}" class="page-img" loading="lazy" alt="${leftAlt}" />
          ${additionalLeafletsOnLeft ? generateAdditionalLeaflets(additionalLeafletsOnLeft) : ""}
          ${leftInsert}
        </div>
        <div class="page-wrapper swipe-zoom-target${hideRightPage ? " hidden" : ""}" data-uri="${
    rightPage.page_uri
  }" data-leaflet-name="${leafletName}" data-leaflet-id="${leafletId}" data-brand-name="${brandName}" data-brand-id="${brandId}" data-is-archival="${isArchival}" data-brand-logo="${dataBrandLogo}" data-availability-message="${
    dataBadge.message
  }" data-availability-class="${dataBadge.class}"${rightPageIndex ? `data-page-index="${rightPageIndex}"` : ""}>
          ${hasAlcohol && !isUserAdult() && !additionalLeafletsOnRight ? adultContent(brandThumbnail) : ""}
          <img src="${rightImageUrl}" class="page-img" loading="lazy" alt="${rightAlt}" />
          ${additionalLeafletsOnRight ? generateAdditionalLeaflets(additionalLeafletsOnRight) : ""}
          ${rightInsert}
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
  const leafletId = leaflet.viewer ? leaflet.id : null;
  const brandName = leaflet.viewer ? leaflet.brand.name : null;
  const brandId = leaflet.viewer ? leaflet.brand.id : null;
  const badge = leaflet.viewer ? leaflet.badge : null;
  const isArchival = leaflet.viewer ? leaflet.badge.class === "lav-archive" : false;
  const inserts = leaflet.inserts ? leaflet.inserts : null;
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
          rightPageIndex: index + 1,
          hideLeftPage: true,
          hideRightPage: false,
          additionalLeafletsOnLeft: null,
          additionalLeafletsOnRight: null,
          hasAlcohol,
          brandThumbnail,
          leafletName,
          leafletId,
          brandName,
          brandId,
          badge,
          inserts,
          isArchival,
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
            leafletId,
            brandName,
            brandId,
            badge,
            inserts,
            isArchival,
          };
          wrapper.appendChild(generateDoublePage(data));
        } else if (pages[index + 1] && index + 2 !== pages.length) {
          const data = {
            leftPage: page,
            rightPage: pages[index + 1],
            leftPageIndex: index + 1,
            rightPageIndex: index + 2,
            hideLeftPage: false,
            hideRightPage: false,
            additionalLeafletsOnLeft: null,
            additionalLeafletsOnRight: null,
            hasAlcohol,
            brandThumbnail,
            leafletName,
            leafletId,
            brandName,
            brandId,
            badge,
            inserts,
            isArchival,
          };
          wrapper.appendChild(generateDoublePage(data));
        } else {
          const data = {
            leftPage: page,
            rightPage: page,
            leftPageIndex: index + 1,
            hideLeftPage: false,
            hideRightPage: true,
            additionalLeafletsOnLeft: null,
            additionalLeafletsOnRight: additionalLeaflets,
            hasAlcohol,
            brandThumbnail,
            leafletName,
            leafletId,
            brandName,
            brandId,
            badge,
            inserts,
            isArchival,
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
          leafletId,
          brandName,
          brandId,
          badge,
          isArchival,
        };
        wrapper.appendChild(generateSinglePage(data));
      } else {
        const data = {
          page: page,
          pageIndex: index + 1,
          hidePage: false,
          additionalLeaflets: null,
          hasAlcohol,
          brandThumbnail,
          leafletName,
          leafletId,
          brandName,
          brandId,
          badge,
          inserts,
          isArchival,
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
    removeEmbed(embed);
    return;
  }

  let phrases = [];

  anchors.forEach((anchor, index) => {
    const phrase = decodeURIComponent(anchor.href.split("=")[1]);

    if (phrases.includes(phrase)) return;
    else {
      phrases.push(phrase);
    }

    const btn = document.createElement("button");
    btn.innerText = phrase.replaceAll("-", " ");
    btn.dataset.phrase = phrase;
    btn.classList.add("pill");

    pillsTrack.appendChild(btn);

    if (index === 0) btn.classList.add("active");

    btn.addEventListener("pointerup", async (b) => {
      if (!/Android|webOS|iPhone|iPad|iPod|Opera Mini/i.test(navigator.userAgent) && getTrackScrolled()) return;
      embed.classList.add("loading");

      if (embed.parentNode.querySelector(".message-box")) {
        const messageBox = embed.parentNode.querySelector(".message-box");
        embed.parentNode.removeChild(messageBox);
      }

      const leaflet = await getLeafletBySearch(phrase);

      setTimeout(() => {
        swiper.removeAllSlides();

        if (leaflet.emptyState) {
          handleEmptyState(embed, leaflet, false, btn.innerText);
          swiper.updateSlides();
          swiper.slideTo(0);
          updateNavigation(embed, swiper);
        } else {
          const navigation = embed.querySelector(".navigation");
          navigation.classList.remove("d-none");
          embed.classList.remove("empty");
          generatePages(embed, false, leaflet, false);
          swiper.updateSlides();
          swiper.slideTo(0);
          loadAdjacentPages(embed);
          updateNavigation(embed, swiper);
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
  if (embed.parentNode.querySelector("& > .message-box")) return;

  if (leaflet.emptyState) {
    const messageBox = document.createElement("div");
    messageBox.classList.add("message-box");

    if (leaflet.isBrandLeaflet) {
      messageBox.innerHTML = `
      <img src="${infoIcon}" alt="Informacja"/>
      <span>Ta gazetka straciła ważność. Promocje mogą już nie obowiązywać.</span>
    `;
    } else {
      messageBox.innerHTML = `
      <img src="${infoIcon}" alt="Informacja"/>
      <span>Aktualnie nie mamy ofert na ${leaflet.searchPhrase.toLowerCase()}. Poznaj najnowsze promocje w Blix.</span>
    `;
    }

    embed.parentNode.insertBefore(messageBox, embed);
  } else if (parseInt(embed.dataset.leafletId, 10) !== 0 && parseInt(embed.dataset.leafletId, 10) !== leaflet.id) {
    const messageBox = document.createElement("div");
    messageBox.classList.add("message-box");
    messageBox.innerHTML = `
        <img src="${infoIcon}" alt="Informacja"/>
        <span>Gazetka niedostępna. Poznaj aktualne promocje w gazetce ${leaflet.brand.name}.</span>
      `;
    embed.parentNode.insertBefore(messageBox, embed);
  } else if (embed.classList.contains("archival")) {
    const messageBox = document.createElement("div");
    messageBox.classList.add("message-box");
    messageBox.innerHTML = `
        <img src="${infoIcon}" alt="Informacja"/>
        <span>Ta gazetka straciła ważność. Promocje mogą już nie obowiązywać.</span>
      `;
    embed.parentNode.insertBefore(messageBox, embed);
  }
};

const handleEmptyState = (embed, leaflet, isBrandLeaflet, searchPhrase) => {
  const wrapper = embed.querySelector(".swiper-wrapper");
  const navigation = embed.querySelector(".navigation");
  leaflet = { ...leaflet, isBrandLeaflet, searchPhrase };

  embed.classList.add("empty");

  if (!wrapper.querySelector(".placeholder")) {
    const wrapper = embed.querySelector(".swiper-wrapper");
    const slide = document.createElement("div");

    slide.classList.add("swiper-slide", "placeholder");

    slide.innerHTML =
      `<div class="page-wrapper"><img src="${leafletPlaceholder}" class="page-img">` +
      generateAdditionalLeaflets(leaflet.emptyState) +
      "</div>";

    navigation.classList.add("d-none");
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

    navigation.classList.add("d-none");

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
  const zoomInBtn = embed.querySelector(".swiper__zoom-in-btn");
  const zoomOutBtn = embed.querySelector(".swiper__zoom-out-btn");
  const prevBtn = embed.querySelector(".swiper-button-prev");
  const nextBtn = embed.querySelector(".swiper-button-next");
  const { brandSlug, leafletId, searchPhrase } = embed.dataset;
  const isBrandLeaflet = brandSlug;
  const isRecipeEmbed = !brandSlug && !searchPhrase;
  let currentLeafletId;
  let wasLastPageViewed = false;
  let swiperTouchDiff;

  if (isBrandLeaflet) options.loop = false;

  const swiper = new Swiper(swiperContainer, options);

  await handleRecipeEmbed(embed, swiper);

  const pillsTrackWrapper = embed.closest(".bottom-wrapper__embed");

  if (pillsTrackWrapper) {
    const pillsTrack = pillsTrackWrapper.querySelector(".pills__track");
    initPills(pillsTrack);
  }

  const leaflet = isBrandLeaflet
    ? await getLeafletByBrand(brandSlug, leafletId)
    : await getLeafletBySearch(searchPhrase);

  if (leaflet && leaflet.emptyState) {
    if (isRecipeEmbed) {
      handleEmptyState(
        embed,
        leaflet,
        isBrandLeaflet,
        document.querySelector(".bottom-wrapper__embed-pills .pill.active").dataset.phrase
      );
    } else {
      handleEmptyState(embed, leaflet, isBrandLeaflet, searchPhrase);
    }

    swiper.init();
    addLastPageItemsClickHandlers(embed);
    return;
  } else if (!leaflet || leaflet.length === 0) {
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

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      if (swiper.enabled) detectSwipe("button", "backward");
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      if (swiper.enabled) detectSwipe("button", "forward");
    });
  }

  swiper.on("zoomChange", () => {
    setTimeout(() => {
      udpateCoversOnZoom(embed, swiper);
    }, 500);
  });

  swiper.on("slideChangeTransitionEnd", () => {
    const currentTouchDiff = swiper.touches.diff;
    loadAdjacentPages(embed);
    updateNavigation(embed, swiper);
    handlePageView(embed);

    currentLeafletId = setLeafletId(embed, currentLeafletId);
    if (!wasLastPageViewed) {
      wasLastPageViewed = handleLastPageView(embed);
    }

    if (currentTouchDiff !== 0 && currentTouchDiff !== swiperTouchDiff) {
      swiperTouchDiff = currentTouchDiff;
      const direction = swiper.swipeDirection === "prev" ? "backward" : "forward";
      detectSwipe("swipe", direction);
    }
  });

  swiper.on("scroll", () => {
    handleScrollSwipe(swiper);
  });

  swiper.on("afterInit", () => {
    loadAdjacentPages(embed);
    updateNavigation(embed, swiper);
    addLastPageItemsClickHandlers(embed);
    currentLeafletId = setLeafletId(embed, currentLeafletId);
    handlePageView(embed);

    setTimeout(() => {
      handleInserts(embed, swiper);
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
      updateNavigation(embed, swiper);
    } else if (!isDesktop() && isDouble && isBrandLeaflet) {
      isDouble = false;
      embed.dataset.mode = "single";
      swiper.removeAllSlides();
      generatePages(embed, isDouble, leaflet, isBrandLeaflet);
      swiper.slideTo(0);
      updateNavigation(embed, swiper);
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
