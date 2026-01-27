import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { cardService } from "../../services/ApiService/CardService";
import { toBrDate, toCurrency } from "../../utils/helpers";

export const getOpenInvoices = createAsyncThunk(
  'accounts-balance/getOpenInvoices',
  async (_, thunkAPI) => {
    try {
      const response = await cardService.getOpenInvoices();

      const invoices = response.data.invoices.map(invoice => {
        return {
          ...invoice,
          due_date: toBrDate(invoice.due_date),
          amount: toCurrency(invoice.amount)
        }
      })
    
      return {
        invoices,
        total: toCurrency(response.data.total)
      }
    } catch (err) {
      const error = err as AxiosError
      return thunkAPI.rejectWithValue(error);
    }
  }
)