import { isDesktop } from "../utils";

const itemsWithChildren = document.querySelectorAll(".navbar .has-children");
const burgerBtn = document.querySelector(".navbar__burger-btn");
const navbarOverlay = document.querySelector(".navbar__overlay");
const timeout = 200;
let anchorClicked = false;

const toggleMobileMenuClasses = () => {
  const html = document.querySelector("html");
  const menuItemsWrapper = document.querySelector(".navbar__menu-items-wrapper");

  burgerBtn.classList.toggle("opened");
  html.classList.toggle("noscroll");
  menuItemsWrapper.classList.toggle("loading");
  menuItemsWrapper.classList.toggle("active");

  setTimeout(() => {
    menuItemsWrapper.classList.toggle("loading");
  }, timeout);
};

const removeDesktopSubmenuClasses = () => {
  const openedItem = document.querySelector(".navbar__menu-item.opened");
  openedItem.classList.remove("opened");
};

const untrimKeywords = (item) => {
  const keywords = [...item.querySelectorAll(".keywords a")];

  keywords.forEach((keyword) => {
    const newKeyword = keyword;

    newKeyword.style.display = "inline-block";
    newKeyword.classList.remove("comma-hidden");
  });
};

const trimKeywords = (item) => {
  const keywordsWrappers = item.querySelectorAll(".keywords");

  keywordsWrappers.forEach((wrapper) => {
    const wrapperHeight = wrapper.offsetHeight;
    const keywords = [...wrapper.querySelectorAll("a")].reverse();

    keywords.forEach((keyword, index) => {
      const currentKeyword = keyword;
      const nextKeyword = keywords[index + 1];

      const isOverflowed = currentKeyword.offsetTop + currentKeyword.offsetHeight > wrapperHeight;

      if (isOverflowed) {
        currentKeyword.style.display = "none";

        if (nextKeyword) nextKeyword.classList.add("comma-hidden");
      }
    });
  });
};

const openSubmenu = (item) => {
  item.classList.add("opened");
  navbarOverlay.classList.add("visible");

  if (isDesktop()) {
    untrimKeywords(item);
    trimKeywords(item);
  }
};

const switchSubmenu = (item, openedItem) => {
  openedItem.classList.remove("opened");
  item.classList.add("opened");
};

const closeSubmenu = (item) => {
  item.classList.remove("opened");
  navbarOverlay.classList.remove("visible");
};

const handleFirstScroll = () => {
  document.body.classList.add("scrolled");
  window.removeEventListener("scroll", handleFirstScroll);
};

window.addEventListener("DOMContentLoaded", () => {
  burgerBtn.addEventListener("click", () => {
    toggleMobileMenuClasses();
  });

  itemsWithChildren.forEach((item) => {
    const anchors = item.querySelectorAll("a");

    item.addEventListener("mouseenter", () => {
      if (isDesktop() && !anchorClicked) openSubmenu(item);
    });

    item.addEventListener("mouseleave", () => {
      if (isDesktop()) closeSubmenu(item);
    });

    item.addEventListener("pointerdown", () => {
      const openedItem = document.querySelector(".navbar__menu-item.opened");
      if (!openedItem) {
        openSubmenu(item);
      } else if (openedItem === item) {
        closeSubmenu(item);
      } else {
        switchSubmenu(item, openedItem);
      }
    });

    anchors.forEach((anchor) => {
      anchor.addEventListener("pointerdown", (e) => {
        anchorClicked = true;
        e.stopPropagation();
      });
    });
  });
});

window.addEventListener("resize", () => {
  const isMobileMenuOpened = document.querySelector(".navbar__menu-items-wrapper.active");
  const isDesktopSubmenuOpened = document.querySelector(".navbar__menu-item.opened");

  if (isMobileMenuOpened) {
    toggleMobileMenuClasses();
  }

  if (isDesktopSubmenuOpened) {
    removeDesktopSubmenuClasses();
  }
});

window.addEventListener("scroll", handleFirstScroll);
