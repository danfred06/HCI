import axios from "axios";

// Vite inlines VITE_API_URL at build time. Normalize it so Render may supply
// either a full URL or just a hostname, with or without the /api suffix.
const configured = import.meta.env.VITE_API_URL || "http://127.0.0.1:8100/api";
let baseURL = String(configured).trim().replace(/\/+$/, "");
if (!/^https?:\/\//i.test(baseURL)) baseURL = `https://${baseURL}`;
if (!/\/api$/.test(baseURL)) baseURL += "/api";

const api = axios.create({
  baseURL,
  headers: { Accept: "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && localStorage.getItem("token")) {
      localStorage.removeItem("token");
      window.dispatchEvent(new Event("auth:unauthorized"));
    }
    return Promise.reject(error);
  },
);

export default api;
