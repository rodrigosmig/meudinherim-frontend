import { getSessionToken } from "@/helpers/session";
import { getApiBaseUrl } from "@/helpers/constants";
import axios from "axios";

export const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    "Content-Type": "application/json",
    "Accept-Language": "pt-BR",
  },
  timeout: 5000,
});

apiClient.interceptors.request.use(async (config) => {
  const token = await getSessionToken();
  console.log("Token adicionado ao cabeçalho Authorization:", token);
  config.headers.Authorization = token ? `Bearer ${token}` : "";
  return config;
});
