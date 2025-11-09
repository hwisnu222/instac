import axios from "axios";

export const API_BASE = axios.create({
  baseURL: "http://localhost:8000/api",
});
