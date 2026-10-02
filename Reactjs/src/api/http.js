import axios from "axios";

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const TOKEN_KEY = "bal_token";

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

const http = axios.create({
  baseURL: API_URL,
  headers: { Accept: "application/json" },
});

http.interceptors.request.use((config) => {
  const token = tokenStore.get();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// The auth context registers a handler here so an expired token logs the user out everywhere.
let onUnauthorized = () => {};
export const setUnauthorizedHandler = (handler) => {
  onUnauthorized = handler;
};

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && tokenStore.get() && !error.config?.skipAuthRedirect) {
      onUnauthorized();
    }
    return Promise.reject(error);
  }
);

/** Human readable message for any failed request. */
export const errorMessage = (error, fallback = "Something went wrong. Please try again.") => {
  if (!error.response) {
    return "Cannot reach the server. Check that the API is running.";
  }
  return error.response.data?.message || fallback;
};

/** Laravel validation errors as { field: "first message" }. */
export const fieldErrors = (error) => {
  const errors = error.response?.status === 422 ? error.response.data?.errors : null;
  if (!errors) return {};
  return Object.fromEntries(Object.entries(errors).map(([field, messages]) => [field, messages[0]]));
};

export default http;
