import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { accountService } from "../../services/ApiService/AccountService";
import { toCurrency } from "../../utils/helpers";

export const getAccountsBalance = createAsyncThunk(
  'accounts-balance/getAccountsBalance',
  async (_, thunkAPI) => {
    try {
      const response = await accountService.balance("all");

      const balances = response.data.balances.map(account => {
        return {
          ...account,
          balance: toCurrency(account.balance),
          positive: account.balance >= 0
        }
    
      })
    
      const data = {
        balances: balances,
        total: {
          value: toCurrency(response.data.total),
          positive: response.data.total >= 0
        }
      }

      return data;
    } catch (err) {
      const error = err as AxiosError
      return thunkAPI.rejectWithValue(error);
    }
  }
)