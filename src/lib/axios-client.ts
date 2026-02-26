import { getApiBaseUrl } from "@/helpers/constants";
import axios from "axios";

export const api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    "Content-Type": "application/json",
    "Accept-Language": "pt-BR",
  },
  timeout: 5000,
});

// Interceptor para logar requisições
// api.interceptors.request.use((config) => {
//   const fullUrl = (config.baseURL || "") + (config.url || "");
//   console.log(
//     "[AXIOS REQUEST]",
//     config.method?.toUpperCase(),
//     fullUrl,
//     config.data || config.params || "",
//   );
//   return config;
// });
