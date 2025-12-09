
import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_MODE === "development"
    ? "http://localhost:8000/api"
    : "/api";

export const API_BASE = axios.create({
  baseURL: BASE_URL,
});

API_BASE.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("@token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
