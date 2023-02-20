import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { BroadcastChannel } from 'broadcast-channel';
import Router from 'next/router';
import { authService } from "../../services/ApiService/AuthService";
import { profileService } from '../../services/ApiService/ProfileService';
import { tokenService } from "../../services/tokenService";
import { IProfileUpdateData, ISignInCredentials, ISignInResponse } from "../../types/auth";
import { getNotifications } from "./notificationThunk";

let authChannel = new BroadcastChannel('auth', {
  type: 'native'
});

const signOut = () => {
  authChannel.postMessage("signOut");
  logoff();
}

const logoff = () => {
  tokenService.delete(undefined)
  
  Router.push('/');
  Router.reload()
}

export const logoutAllTabs = () => {
  authChannel.onmessage = (message) => {
    logoff();
    authChannel.close();
  }
}

export const signIn = createAsyncThunk('auth/signIn',
  async (credentials: ISignInCredentials, thunkAPI) => {
    let response = {} as ISignInResponse

    try {
      const signInResponse = await authService.signIn({
        ...credentials,
        device: 'web'
      });
      const { token, user } = signInResponse.data;
      
      tokenService.save(token, null);

      response = {
        ...response,
        token,
        user
      }
    } catch (err) {
      const error = err as AxiosError
      return thunkAPI.rejectWithValue(error);
    }

    thunkAPI.dispatch(getUser());
    thunkAPI.dispatch(getNotifications());
    return response;
  }
)

export const getUser = createAsyncThunk(
  'auth/getUser',
  async (_, thunkAPI) => {
    try {
      const response = await authService.me();

      logoutAllTabs();
      
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
)

export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async (data: IProfileUpdateData, thunkAPI) => {
    try {
      const response = await profileService.updateProfile(data)
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
)

export const updateData = createAsyncThunk(
  'auth/updateData',
  async (_, thunkAPI) => {
    try {
      thunkAPI.dispatch(getUser());
      thunkAPI.dispatch(getNotifications());
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
)

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, thunkAPI) => {
    try {
      await authService.signOut();
      signOut();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
)
