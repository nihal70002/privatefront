import api from "./axios";

// USER ORDERS
export const getMyOrders = () => api.get("/orders/my");

export const getOrderDetails = (orderId) =>
  api.get(`/orders/my/${orderId}`);
