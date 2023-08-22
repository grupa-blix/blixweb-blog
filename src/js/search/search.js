import { isDesktop } from "../utils";

//const searchForm = document.querySelector("form.search");
// const searchURL = Routing.generate("autocomplete-post");
const searchCloseBtn = document.querySelector(".search__button-close");
const autocomplete = document.querySelector(".autocomplete");
const overlay = document.querySelector(".search-overlay");
const searchInput = document.querySelector(".search__input");
const searchShowBtn = document.querySelector(".btn-show-search");
const searchContainer = document.querySelector(".search-container");

const showSearch = () => {
  searchShowBtn.classList.add("hidden");
  searchContainer.classList.remove("d-none");
};

const hideSearch = () => {
  searchShowBtn.classList.remove("hidden");
  searchContainer.classList.add("d-none");
};

const showOverlay = () => {
  overlay.classList.add("visible");
  searchCloseBtn.classList.add("search__button-close--visible");
};

const hideOverlay = () => {
  overlay.classList.remove("visible");
  searchCloseBtn.classList.remove("search__button-close--visible");
  //   autocomplete.classList.remove("autocomplete--visible");
  searchInput.value = "";
};

const setSearchPosition = () => {
  const menuLastItem = document.querySelector(".navbar__menu-items > .navbar__menu-item:last-of-type");
  if (!menuLastItem) return;

  const menuLastItemWidth = menuLastItem.offsetWidth;

  if (isDesktop()) {
    searchContainer.style.right = `${menuLastItemWidth + 56}px`;
  } else {
    searchContainer.style.right = 0;
  }
};

// const generateItem = ({ name }) => `<li>${name}</li>`;

// const generateItemWithImg = ({ link, img, name }) => {
//   const content = `<img src="${img}" alt="${name}"/>${name}`;

//   if (link) {
//     return `<li><a href="${link}">${content}</a></li>`;
//   }

//   return `<li>${content}</li>`;
// };

// const generateList = (container, data) => {
//   const { title, items } = data;
//   const autocompleteContainer = container;
//   const autocompleteTitle = autocompleteContainer.querySelector('.title_bar');
//   const autocompleteList = autocompleteContainer.querySelector('ul');

//   if (items.length === 0) {
//     autocompleteContainer.style.display = 'none';
//   } else {
//     autocompleteContainer.style.display = 'block';
//     autocompleteTitle.innerText = title;
//     autocompleteList.innerHTML = items
//       .map((item) => (item.img ? generateItemWithImg(item) : generateItem(item)))
//       .join('');
//   }
// };

// const addAutocompleteItemsClickHandler = () => {
//   const autocompleteItems = autocomplete.querySelectorAll('li');
//   autocompleteItems.forEach((item) => {
//     item.addEventListener('click', () => {
//       const hasAnchor = item.querySelector('a');

//       if (!hasAnchor) {
//         searchInput.value = item.innerText;
//         searchForm.submit();
//       }
//     });
//   });
// };

// const search = async () => {
//   const query = new URLSearchParams({ query: searchInput.value });
//   const autocompleteProducts = autocomplete.querySelector('.products');
//   const autocompleteBrands = autocomplete.querySelector('.brands');

//   const req = axios.post(searchURL, query, {
//     headers: {
//       'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
//     },
//   });

//   const res = await req;
//   const { products, brands } = res.data;

//   generateList(autocompleteProducts, products);
//   generateList(autocompleteBrands, brands);
//   addAutocompleteItemsClickHandler();

//   autocomplete.classList.add('autocomplete--visible');
// };

const addSearchHandlers = () => {
  setSearchPosition();

  searchShowBtn.addEventListener("click", () => {
    showSearch();
    searchInput.focus();
  });

  searchInput.addEventListener("keyup", () => {
    // search();
    showOverlay();
  });
  searchInput.addEventListener("focus", () => {
    // search();
    showOverlay();
  });

  overlay.addEventListener("click", () => {
    hideSearch();
    hideOverlay();
  });
  searchCloseBtn.addEventListener("click", () => {
    hideSearch();
    hideOverlay();
  });
};

window.addEventListener("DOMContentLoaded", () => {
  addSearchHandlers();
  setSearchPosition();
});

window.addEventListener("resize", () => {
  setSearchPosition();
});
