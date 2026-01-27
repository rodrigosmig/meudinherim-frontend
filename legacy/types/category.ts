import { Pagination } from "./pagination";

export interface CategoryState {
  isLoading: boolean;
  isFetching: boolean;
  isDeleting: boolean;
  isError: boolean;
  categories: ICategory[];
  config: {
    page: number;
    perPage: number;
    categoryType: CategoryType;
    active: boolean;
  }
  pagination: Pagination;
}

interface Category {
  type: CategoryType
  name: string;
  active: boolean;
  show_in_dashboard: boolean
}

export interface ICategory extends Category {
  id: number;
}

export interface ICategoryResponse {
  data: ICategory[];
  meta: Pagination;
}

export interface ICategoryForm {
  income: {
    id: number;
    label: string
  }[]
  expense: {
    id: number;
    label: string
  }[]
}

export interface ICategoryFormData extends Category {}

export interface ICategoryUpdateData {
  categoryId: number;
  data: ICategoryFormData;
}

export type CategoryType = 0 | 1 | 2;

export interface CategoryListType {
  categoryType: CategoryType;
  active: boolean;
  page: number;
  perPage: number;
}

export type ICategoryResponseError = {
  type: string[];
  name: string[];
}

export type ICategoryErrorKey = keyof ICategoryResponseError;