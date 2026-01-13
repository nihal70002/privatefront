import api from "./axios";

export const getAllOrders = () => api.get("/admin/orders");
export const getOrderDetails = id => api.get(`/admin/orders/${id}`);
export const confirmOrder = id => api.put(`/admin/orders/${id}/confirm`);
export const dispatchOrder = id => api.put(`/admin/orders/${id}/dispatch`);
export const deliverOrder = id => api.put(`/admin/orders/${id}/deliver`);
export const getLowStock = () => api.get("/admin/products/low-stock");
