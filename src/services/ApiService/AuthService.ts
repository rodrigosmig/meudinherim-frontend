import { setupApiClient } from "../api";
import { AxiosResponse } from "axios";
import { IRegisterData, ISignInCredentials, ISignInResponse, IUser } from "../../types/auth";

const apiClient = setupApiClient();

export const authService = {
  register: (data: IRegisterData): Promise<AxiosResponse<IUser>> => apiClient.post(
    "/auth/register",
    data
    ),
  signIn: (credentials: ISignInCredentials): Promise<AxiosResponse<ISignInResponse>> => apiClient.post(
    "/auth/login",
    credentials
    ),  
  signOut: (): Promise<AxiosResponse> => apiClient.post("/auth/logout"),
  me: (): Promise<AxiosResponse<IUser>> => apiClient.get("/auth/me")
};
