import axios from "axios";
import { toast } from "react-hot-toast";

// Create Axios instance
const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/v1", // backend base url
});

// Add request interceptor → attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor → handle errors globally
// Add response interceptor → handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const requestUrl = error.config?.url || "";

      // 🚨 Skip login errors → let Login.jsx handle them
      if (requestUrl.includes("/login")) {
        return Promise.reject(error);
      }

      if (error.response.status === 401) {
        // Token expired (but NOT login request)
        toast.error("Session expired. Please login again.");
        localStorage.clear();
        window.location.href = "/login";
      } else if (error.response.status === 403) {
        toast.error("You do not have permission to perform this action.");
      } else if (error.response.data?.detail) {
        toast.error(error.response.data.detail);
      } else {
        toast.error("An error occurred. Please try again.");
      }
    }
    return Promise.reject(error);
  }
);

export default api;
