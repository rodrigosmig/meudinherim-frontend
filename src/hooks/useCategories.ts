import { useContext } from "react";
import { useQuery } from "react-query";
import { AuthContext } from "../contexts/AuthContext";
import { categoryService } from "../services/ApiService/CategoryService";
import { CategoryType } from './../types/category';
import { CATEGORIES_FORM } from './../utils/helpers';

export const getCategories = async (categoryType: CategoryType, active: boolean, page: number, perPage: number) => {
  const response = await categoryService.list({categoryType, active, page, perPage});
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

export const useCategoriesForm = () => {
  const { user } = useContext(AuthContext);

  return useQuery([CATEGORIES_FORM, user?.id], () => getCategoriesForForm(), {
    staleTime: 1000 * 60 * 15
  })
}