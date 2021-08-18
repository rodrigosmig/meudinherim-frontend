import axios from 'axios';
import { parseCookies } from 'nookies';

export const setupApiClient = (context = undefined) => {
  const cookies = parseCookies(context);

  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  });

  api.interceptors.request.use(config => {
    const { 'meudinherim.token': token } = cookies;

    config.headers.Authorization =  token ? `Bearer ${token}` : '';
    return config;
  });

  return api;
}

