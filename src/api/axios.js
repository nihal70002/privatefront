import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // ✅ correct env key
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // ✅ keep false unless using cookies
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

// ✅ Optional: global error handling (very useful)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized – token expired or invalid");
      // optional: logout logic
      // localStorage.removeItem("token");
    }
    return Promise.reject(error);
  }
);

export default api;
