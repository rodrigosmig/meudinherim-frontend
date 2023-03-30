import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { categoryService } from "../../services/ApiService/CategoryService";

export const getCategoriesForForm = createAsyncThunk(
  'application/getCategoriesForForm',
  async (_, thunkAPI) => {
    try {
      const response = await categoryService.listForForm();

      return response.data
    } catch (err) {
      const error = err as AxiosError
      return thunkAPI.rejectWithValue(error);
    }
  }
)