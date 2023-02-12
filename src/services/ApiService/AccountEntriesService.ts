import { AxiosResponse } from "axios";
import { IAccountEntry, IAccountEntryFormData, IAccountEntryResponse, IAccountEntryTransferData, IAccountEntryUpdateData } from "../../types/accountEntry";
import { setupApiClient } from "../api";

const apiClient = setupApiClient(undefined);

export const accountEntriesService = {
  list: (account_id: number, filterDate: [string, string], page: number, perPage: number): Promise<AxiosResponse<IAccountEntryResponse>> => apiClient.get(`/accounts/${account_id}/entries?page=${page}&per_page=${perPage}&from=${filterDate[0]}&to=${filterDate[1]}`),
  create: (data: IAccountEntryFormData): Promise<AxiosResponse<IAccountEntry>> => apiClient.post(`/account-entries`, data),
  update: (values: IAccountEntryUpdateData): Promise<AxiosResponse<IAccountEntry>> => apiClient.put(`/account-entries/${values.id}`, values.data),
  delete: (id: number): Promise<AxiosResponse> => apiClient.delete(`/account-entries/${id}`),
  accountTransfer: (data: IAccountEntryTransferData): Promise<AxiosResponse> => apiClient.post(`account-entries/account-transfer`, data)  
};