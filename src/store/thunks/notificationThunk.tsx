import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { notificationService } from "../../services/ApiService/NotificationService";
import { INotification } from "../../types/notification";

export const getNotifications = createAsyncThunk(
  'notifications/getNotifications',
  async (_, thunkAPI) => {
    try {
      const response = await notificationService.getNotifications();

      return response.data.data      
    } catch (err) {
      const error = err as AxiosError
      return thunkAPI.rejectWithValue(error);
    }
  }
)

export const markNotificationAsRead = createAsyncThunk(
  'notifications/markNotificationAsRead',
  async (id: INotification['id'], thunkAPI) => {
    try {
      await notificationService.markAsRead(id);
      thunkAPI.dispatch(getNotifications())
    } catch (err) {
      const error = err as AxiosError
      return thunkAPI.rejectWithValue(error);
    }
  }
)

export const markAllNotificationAsRead = createAsyncThunk(
  'notifications/markAllNotificationAsRead',
  async (_, thunkAPI) => {
    try {
      await notificationService.markAllAsRead();
      thunkAPI.dispatch(getNotifications())
    } catch (err) {
      const error = err as AxiosError
      return thunkAPI.rejectWithValue(error);
    }
  }
)