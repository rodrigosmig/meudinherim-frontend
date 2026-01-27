import { AxiosResponse } from "axios";
import { IAccountEntry, IAccountEntryFormData, IAccountEntryResponse, IAccountEntryTransferData, IAccountEntryUpdateData } from "../../types/accountEntry";
import { setupApiClient } from "../api";

const apiClient = setupApiClient(undefined);

interface AccountEntryCreateForm extends Omit<IAccountEntryFormData, "tags"> {
  tags: string[];
}

interface AccountEntryUpdateForm extends Omit<IAccountEntryUpdateData, "tags"> {
  tags: string[];
}

export const accountEntriesService = {
  list: (account_id: number, filterDate: [string, string], page: number, perPage: number): Promise<AxiosResponse<IAccountEntryResponse>> => apiClient.get(`/accounts/${account_id}/entries?page=${page}&per_page=${perPage}&from=${filterDate[0]}&to=${filterDate[1]}`),
  create: (data: AccountEntryCreateForm): Promise<AxiosResponse<IAccountEntry>> => apiClient.post(`/account-entries`, data),
  update: (values: IAccountEntryUpdateData): Promise<AxiosResponse<IAccountEntry>> => apiClient.put(`/account-entries/${values.id}`, values),
  delete: (id: number): Promise<AxiosResponse> => apiClient.delete(`/account-entries/${id}`),
  accountTransfer: (data: IAccountEntryTransferData): Promise<AxiosResponse> => apiClient.post(`account-entries/account-transfer`, data)  
};