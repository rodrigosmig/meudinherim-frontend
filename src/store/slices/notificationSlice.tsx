import { createSlice } from "@reduxjs/toolkit";
import { NotificationState } from "../../types/notification";
import { getNotifications, markAllNotificationAsRead, markNotificationAsRead } from "../thunks/notificationThunk";

export const initialState = {
  isLoading: false,
  notifications: []
} as NotificationState

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(
        getNotifications.pending,
        state => {
          state.isLoading = true;
        }
      )
      .addCase(
        getNotifications.fulfilled,
        (state, { payload }) => {
          state.isLoading = false;
          state.notifications = payload;
        }
      )
      .addCase(
        markNotificationAsRead.pending,
        state => {
          state.isLoading = true;
        }
      )
      .addCase(
        markNotificationAsRead.fulfilled,
        state => {
          state.isLoading = false;
        }
      )
      .addCase(
        markNotificationAsRead.rejected,
        state => {
          state.isLoading = false;
        }
      )
      .addCase(
        markAllNotificationAsRead.pending,
        state => {
          state.isLoading = true;
        }
      )
      .addCase(
        markAllNotificationAsRead.fulfilled,
        state => {
          state.isLoading = false;
        }
      )
      .addCase(
        markAllNotificationAsRead.rejected,
        state => {
          state.isLoading = false;
        }
      )
  }
});

export default notificationSlice.reducer;