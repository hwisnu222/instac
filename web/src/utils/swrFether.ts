import { API_BASE } from "@/config/api";

export const swrFetcher = async (url: string) => {
  const res = await API_BASE.get(url);
  return res.data;
};
