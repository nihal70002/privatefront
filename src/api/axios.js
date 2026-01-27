import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7188/api", // 🔥 FORCE LOCALHOST
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

// ✅ Attach token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized – token expired or invalid");
      // localStorage.removeItem("token");
    }
    return Promise.reject(error);
  }
);

export default api;
