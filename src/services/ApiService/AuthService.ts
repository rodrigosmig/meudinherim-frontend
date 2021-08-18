import { AxiosResponse } from "axios";
import { setupApiClient } from "../api";

type SignInCredentials = {
  email: string;
  password: string
  device: string
}

interface User {
  id: number;
  name: string
  email: string;
  avatar: string;
  enable_notification: boolean
}

type SignInResponse = {
  token: string;
  user: User
}

type RegisterData = {
  name: string
  email: string;
  password: string;
  password_confirmation: string;
  enable_notification: boolean
}

const apiClient = setupApiClient();

export const authService = {
  register: (data: RegisterData): Promise<AxiosResponse<User>> => apiClient.post(
    "/auth/register",
    data
    ),
  signIn: (credentials: SignInCredentials): Promise<AxiosResponse<SignInResponse>> => apiClient.post(
    "/auth/login",
    credentials
    ),  
  signOut: (): Promise<AxiosResponse> => apiClient.post("/auth/logout"),
  me: (): Promise<AxiosResponse<User>> => apiClient.get("/auth/me")
};
