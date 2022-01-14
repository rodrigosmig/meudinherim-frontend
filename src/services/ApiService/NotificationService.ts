import { AxiosResponse } from "axios";
import { setupApiClient } from "../api";

const apiClient = setupApiClient();

interface Notification {
  id: string;
  type: string;
  data: {
    id: number;
    due_date: string;
    description: string;
    value: number;
    is_parcel: number;
    parcelable_id: number | null
  };
}

interface NotificationResponse {
  data: Notification[];
}

export const notificationService = {
  getNotifications: (): Promise<AxiosResponse<NotificationResponse>> => apiClient.get(`/notifications`),
  markAllAsRead:(): Promise<AxiosResponse> => apiClient.get(`/notifications/all-as-read`),
  markAsRead:(id: string): Promise<AxiosResponse> => apiClient.put(`/notifications/${id}`),
};