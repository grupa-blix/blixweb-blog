const clearDataLayer = () => {
  dataLayer.push(function () {
    this.reset();
  });
};

const sendLeafletEnterEvent = (leaflet) => {
  const { leafletId, leafletName, brandId, brandName, isArchival } = leaflet.dataset;

  dataLayer.push({
    event: "LEAFLET_ENTER",
    leafletId: leafletId.toString(),
    leafletName,
    brandId: brandId.toString(),
    brandName,
    placement: "blog",
    openType: "manual",
    state: isArchival === "true" ? "archived" : "current",
  });

  clevertap.event.push("leaflet_enter", {
    brand_id: brandId,
    brand_name: brandName,
    leaflet_id: leafletId,
    leaflet_name: leafletName,
    url: window.location.href,
  });

  clearDataLayer();
};

const addLastPageItemsClickHandlers = (embed) => {
  const leaflets = embed.querySelectorAll(".leaflet");

  leaflets.forEach((leaflet) => {
    leaflet.addEventListener("click", () => {
      const { leafletId, leafletName, brandId, brandName } = leaflet.dataset;
      const state = leaflet.closest(".embed.empty") ? "empty" : "default";

      dataLayer.push({
        event: "LEAFLET_EMBED_LASTPAGE_CLICK",
        leafletId: leafletId.toString(),
        leafletName,
        brandId: brandId.toString(),
        brandName,
        placement: "blog",
        state,
      });

      clearDataLayer();
    });
  });
};

const handleLastPageView = (embed) => {
  const lastPage = embed.querySelector(".swiper-slide-active .page-wrapper--additional");

  if (lastPage) {
    const pageWrapper = lastPage.closest(".page-wrapper.swipe-zoom-target");
    const { leafletId, leafletName, brandId, brandName } = pageWrapper.dataset;

    dataLayer.push({
      event: "LEAFLET_EMBED_LASTPAGE_DISPLAY",
      leafletId: leafletId.toString(),
      leafletName,
      brandId: brandId.toString(),
      brandName,
      placement: "blog",
    });

    clearDataLayer();
    return true;
  }

  return false;
};

const handlePageView = (embed) => {
  const leaflet = embed.querySelector(".swiper-slide-active .page-wrapper");

  if (leaflet) {
    const { leafletId, leafletName, brandId, brandName } = leaflet.dataset;

    dataLayer.push({
      event: "LEAFLET_EMBED_PAGEVIEW",
      leafletId: leafletId.toString(),
      leafletName,
      brandId: brandId.toString(),
      brandName,
      placement: "blog",
    });

    clearDataLayer();
    return true;
  }

  return false;
};

export { sendLeafletEnterEvent, handleLastPageView, addLastPageItemsClickHandlers, handlePageView };
