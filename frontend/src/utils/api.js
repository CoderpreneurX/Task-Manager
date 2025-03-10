import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // Change this to your backend URL
  withCredentials: true, // Needed for HttpOnly cookie-based auth
});

// 🔐 Attach JWT to every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ❌ Handle API Errors Globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        // Handle unauthorized (e.g., redirect to login)
        localStorage.removeItem("token");
        window.location.href = "/login"; // Adjust this based on your router
      }
      return Promise.reject(error.response.data);
    }
    return Promise.reject("Network error, try again later!");
  }
);

export default API;
