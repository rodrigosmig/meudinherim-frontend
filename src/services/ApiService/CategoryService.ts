import { AxiosResponse } from "axios";
import { setupApiClient } from "../api";

interface Category {
  id: number,
  type: 1 | 2,
  name: string,
}

type CategoriesResponse = {
  data: Category[];
  meta: {
    from: number;
    to: number;
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  }
}

type CategoriesForForm = {
  income: {
    id: number;
    label: string
  }[]
  expense: {
    id: number;
    label: string
  }[]
}

interface FormData {
  type: number;
  name: string;
}

interface EditCategoryFormData {
  categoryId: number;
  data: FormData;
}

const apiClient = setupApiClient();

export const categoryService = {
  list: (type: string, page: number, perPage: number): Promise<AxiosResponse<CategoriesResponse>> => apiClient.get(`/categories?type=${type}&page=${page}&per_page=${perPage}`),
  getAllByType: (type: 1 | 2): Promise<AxiosResponse<CategoriesResponse>> => apiClient.get(`/categories?type=${type}&per_page=1000`),
  listForForm: (): Promise<AxiosResponse<CategoriesForForm>> => apiClient.get(`/categories?type=all`),
  update: (values: EditCategoryFormData): Promise<AxiosResponse<Category>> => apiClient.put(`/categories/${values.categoryId}`, values.data),
  delete: (id: number): Promise<AxiosResponse> => apiClient.delete(`/categories/${id}`),
  create: (values: FormData): Promise<AxiosResponse<Category>> => apiClient.post(`/categories`, values)
};