import api from "./axios";

// ADD TO CART
export const addToCartApi = (productVariantId, quantity = 1) =>
  api.post("/cart/add", {
    productVariantId,
    quantity
  });

// FIX: Ensure this is exported correctly
export const getCart = () =>
  api.get("/cart");

// REMOVE ITEM
export const removeFromCart = (productVariantId) =>
  api.delete(`/cart/remove/${productVariantId}`);

// UPDATE QUANTITY
export const updateCartQuantity = (productVariantId, quantity) =>
  api.put("/cart/update", {
    productVariantId,
    quantity
  });