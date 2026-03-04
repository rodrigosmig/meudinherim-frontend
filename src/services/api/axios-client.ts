import { getApiBaseUrl } from "@/helpers/route-helpers";
import axios from "axios";

export const httpClient = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    "Content-Type": "application/json",
    "Accept-Language": "pt-BR",
  },
  timeout: 5000,
});
