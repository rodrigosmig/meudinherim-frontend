import { CategoryListType } from './../../types/category';
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

const apiClient = setupApiClient(undefined);

export const categoryService = {
  list: (data: CategoryListType): Promise<AxiosResponse<ICategoryResponse>> => apiClient.get(`/categories?type=${data.categoryType}&active=${data.active}&page=${data.page}&per_page=${data.perPage}`),
  getAllByType: (type: CategoryType): Promise<AxiosResponse<ICategoryResponse>> => apiClient.get(`/categories?type=${type}&per_page=1000`),
  listForForm: (): Promise<AxiosResponse<ICategoryForm>> => apiClient.get(`/categories?form=true`),
  update: (values: ICategoryUpdateData): Promise<AxiosResponse<ICategory>> => apiClient.put(`/categories/${values.categoryId}`, values.data),
  delete: (id: number): Promise<AxiosResponse> => apiClient.delete(`/categories/${id}`),
  create: (values: ICategoryFormData): Promise<AxiosResponse<ICategory>> => apiClient.post(`/categories`, values)
};