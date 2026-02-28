import { getSessionToken } from "@/helpers/session";
import { getApiBaseUrl } from "@/helpers/constants";
import axios from "axios";

export const httpClient = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    "Content-Type": "application/json",
    "Accept-Language": "pt-BR",
  },
  timeout: 5000,
});

httpClient.interceptors.request.use(async (config) => {
  const token = await getSessionToken();

  config.headers.Authorization = token ? `Bearer ${token}` : "";
  return config;
});
