import { AxiosResponse } from "axios";
import { setupApiClient } from "../api";

interface Account {
  id: number;
  type: {
    id: 'money' | 'savings' | 'checking_account' | 'investment';
    desc: string;
  }
  name: string;
  balance: number;
}

interface AccountResponse {
  data: Account[]
}

interface FormData {
  type: string;
  name: string;
}

interface EditAccountFormData {
  accountId: number;
  data: FormData;
}

interface AccountBalanceResponse {
  balances: {
    account_id: number;
    account_name: string;
    balance: number;
  }[];
  total: number
}

const apiClient = setupApiClient();

export const accountService = {
  list: (): Promise<AxiosResponse<AccountResponse>> => apiClient.get(`/accounts`),
  create: (values: FormData): Promise<AxiosResponse<Account>> => apiClient.post(`/accounts`, values),
  update: (values: EditAccountFormData): Promise<AxiosResponse<Account>> => apiClient.put(`/accounts/${values.accountId}`, values.data),
  delete: (id: number): Promise<AxiosResponse> => apiClient.delete(`/accounts/${id}`),
  balance: (id: number | 'all'): Promise<AxiosResponse<AccountBalanceResponse>> => apiClient.get(`/accounts/balance/${id}`),
};