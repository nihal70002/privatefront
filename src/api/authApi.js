import api from "./axios";

export const loginApi = (loginId, password) =>
  api.post("/auth/login", { loginId, password });
