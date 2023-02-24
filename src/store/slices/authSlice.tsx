import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { tokenService } from "../../services/tokenService";
import { AuthState, IUser } from "../../types/auth";
import { getUser, signIn, logout, updateUser } from "../thunks/authThunk";

export const initialState = {
  isLoading: true,
  token: '',
  user: {},
  isAuthenticated: false,
  isError: false,
  error: {
    statusCode: 0,
    message: ""
  }
} as AuthState

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    changeAvatar: (state, action: PayloadAction<string>) => {
      state.user.avatar = action.payload;
    },
    setAuthenticated: (state) => {
      state.isAuthenticated = true;
    }
  },
  extraReducers(builder) {
    builder
      .addCase(
        signIn.pending,
        state => {
          state.isLoading = true;
          state.isAuthenticated = false;
        }
      )
      .addCase(
        signIn.fulfilled,
        (state, { payload }) => {
          const {token, user} = payload;

          state.isLoading = false;
          state.isAuthenticated = true;
          state.token = token;
          state.user = user;
        }
      )
      .addCase(
        getUser.fulfilled,
        (state, { payload }) => {
          state.user = payload
          state.isLoading = false;
          state.isAuthenticated = true;
        }
      )
      .addCase(
        getUser.pending,
        state => {
          state.isLoading = true;
        }
      )
      .addCase(
        logout.fulfilled,
        () => initialState
      )
      .addCase(
        updateUser.pending,
        state => {
          state.isLoading = true;
        }
      )
      .addCase(
        updateUser.fulfilled,
        (state, { payload }) => {
          state.user = payload
          state.isLoading = false;
        }
      )
  }  
});

export const { setAuthenticated, changeAvatar } = authSlice.actions

export default authSlice.reducer