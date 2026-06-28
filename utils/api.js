import axios from "axios";

const getBaseURL = () => {
  // Allow overriding via Vite environment variables (e.g. for cloud hosting)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // If running on Vite dev server (5173) or Tomcat (8080), use relative proxy
  if (window.location.port === "5173" || window.location.port === "8080") {
    return "/api";
  }
  
  // Fallback to local Spring Boot API URL if frontend is deployed on another port
  return "http://localhost:8080/api";
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
