import { createSlice } from "@reduxjs/toolkit";
import { InvoiceState } from "../../types/card";
import { getOpenInvoices } from "../thunks/invoicesThunk";

export const initialState = {
  isLoading: false,
  openInvoicesMenu: {
    invoices: [],
    total: "0"
  },
} as InvoiceState

const invoicesSlice = createSlice({
  name: 'invoices',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(
        getOpenInvoices.pending,
        state => {
          state.isLoading = true;
        }
      )
      .addCase(
        getOpenInvoices.fulfilled,
        (state, { payload }) => {
          state.isLoading = false;
          state.openInvoicesMenu.invoices = payload.invoices;
          state.openInvoicesMenu.total = payload.total;
        }
      )
  }
});

export default invoicesSlice.reducer;