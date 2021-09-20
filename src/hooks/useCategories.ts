import { useQuery } from "react-query";
import { categoryService } from "../services/ApiService/CategoryService";

export const getCategories = async (type: string, page: number, perPage: number) => {
  const response = await categoryService.list(type, page, perPage);
  const data = {
    categories: response.data.data,
    meta: {
      from: response.data.meta.from,
      to: response.data.meta.to,
      current_page: response.data.meta.current_page,
      last_page: response.data.meta.last_page,
      per_page: response.data.meta.per_page,
      total: response.data.meta.total
    }
  }

  return data
}

export const getCategoriesForForm = async () => {
  const response = await categoryService.listForForm();

  const data = response.data

  return data;
}

export const useCategories = (type: string, page: number, perPage: number) => {
  return useQuery(['categories', type, page, perPage], () => getCategories(type, page, perPage), {
    staleTime: 1000 * 5
  })
}