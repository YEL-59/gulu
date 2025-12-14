import axios from "axios";

// Base URL for your Laravel API
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://gulu.svaalpha.com/api/v1";

// Public axios instance - for routes that don't require authentication
export const axiosPublic = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
  withCredentials: true, // Include cookies for CSRF
});

// Private axios instance - for routes that require authentication
export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
  withCredentials: true,
});

// Request interceptor for axiosPrivate - adds auth token
axiosPrivate.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      const tokenExpiry = localStorage.getItem("tokenExpiry");
      
      // Check if token exists and is not expired
      if (token && tokenExpiry) {
        const isExpired = Date.now() > parseInt(tokenExpiry, 10);
        if (!isExpired) {
          config.headers.Authorization = `Bearer ${token}`;
        } else {
          // Token expired - clear storage
          localStorage.removeItem("token");
          localStorage.removeItem("tokenExpiry");
          localStorage.removeItem("user");
          localStorage.removeItem("data");
        }
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for axiosPrivate - handles 401 errors
axiosPrivate.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear tokens and redirect to login
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("tokenExpiry");
        localStorage.removeItem("user");
        localStorage.removeItem("data");
        
        // Delete cookies
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        
        // Dispatch auth change event
        window.dispatchEvent(new Event("auth-change"));
        
        // Redirect to signin
        window.location.href = "/auth/signin";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosPrivate;

