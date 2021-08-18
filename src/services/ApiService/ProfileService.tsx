import { setupApiClient } from "../api";
import { AxiosRequestConfig, AxiosResponse } from 'axios';

interface ProfileData {
  name: string
  email: string;
  enable_notification: boolean
}

type PasswordFormData = {
  current_password: string
  password: string;
  password_confirmation: string;
}

interface User {
  id: number;
  name: string
  email: string;
  avatar: string;
  enable_notification: boolean
}

interface updateAvatarResponse {
  message: string;
  avatar: string
}

const apiClient = setupApiClient();

export const profileService = {
  updateProfile: (data: ProfileData): Promise<AxiosResponse<User>> => apiClient.put("/users", data),

  updatePassword: (data: PasswordFormData): Promise<AxiosResponse<User>> => apiClient.put("/users/password", data),

  updateAvatar: (formData: FormData, config: AxiosRequestConfig): Promise<AxiosResponse<updateAvatarResponse>> => apiClient.post(
    "/users/avatar",
    formData,
    config
    ),
};
