import { createSlice } from "@reduxjs/toolkit";
import { ApplicationState } from "../../types/application";
import { getCategoriesForForm } from "../thunks/applicationThunk";

export const initialState = {
  isLoading: true,
  categoriesForm: {},
} as ApplicationState

const applicationSlice = createSlice({
  name: 'application',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(
        getCategoriesForForm.pending,
        state => {
          state.isLoading = true;
        }
      )
      .addCase(
        getCategoriesForForm.fulfilled,
        (state, { payload }) => {
          state.categoriesForm = payload
          state.isLoading = false;
        }
      )
  }  
});

export default applicationSlice.reducer