import { setupApiClient } from "../api";
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { IAvatarUpdateResponse, IPasswordUpdateData, IProfileUpdateData, IUser } from "../../types/auth";

const apiClient = setupApiClient(undefined);

export const profileService = {
  updateProfile: (data: IProfileUpdateData): Promise<AxiosResponse<IUser>> => apiClient.put("/users", data),

  updatePassword: (data: IPasswordUpdateData): Promise<AxiosResponse<IUser>> => apiClient.put("/users/password", data),

  updateAvatar: (formData: FormData, config: AxiosRequestConfig): Promise<AxiosResponse<IAvatarUpdateResponse>> => apiClient.post(
    "/users/avatar",
    formData,
    config
    ),
};
