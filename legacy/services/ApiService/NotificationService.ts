import { AxiosResponse } from "axios";
import { INotificationResponse } from "../../types/notification";
import { setupApiClient } from "../api";

const apiClient = setupApiClient(undefined);

export const notificationService = {
  getNotifications: (): Promise<AxiosResponse<INotificationResponse>> => apiClient.get(`/notifications`),
  markAllAsRead:(): Promise<AxiosResponse> => apiClient.get(`/notifications/all-as-read`),
  markAsRead:(id: string): Promise<AxiosResponse> => apiClient.put(`/notifications/${id}`),
};