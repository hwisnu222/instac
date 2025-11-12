import axios from "axios";

const BASE_URL =
  import.meta.env.NODE_ENV === "production"
    ? "/api"
    : "http://localhost:8000/api";

export const API_BASE = axios.create({
  baseURL: BASE_URL,
});
