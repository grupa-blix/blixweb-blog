const handleInserts = (embed, swiper) => {
  const nextBtn = embed.querySelector(".swiper-button-next");
  const prevBtn = embed.querySelector(".swiper-button-prev");
  const emb = embed;
  const swp = swiper;
  let currentInsertSlide;
  let currentInsertPageWrapper;
  let scrolling = false;
  let initialTouch;

  const isInsertActive = () => currentInsertPageWrapper.classList.contains("page-wrapper--insert");

  const showInsert = () => currentInsertPageWrapper.classList.add("page-wrapper--insert");

  const hideInsert = () => currentInsertPageWrapper.classList.remove("page-wrapper--insert");

  const setLeafletInsertsPosition = () => {
    const slides = emb.querySelectorAll(".swiper-slide");
    const currentSlideIndex = swp.realIndex;

    slides.forEach((slide) => {
      const slideInsert = slide.querySelector(".insert-wrapper");

      if (slideInsert) {
        const pageWrapper = slideInsert.closest(".page-wrapper");
        const isActive = pageWrapper.classList.contains("page-wrapper--insert");
        const { swiperSlideIndex } = slide.dataset;

        if (!isActive && currentSlideIndex > swiperSlideIndex) {
          pageWrapper.classList.add("page-wrapper--insert");
        }

        if (isActive && currentSlideIndex < swiperSlideIndex) {
          pageWrapper.classList.remove("page-wrapper--insert");
        }
      }
    });
  };

  const handleInsertZoom = () => {
    if (currentInsertSlide) {
      const active = isInsertActive();
      if (active) {
        swp.params.zoom.maxRatio = 1;
        return;
      }
    }

    swp.params.zoom.maxRatio = 2;
  };

  const handleInsertPagination = () => {
    if (!currentInsertSlide) return;

    const active = isInsertActive();
    const currentPage = emb.querySelector(".page-number--current");

    if (active) {
      currentPage.innerText = "AD";
    } else {
      const currentSlidePages = emb.querySelectorAll(".swiper-slide-active .page-img");
      const pageNumbers = [];

      currentSlidePages.forEach((page) => {
        const { pageNumber } = page.dataset;

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

  const handleInsertView = async () => {
    if (!currentInsertSlide) return;

    const active = isInsertActive();
    if (!active) return;

    const insert = currentInsertSlide.querySelector(".insert-wrapper");
    const viewUrlItems = [...insert.querySelectorAll("[data-view-url]")];
    const viewUrls = viewUrlItems.map((item) => item.dataset.viewUrl);
    viewUrls.map(async (url) => {
      const response = await fetch(url, { method: "GET" });
      return response.json();
    });
  };

  const handleInsertClick = async () => {
    if (!currentInsertSlide) return;

    const active = isInsertActive();
    if (!active) return;

    const insert = currentInsertSlide.querySelector(".insert-wrapper");
    const { clickUrl } = insert.dataset;
    const clickUrlItems = [...insert.querySelectorAll("[data-click-url]")];
    const clickUrls = clickUrlItems.map((item) => item.dataset.clickUrl);
    const anchor = document.createElement("a");
    anchor.classList.add("d-none");
    anchor.href = clickUrl;
    if (!clickUrl.includes(window.location.origin)) anchor.target = "__blank";
    document.body.appendChild(anchor);

    await Promise.all(
      clickUrls.map(async (url) => {
        const response = await fetch(url, { method: "GET" });
        return response.json();
      })
    );

    anchor.click();
  };

  const toggleInsert = (direction) => {
    const active = isInsertActive();

    if (active) {
      if (direction === "prev") {
        hideInsert();
        handleInsertZoom();
        handleInsertPagination();
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
      handleInsertZoom();
      handleInsertView();
      handleInsertPagination();
    }
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

  swp.on("slideChangeTransitionEnd", () => {
    const insert = embed.querySelector(".swiper-slide-active .insert-wrapper");

    if (insert) {
      console.log(123);
      swp.allowSlideNext = false;
      swp.allowSlidePrev = false;
      currentInsertSlide = insert.closest(".swiper-slide");
      currentInsertPageWrapper = insert.closest(".page-wrapper");
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
      currentInsertPageWrapper = null;
    }

    setLeafletInsertsPosition();
    handleInsertZoom();
    handleInsertView();
    handleInsertPagination();
  });
};

export default handleInserts;
