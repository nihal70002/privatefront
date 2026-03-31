import api from "./axios";

export const getMyOrders = () => api.get("/orders/my");

export const getOrderDetails = (orderId) =>
  api.get(`/orders/my/${orderId}`);

export const cancelOrder = (orderId) =>
  api.delete(`/orders/${orderId}/cancel`);

export const editOrder = (orderId, data) =>
  api.put(`/orders/${orderId}/edit`, data);