import { ICategoryForm } from "./category";

export interface ApplicationState {
  isLoading: boolean;
  categoriesForm: ICategoryForm;
}