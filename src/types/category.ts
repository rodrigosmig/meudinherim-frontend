import { Pagination } from "./pagination";

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

export type CategoryType = 1 | 2;

export type ICategoryResponseError = {
  type: string[];
  name: string[];
}

export type ICategoryErrorKey = keyof ICategoryResponseError;