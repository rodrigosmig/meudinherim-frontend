import { AxiosResponse } from "axios";
import { 
  CategoryType, 
  ICategory, 
  ICategoryForm, 
  ICategoryFormData, 
  ICategoryResponse, 
  ICategoryUpdateData 
} from "../../types/category";
import { setupApiClient } from "../api";

const apiClient = setupApiClient();

export const categoryService = {
  list: (type: string, page: number, perPage: number): Promise<AxiosResponse<ICategoryResponse>> => apiClient.get(`/categories?type=${type}&page=${page}&per_page=${perPage}`),
  getAllByType: (type: CategoryType): Promise<AxiosResponse<ICategoryResponse>> => apiClient.get(`/categories?type=${type}&per_page=1000`),
  listForForm: (): Promise<AxiosResponse<ICategoryForm>> => apiClient.get(`/categories?type=all`),
  update: (values: ICategoryUpdateData): Promise<AxiosResponse<ICategory>> => apiClient.put(`/categories/${values.categoryId}`, values.data),
  delete: (id: number): Promise<AxiosResponse> => apiClient.delete(`/categories/${id}`),
  create: (values: ICategoryFormData): Promise<AxiosResponse<ICategory>> => apiClient.post(`/categories`, values)
};