import { useContext } from "react";
import { useQuery } from "react-query";
import { AuthContext } from "../contexts/AuthContext";
import { notificationService } from '../services/ApiService/NotificationService';

export const getNotification = async () => {
  const response = await notificationService.getNotifications();
  const data = response.data.data;

  return data
}

export const useNotifications = () => {
  const { user } = useContext(AuthContext);

  return useQuery(['notifications', 1, user?.id], () => getNotification(), {
    staleTime: 1000 * 60 * 30
  })
}