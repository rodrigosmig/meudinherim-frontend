import axios from "axios";
import { getApiBaseUrl } from "@/helpers/constants";

export const api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    "Content-Type": "application/json",
    "Accept-Language": "pt-BR",
  },
  timeout: 5000,
});
