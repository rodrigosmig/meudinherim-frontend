export interface NotificationState {
  isLoading: boolean;
  notifications: INotification[];
}

export interface INotification {
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

export interface INotificationResponse {
  data: INotification[];
}