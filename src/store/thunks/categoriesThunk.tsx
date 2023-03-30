import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { RootState } from "../../hooks/useSelector";
import { categoryService } from "../../services/ApiService/CategoryService";
import { ICategory, ICategoryFormData, ICategoryUpdateData } from "../../types/category";
import { Pagination } from "../../types/pagination";
import { getCategoriesForForm } from "./applicationThunk";

interface GetResponse {
  categories: ICategory[];
  pagination: Pagination
}

export const getCategories = createAsyncThunk<
GetResponse,
  void,
  {state: RootState}
>('categories/getCategories',
  async (_, thunkAPI) => {
    const {config} = thunkAPI.getState().categories;

    const data = {
      categoryType: config.categoryType,
      active: config.active,
      page: config.page,
      perPage: config.perPage,
    }

    const response = await categoryService.list(data);

    const categories = response.data.data
    const pagination = response.data.meta

    return {
      categories,
      pagination,
    }
  }
)

export const createCategory = createAsyncThunk<
ICategory[],
ICategoryFormData,
{state: RootState}
>('categories/createCategory',
  async (data: ICategoryFormData, thunkAPI) => {
    const { config } = thunkAPI.getState().categories
    
    const getValues = {
      categoryType: config.categoryType,
      active: config.active,
      page: config.page,
      perPage: config.perPage,
    }

    try {
      await categoryService.create(data);

      const response = await categoryService.list(getValues);

      thunkAPI.dispatch(getCategoriesForForm())

      return response.data.data
    } catch (err) {
      const error = err as AxiosError
      return thunkAPI.rejectWithValue(error);
    }
  }
)

export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  async (data: ICategoryUpdateData, thunkAPI) => {
    try {
      const response = await categoryService.update(data);

      thunkAPI.dispatch(getCategoriesForForm())

      return response.data
    } catch (err) {
      const error = err as AxiosError
      return thunkAPI.rejectWithValue(error);
    }
  }
)

export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
  async (id: number, thunkAPI) => {
    try {
      await categoryService.delete(id);

      thunkAPI.dispatch(getCategoriesForForm())
      
      return id;
    } catch (err) {
      const error = err as AxiosError
      return thunkAPI.rejectWithValue(error);
    }
  }
)