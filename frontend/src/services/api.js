// This file is used to create an instance of axios with a base URL
// and interceptors to refresh the JWT automatically before it expires.
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api",
  withCredentials: true,
});

const getTokenPayload = (token) => {
  try {
    const payload = token.split(".")[1];
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = atob(normalized);
    const binary = decoded
      .split("")
      .map((char) => `%${`00${char.charCodeAt(0).toString(16)}`.slice(-2)}`)
      .join("");

    return JSON.parse(decodeURIComponent(binary));
  } catch (error) {
    return null;
  }
};

const shouldRefreshToken = (token) => {
  const payload = getTokenPayload(token);

  if (!payload || !payload.exp) {
    return false;
  }

  const expiresAt = payload.exp * 1000;
  const refreshThreshold = 60 * 1000;

  return Date.now() >= expiresAt - refreshThreshold;
};

let isRefreshing = false;
let refreshSubscribers = [];

const notifyRefreshSubscribers = (newToken) => {
  refreshSubscribers.forEach((callback) => callback(newToken));
  refreshSubscribers = [];
};

const refreshAccessToken = async () => {
  if (isRefreshing) {
    return new Promise((resolve) => {
      refreshSubscribers.push(resolve);
    });
  }

  isRefreshing = true;

  try {
    const response = await axios.post(
      "http://localhost:4000/api/auth/refresh-token",
      {},
      { withCredentials: true },
    );

    const newToken = response.data.token;
    localStorage.setItem("token", newToken);
    notifyRefreshSubscribers(newToken);

    return newToken;
  } catch (error) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
    throw error;
  } finally {
    isRefreshing = false;
  }
};

api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("token");

    if (!token) {
      return config;
    }

    if (config.url?.includes("/auth/refresh-token")) {
      return config;
    }

    if (shouldRefreshToken(token)) {
      try {
        const newToken = await refreshAccessToken();
        config.headers.Authorization = `Bearer ${newToken}`;
        return config;
      } catch (error) {
        return Promise.reject(error);
      }
    }

    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (
      error.response?.status === 401 &&
      !originalRequest.url?.includes("/auth/refresh-token")
    ) {
      originalRequest._retry = true;

      try {
        const newToken = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
