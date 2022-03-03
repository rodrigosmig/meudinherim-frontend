import { setupApiClient } from "../api";
import { AxiosResponse } from "axios";
import { IForgotPasswordData, IForgotPasswordResponse, IRegisterData, IResetPasswordData, ISignInCredentials, ISignInResponse, IUser } from "../../types/auth";

const apiClient = setupApiClient();

interface ResetPasswordData extends IResetPasswordData {
  token: string;
}

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
  me: (): Promise<AxiosResponse<IUser>> => apiClient.get("/auth/me"),
  forgotPassword: (data: IForgotPasswordData): Promise<AxiosResponse<IForgotPasswordResponse>> => apiClient.post("/auth/forgot-password", data),
  resetPassword: (data: ResetPasswordData): Promise<AxiosResponse> => apiClient.post("/auth/reset-password", data),
};
