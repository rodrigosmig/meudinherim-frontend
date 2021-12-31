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
  account_scheduling: {
    is_parcel: boolean,
    id: number,
    parcelable_id: null | number,
    due_date: string,
    paid_date: string
  },
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

interface EditAccountEntryFormData {
  id: number;
  data: {
    date: string;
    category_id: number;
    description: string;
    value: number;
  }
}

interface CreateAccountEntryFormData {
    account_id: number;
    date: string;
    category_id: number;
    description: string;
    value: number;
}

interface AccountTransferFormData {
  source_account_id: number;
  destination_account_id: number;
  source_category_id: number;
  destination_category_id: number;
  date: string;
  description: string;
  value: number;
}

const apiClient = setupApiClient();

export const accountEntriesService = {
  list: (account_id: number, filterDate: [string, string], page: number, perPage: number): Promise<AxiosResponse<AccountEntryResponse>> => apiClient.get(`/accounts/${account_id}/entries?page=${page}&per_page=${perPage}&from=${filterDate[0]}&to=${filterDate[1]}`),
  create: (data: CreateAccountEntryFormData): Promise<AxiosResponse<AccountEntry>> => apiClient.post(`/account-entries`, data),
  update: (values: EditAccountEntryFormData): Promise<AxiosResponse<AccountEntry>> => apiClient.put(`/account-entries/${values.id}`, values.data),
  delete: (id: number): Promise<AxiosResponse> => apiClient.delete(`/account-entries/${id}`),
  accountTransfer: (data: AccountTransferFormData): Promise<AxiosResponse> => apiClient.post(`account-entries/account-transfer`, data),
  
};