import api from "./axios";

export const getProducts = (
  page = 1,
  pageSize = 12,
  categoryId = null,
  brandId = null,
  search = ""
) => {
  let url = `/products?page=${page}&pageSize=${pageSize}`;

  if (categoryId) url += `&categoryId=${categoryId}`;
  if (brandId) url += `&brandId=${brandId}`;
  if (search) url += `&search=${encodeURIComponent(search)}`;

  return api.get(url);
};
export const getProductById = (id) =>
  api.get(`/products/${id}`);
