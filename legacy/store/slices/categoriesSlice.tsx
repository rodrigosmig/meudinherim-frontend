import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CategoryState } from "../../types/category";
import { createCategory, deleteCategory, getCategories, updateCategory } from "../thunks/categoriesThunk";

export const initialState = {
  isLoading: false,
  isFetching: false,
  isDeleting: false,
  isError: false,
  categories: [],
  config: {
    page: 1,
    perPage: 10,
    categoryType: 0,
    active: true
  },
  pagination: {
    from: 0,
    to: 0,
    current_page: 0,
    last_page: 0,
    per_page: 0,
    total: 0
  }
} as CategoryState

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    setCategoryType: (state, action: PayloadAction<CategoryState['config']['categoryType']>) => {
      state.config.categoryType = action.payload
    },
    setPage: (state, action: PayloadAction<CategoryState['config']['page']>) => {
      state.config.page = action.payload
    },
    setPerPage: (state, action: PayloadAction<CategoryState['config']['perPage']>) => {
      state.config.perPage = action.payload
    },
    setActive: (state, action: PayloadAction<CategoryState['config']['active']>) => {
      state.config.active = action.payload
    },
  },
  extraReducers(builder) {
    builder
      .addCase(
        getCategories.pending,
        state => {
          state.isLoading = true;
        }
      )
      .addCase(
        getCategories.fulfilled,
        (state, { payload }) => {
          state.isLoading = false;
          state.isError = false;
          state.categories = payload.categories;
          state.pagination = payload.pagination;
        }
      )
      .addCase(
        getCategories.rejected,
        state => {
          state.isError = true;
          state.isLoading = false;
        }
      )
      .addCase(
        createCategory.fulfilled,
        (state, { payload }) => {
          state.isLoading = false;
          state.isError = false;
          state.categories = payload;
        }
      )
      .addCase(
        updateCategory.fulfilled,
        (state, { payload }) => {
          state.isLoading = false;
          state.isError = false;

          if (state.config.active !== payload.active) {
            const indexPosition = state.categories.findIndex(category => {
              return category.id === payload.id;
            });

            state.categories.splice(indexPosition, 1);
            return;
          }

          state.categories.forEach(category => {
            if (category.id === payload.id) {
              category.name = payload.name
              category.active = payload.active
              category.type = payload.type
              category.show_in_dashboard = payload.show_in_dashboard
            }
          })
        }
      )
      .addCase(
        deleteCategory.pending,
        state => {
          state.isDeleting = true;
        }
      )
      .addCase(
        deleteCategory.fulfilled,
        (state, { payload }) => {
          state.isDeleting = false;

          const indexPosition = state.categories.findIndex(category => {
            return category.id === payload;
          });
          state.categories.splice(indexPosition, 1)
        }
      )
      .addCase(
        deleteCategory.rejected,
        state => {
          state.isDeleting = false;
        }
      )
  }
});

export const { setActive, setPage, setPerPage, setCategoryType } = categoriesSlice.actions

export default categoriesSlice.reducer