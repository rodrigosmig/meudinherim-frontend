import { AxiosResponse } from "axios";
import { IForgotPasswordData, IForgotPasswordResponse, IRegisterData, IResendVerificationEmailData, IResetPasswordData, ISignInCredentials, ISignInResponse, IUser } from "../../types/auth";
import { setupApiClient } from "../api";

const apiClient = setupApiClient(undefined);

interface ResetPasswordData extends IResetPasswordData {
  token: string;
}

export const authService = {
  register: (data: IRegisterData): Promise<AxiosResponse<IUser>> => apiClient.post(
    "/auth/register",
    data,
    {timeout: 5000}
    ),
  signIn: (credentials: ISignInCredentials): Promise<AxiosResponse<ISignInResponse>> => apiClient.post(
    "/auth/login",
    credentials,
    {timeout: 5000}
    ),  
  signOut: (): Promise<AxiosResponse> => apiClient.post("/auth/logout"),
  me: (): Promise<AxiosResponse<IUser>> => apiClient.get("/auth/me"),
  forgotPassword: (data: IForgotPasswordData): Promise<AxiosResponse<IForgotPasswordResponse>> => apiClient.post("/auth/forgot-password", data),
  resetPassword: (data: ResetPasswordData): Promise<AxiosResponse> => apiClient.post("/auth/reset-password", data),
  resendVerificationEmail: (data: IResendVerificationEmailData): Promise<AxiosResponse> => apiClient.post("/auth/resend-email", data),
};
