import { getBrandUrl } from "../utils";

const getPriorityBrands = async () => {
  const res = await fetch("https://fancy.blix.app/api/blog/brands/selected");
  const data = await res.json();
  return data.brands;
};

const createBrandItem = (brand) => {
  const li = document.createElement("li");
  const { name, slug } = brand;
  const url = getBrandUrl(slug);
  li.innerHTML = `<a href="${url}">${name}</a>`;
  return li;
};

window.addEventListener("DOMContentLoaded", async () => {
  const footerBrands = document.querySelector("footer .brands");
  const footerBrandsWrapper = footerBrands.querySelector(".footer__grid");
  const brands = await getPriorityBrands();

  brands.forEach((brand) => {
    footerBrandsWrapper.appendChild(createBrandItem(brand));
  });
});
