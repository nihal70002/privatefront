import api from "./axios";

export const getSalesSummary = () =>
  api.get("/admin/reports/summary");

export const getMonthlySales = (year) =>
  api.get(`/admin/reports/monthly?year=${year}`);

export const getTopProducts = () =>
  api.get("/admin/reports/top-products");
