import { useQuery } from "react-query";
import { categoryService } from "../services/ApiService/CategoryService";

export const getCategories = async (type: string) => {
  const response = await categoryService.list(type);
  const categories = response.data.data;

  return categories
}

export const useCategories = (type: string) => {
  return useQuery(['categories', type], () => getCategories(type), {
    staleTime: 1000 * 5
  })
}