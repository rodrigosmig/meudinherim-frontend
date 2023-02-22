import { createSlice } from "@reduxjs/toolkit";
import { AccountsBalanceState } from "../../types/account";
import { getAccountsBalance } from "../thunks/accountsBalanceThunk";

export const initialState = {
  isLoading: false,
  balances: [],
  total: {}
} as AccountsBalanceState

const accountsBalanceSlice = createSlice({
  name: 'accountsBalance',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(
        getAccountsBalance.pending,
        state => {
          state.isLoading = true;
        }
      )
      .addCase(
        getAccountsBalance.fulfilled,
        (state, { payload }) => {
          state.isLoading = false;
          state.balances = payload.balances
          state.total = payload.total;
        }
      )
  }
});

export default accountsBalanceSlice.reducer;