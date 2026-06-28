import axios from "axios";

const getBaseURL = () => {
  // 1. Allow overriding via Vite environment variables (e.g. for custom staging)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // 2. If running on local dev server (5173) or local Tomcat (8080), use relative proxy
  if (window.location.port === "5173" || window.location.port === "8080") {
    return "/api";
  }
  
  // 3. If running locally on a different port, use the local Spring Boot URL
  if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
    return "http://localhost:8080/api";
  }
  
  // 4. If deployed on the internet (e.g. Vercel), default to the live Railway backend URL
  return "https://stationery-nook-production.up.railway.app/api";
};

const API = axios.create({
  baseURL: getBaseURL(),
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically inject JWT token from localStorage if available
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;
