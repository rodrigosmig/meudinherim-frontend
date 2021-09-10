import { AxiosResponse } from "axios";
import { setupApiClient } from "../api";

interface Category {
  id: number,
  type: 1 | 2,
  name: string,
}

interface Account {
  id: number;
  name: string;
  type: {
    id: 'money' | 'savings' | 'checking_account' | 'investment';
    desc: string;
  }
  balance: number;
}

interface AccountEntry {
  id: number;
  date: string;
  category: Category;
  description: string;
  value: number;
  account: Account;
}

interface AccountEntryResponse {
  data: AccountEntry[];
  meta: {
    from: number;
    to: number;
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  }
}

interface FormData {
  type: string;
  name: string;
}

interface EditAccountEntryFormData {
  id: number;
  data: {
    date: string;
    category_id: number;
    description: string;
    value: number;
  }
}

const apiClient = setupApiClient();

export const accountEntriesService = {
  list: (account_id: number, page: number, perPage: number): Promise<AxiosResponse<AccountEntryResponse>> => apiClient.get(`/accounts/${account_id}/entries?page=${page}&per_page=${perPage}`),
  update: (values: EditAccountEntryFormData): Promise<AxiosResponse<Category>> => apiClient.put(`/account-entries/${values.id}`, values.data),
  delete: (id: number): Promise<AxiosResponse> => apiClient.delete(`/account-entries/${id}`),
};