import axios from "axios";

const BASE_URL =
  import.meta.env.NODE_ENV === "development"
    ? "http://localhost:8000/api"
    : "/api";

export const API_BASE = axios.create({
  baseURL: BASE_URL,
});
