import api from "./axios";

export const getProducts = (
  page = 1,
  pageSize = 12,
  categoryIds = [],
  brandId = null,
  search = ""
) => {
  const params = new URLSearchParams();

  params.append("page", page);
  params.append("pageSize", pageSize);

  // 🔥 MULTI CATEGORY SUPPORT
  if (categoryIds && categoryIds.length > 0) {
    categoryIds.forEach(id => {
      params.append("categoryIds", id);
    });
  }

  if (brandId) {
    params.append("brandId", brandId);
  }

  if (search) {
    params.append("search", search);
  }

  return api.get(`/products?${params.toString()}`);
};

export const getProductById = (id) =>
  api.get(`/products/${id}`);