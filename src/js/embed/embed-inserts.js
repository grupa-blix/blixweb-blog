const handleInserts = (embed, swiper) => {
  const nextBtn = embed.querySelector(".swiper-button-next");
  const prevBtn = embed.querySelector(".swiper-button-prev");
  const emb = embed;
  const swp = swiper;
  let currentInsertSlide;
  let scrolling = false;
  let initialTouch;

  const isInsertActive = () => currentInsertSlide.querySelector(".page-wrapper--insert");

  const showInsert = () => {
    const insertToShow = currentInsertSlide.querySelector(".page-wrapper:not(.page-wrapper--insert) .insert-wrapper");
    const insertWrapper = insertToShow.closest(".page-wrapper");
    insertWrapper.classList.add("page-wrapper--insert");
  };

  const hideInsert = () => {
    const inserts = currentInsertSlide.querySelectorAll(".page-wrapper--insert");
    const insertToHide = inserts[inserts.length - 1];
    insertToHide.classList.remove("page-wrapper--insert");
  };

  const setLeafletInsertsPosition = () => {
    const slides = emb.querySelectorAll(".swiper-slide");
    const currentSlideIndex = swp.realIndex;

    slides.forEach((slide) => {
      const slideInserts = slide.querySelectorAll(".insert-wrapper");

      slideInserts.forEach((insert) => {
        const pageWrapper = insert.closest(".page-wrapper");
        const isActive = pageWrapper.classList.contains("page-wrapper--insert");
        const { swiperSlideIndex } = slide.dataset;

        if (!isActive && currentSlideIndex > swiperSlideIndex) {
          pageWrapper.classList.add("page-wrapper--insert");
        }

        if (isActive && currentSlideIndex < swiperSlideIndex) {
          pageWrapper.classList.remove("page-wrapper--insert");
        }
      });
    });
  };

  const handleInsertZoom = () => {
    const zoomInBtn = emb.querySelector(".swiper__zoom-in-btn");
    const zoomOutBtn = emb.querySelector(".swiper__zoom-out-btn");

    if (currentInsertSlide) {
      const active = isInsertActive();
      if (active) {
        swp.params.zoom.maxRatio = 1;
        zoomInBtn.classList.add("d-none");
        zoomOutBtn.classList.add("d-none");
        return;
      }
    }

    swp.params.zoom.maxRatio = 2;
    zoomInBtn.classList.remove("d-none");
    zoomOutBtn.classList.remove("d-none");
  };

  const handleInsertPagination = () => {
    if (!currentInsertSlide) return;

    const active = isInsertActive();
    const currentPage = emb.querySelector(".page-number--current");

    if (active) {
      currentPage.innerText = "AD";
    } else {
      const currentSlidePages = emb.querySelectorAll(".swiper-slide-active .page-wrapper");
      const pageNumbers = [];

      currentSlidePages.forEach((page) => {
        const { pageIndex: pageNumber } = page.dataset;

        if (!pageNumber) return;
        if (!pageNumbers.includes(pageNumber)) {
          pageNumbers.push(pageNumber);
        }
      });

      if (pageNumbers.length === 2) {
        const [firstNumber, secondNumber] = pageNumbers;
        currentPage.innerText = `${firstNumber} - ${secondNumber}`;
      } else if (pageNumbers.length === 1) {
        const [firstNumber] = pageNumbers;
        currentPage.innerText = firstNumber;
      }
    }
  };

  const addPixel = (url) => {
    const img = document.createElement("img");
    img.width = 0;
    img.height = 0;
    img.src = url;
    document.body.appendChild(img);
  };

  const sendDataLayer = (action) => {
    const currentPage = emb.querySelector(".swiper-slide-active .page-wrapper");
    const { leafletId, leafletName, brandId, brandName } = currentPage.dataset;

    dataLayer.push({
      event: "ADINSERT",
      leafletId,
      leafletName,
      brandId,
      brandName,
      action,
    });

    dataLayer.push(function () {
      this.reset();
    });
  };

  const handleInsertView = async () => {
    if (!currentInsertSlide) return;

    const active = isInsertActive();
    if (!active) return;

    const insert = currentInsertSlide.querySelector(".insert-wrapper");
    const viewUrlItems = [...insert.querySelectorAll("[data-view-url]")];
    const viewUrls = viewUrlItems.map((item) => item.dataset.viewUrl);
    // viewUrls.map((url) => addPixel(url));
    // sendDataLayer("view");
  };

  const handleInsertClick = async () => {
    if (!currentInsertSlide) return;

    const active = isInsertActive();
    if (!active) return;

    const insert = currentInsertSlide.querySelector(".insert-wrapper");
    const insertImg = insert.querySelector(".insert-img");
    if (e.target !== insertImg) return;

    const { clickUrl } = insert.dataset;
    const clickUrlItems = [...insert.querySelectorAll("[data-click-url]")];
    const clickUrls = clickUrlItems.map((item) => item.dataset.clickUrl);
    clickUrls.map((url) => addPixel(url));
    sendDataLayer("click");

    const anchor = document.createElement("a");
    anchor.classList.add("d-none");
    anchor.href = clickUrl;
    document.body.appendChild(anchor);
    setTimeout(() => {
      anchor.click();
    }, 500);
  };

  const toggleInsert = (direction) => {
    const active = isInsertActive();
    const hasSecondInsert = currentInsertSlide.querySelector(
      ".page-wrapper:not(.page-wrapper--insert) .insert-wrapper"
    );

    if (active) {
      if (direction === "prev") {
        hideInsert();
      } else if (hasSecondInsert) {
        showInsert();
        handleInsertView();
      } else {
        swp.allowSlideNext = true;
        swp.allowSlidePrev = true;
        swp.slideNext();
      }
    } else if (direction === "prev") {
      swp.allowSlideNext = true;
      swp.allowSlidePrev = true;
      swp.slidePrev();
    } else {
      showInsert();
      handleInsertView();
    }

    handleInsertZoom();
    handleInsertPagination();
  };

  const insertPrevBtnHandler = () => toggleInsert("prev");

  const insertNextBtnHandler = () => toggleInsert("next");

  const insertWheelHandler = (e) => {
    const { deltaX, deltaY } = e;
    const isScrolledHorizontaly = Math.abs(deltaY) === 0;

    if (isScrolledHorizontaly && !scrolling) {
      const direction = deltaX > 0 ? "next" : "prev";
      toggleInsert(direction);
    }

    scrolling = true;
    setTimeout(() => {
      scrolling = false;
    }, 1000);
  };

  const insertPointerUpHandler = (e) => {
    const isZoomed = currentInsertSlide.classList.contains("swiper-slide-zoomed");

    if (isZoomed) return;

    const difference = initialTouch - e.pageX;

    if (Math.abs(difference) > 100) {
      const direction = initialTouch < e.pageX ? "prev" : "next";
      toggleInsert(direction);
    } else {
      handleInsertClick();
    }

    initialTouch = null;
  };

  const insertPointerDownHandler = (e) => {
    initialTouch = e.pageX;
  };

  const callInsert = () => {
    const insert = embed.querySelector(".swiper-slide-active .insert-wrapper");

    if (insert) {
      swp.allowSlideNext = false;
      swp.allowSlidePrev = false;
      currentInsertSlide = insert.closest(".swiper-slide");
      prevBtn.addEventListener("click", insertPrevBtnHandler);
      nextBtn.addEventListener("click", insertNextBtnHandler);
      currentInsertSlide.addEventListener("wheel", insertWheelHandler);
      currentInsertSlide.addEventListener("pointerdown", insertPointerDownHandler);
      currentInsertSlide.addEventListener("pointerup", insertPointerUpHandler);
    } else if (currentInsertSlide) {
      swp.allowSlideNext = true;
      swp.allowSlidePrev = true;
      prevBtn.removeEventListener("click", insertPrevBtnHandler);
      nextBtn.removeEventListener("click", insertNextBtnHandler);
      currentInsertSlide.removeEventListener("wheel", insertWheelHandler);
      currentInsertSlide.removeEventListener("pointerdown", insertPointerDownHandler);
      currentInsertSlide.removeEventListener("pointerup", insertPointerUpHandler);
      currentInsertSlide = null;
    }

    setLeafletInsertsPosition();
    handleInsertZoom();
    handleInsertView();
    handleInsertPagination();
  };

  callInsert();

  swp.on("slideChangeTransitionEnd", () => {
    callInsert();
  });
};

export default handleInserts;
