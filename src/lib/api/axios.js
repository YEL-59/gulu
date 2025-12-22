import axios from "axios";
import { setCookie, deleteCookie } from "@/lib/utils/cookies";

// Base URL for your Laravel API
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://gulu.reigeeky.com/api/v1" ;
//"https://gulu.svaalpha.com/api/v1"
// Public axios instance - for routes that don't require authentication
export const axiosPublic = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
  withCredentials: true,
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

// ============================================
// TOKEN REFRESH LOGIC
// ============================================

// Flag to prevent multiple refresh calls at the same time
let isRefreshing = false;
// Queue of requests waiting for token refresh
let refreshSubscribers = [];

// Add request to queue while token is being refreshed
const subscribeTokenRefresh = (callback) => {
  refreshSubscribers.push(callback);
};

// Notify all queued requests with the new token
const onTokenRefreshed = (newToken) => {
  refreshSubscribers.forEach((callback) => callback(newToken));
  refreshSubscribers = [];
};

// Notify all queued requests that refresh failed
const onRefreshFailed = () => {
  refreshSubscribers.forEach((callback) => callback(null));
  refreshSubscribers = [];
};

// Check if error is a CORS or Network error
const isCorsOrNetworkError = (error) => {
  // CORS errors don't have a response object
  // Network errors have error.message containing 'Network Error'
  return (
    !error.response &&
    (error.message === "Network Error" ||
      error.message?.includes("CORS") ||
      error.message?.includes("cross-origin") ||
      error.code === "ERR_NETWORK" ||
      error.code === "ERR_FAILED")
  );
};

// Clear all auth data and redirect to login
const clearAuthAndRedirect = () => {
  if (typeof window !== "undefined") {
    // Clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiry");
    localStorage.removeItem("user");
    localStorage.removeItem("data");

    // Clear sessionStorage
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("tokenExpiry");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("data");

    // Clear cookies
    deleteCookie("token");
    deleteCookie("user");

    // Dispatch auth change event
    window.dispatchEvent(new Event("auth-change"));

    // Redirect to signin
    window.location.href = "/auth/signin";
  }
};

// Save new token to storage
const saveToken = (token, expiryHours = 2) => {
  if (typeof window !== "undefined") {
    const tokenExpiry = Date.now() + expiryHours * 60 * 60 * 1000;
    localStorage.setItem("token", token);
    localStorage.setItem("tokenExpiry", tokenExpiry.toString());
    setCookie("token", token, expiryHours / 24);
  }
};

// Check if token is about to expire (within 5 minutes)
const isTokenExpiringSoon = () => {
  if (typeof window === "undefined") return false;

  const tokenExpiry = localStorage.getItem("tokenExpiry");
  if (!tokenExpiry) return true;

  const expiryTime = parseInt(tokenExpiry, 10);
  const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds

  return Date.now() > expiryTime - fiveMinutes;
};

// Refresh the token with CORS error handling
const refreshToken = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token to refresh");
  }

  try {
    const response = await axios.post(
      `${BASE_URL}/auth/refresh`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        // Timeout to prevent hanging on CORS issues
        timeout: 10000,
      }
    );

    return response.data;
  } catch (error) {
    // Handle CORS or Network errors specifically
    if (isCorsOrNetworkError(error)) {
      console.error("🚫 CORS/Network error during token refresh:", error.message);
      // Don't clear auth for CORS errors - might be temporary
      // Just throw a specific error
      const corsError = new Error("CORS_ERROR");
      corsError.isCorsError = true;
      throw corsError;
    }
    throw error;
  }
};

// ============================================
// REQUEST INTERCEPTOR
// ============================================
axiosPrivate.interceptors.request.use(
  async (config) => {
    if (typeof window === "undefined") return config;

    const token = localStorage.getItem("token");

    if (!token) {
      return config;
    }

    // Check if token is about to expire and we're not already refreshing
    if (isTokenExpiringSoon() && !isRefreshing) {
      isRefreshing = true;

      try {
        console.log("🔄 Token expiring soon, refreshing...");
        const response = await refreshToken();

        if (response.success && response.data?.token) {
          const newToken = response.data.token;
          saveToken(newToken);
          onTokenRefreshed(newToken);
          config.headers.Authorization = `Bearer ${newToken}`;
          console.log("✅ Token refreshed successfully");
        } else {
          throw new Error("Failed to refresh token");
        }
      } catch (error) {
        console.error("❌ Token refresh failed:", error);
        onRefreshFailed();

        // For CORS errors, continue with current token instead of logging out
        if (error.isCorsError) {
          console.warn("⚠️ CORS error - continuing with current token");
          config.headers.Authorization = `Bearer ${token}`;
          isRefreshing = false;
          return config;
        }

        clearAuthAndRedirect();
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    } else if (isRefreshing) {
      // If already refreshing, wait for the new token
      return new Promise((resolve) => {
        subscribeTokenRefresh((newToken) => {
          if (newToken) {
            config.headers.Authorization = `Bearer ${newToken}`;
            resolve(config);
          } else {
            // Refresh failed, use current token
            const currentToken = localStorage.getItem("token");
            if (currentToken) {
              config.headers.Authorization = `Bearer ${currentToken}`;
            }
            resolve(config);
          }
        });
      });
    } else {
      // Token is still valid, use it
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ============================================
// RESPONSE INTERCEPTOR
// ============================================
axiosPrivate.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle CORS/Network errors
    if (isCorsOrNetworkError(error)) {
      console.error("🚫 CORS/Network error:", error.message);
      
      // Create a user-friendly error
      const friendlyError = new Error(
        "Unable to connect to server. Please check your internet connection or try again later."
      );
      friendlyError.isCorsError = true;
      friendlyError.originalError = error;
      
      return Promise.reject(friendlyError);
    }

    // If 401 error and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // If already refreshing, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          subscribeTokenRefresh((newToken) => {
            if (newToken) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              resolve(axiosPrivate(originalRequest));
            } else {
              reject(error);
            }
          });
        });
      }

      isRefreshing = true;

      try {
        console.log("🔄 Got 401, attempting token refresh...");
        const response = await refreshToken();

        if (response.success && response.data?.token) {
          const newToken = response.data.token;
          saveToken(newToken);
          onTokenRefreshed(newToken);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          console.log("✅ Token refreshed, retrying request");
          return axiosPrivate(originalRequest);
        } else {
          throw new Error("Failed to refresh token");
        }
      } catch (refreshError) {
        console.error("❌ Token refresh failed on 401:", refreshError);
        onRefreshFailed();

        // For CORS errors on refresh, don't redirect - just reject
        if (refreshError.isCorsError) {
          console.warn("⚠️ CORS error during 401 refresh - not redirecting");
          return Promise.reject(refreshError);
        }

        clearAuthAndRedirect();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // For other errors, just reject
    return Promise.reject(error);
  }
);

// ============================================
// PUBLIC AXIOS CORS HANDLING
// ============================================
axiosPublic.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle CORS/Network errors for public requests too
    if (isCorsOrNetworkError(error)) {
      console.error("🚫 CORS/Network error (public):", error.message);
      
      const friendlyError = new Error(
        "Unable to connect to server. Please check your internet connection or try again later."
      );
      friendlyError.isCorsError = true;
      friendlyError.originalError = error;
      
      return Promise.reject(friendlyError);
    }
    
    return Promise.reject(error);
  }
);

export default axiosPrivate;
