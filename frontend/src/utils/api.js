import axios from "axios";
import {push} from "next/navigation";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // Change this to your backend URL
  withCredentials: true, // Needed for HttpOnly cookie-based auth
});

// 🔐 Attach JWT to every request
API.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ❌ Handle API Errors & Redirect Unauthorized Users
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        // Handle unauthorized access
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");

          // Use Next.js router for navigation
          push("/login");
        }
      }
      return Promise.reject(error.response.data);
    }
    return Promise.reject("Network error, try again later!");
  }
);

export default API;
