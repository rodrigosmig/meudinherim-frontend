import { AxiosResponse } from "axios";
import { IAccount, IAccountBalanceResponse, IAccountFormData, IAccountResponse, IAccountUpdateData } from "../../types/account";
import { setupApiClient } from "../api";

const apiClient = setupApiClient();

export const accountService = {
  list: (): Promise<AxiosResponse<IAccountResponse>> => apiClient.get(`/accounts`),
  create: (values: IAccountFormData): Promise<AxiosResponse<IAccount>> => apiClient.post(`/accounts`, values),
  update: (values: IAccountUpdateData): Promise<AxiosResponse<IAccount>> => apiClient.put(`/accounts/${values.accountId}`, values.data),
  delete: (id: number): Promise<AxiosResponse> => apiClient.delete(`/accounts/${id}`),
  balance: (id: number | 'all'): Promise<AxiosResponse<IAccountBalanceResponse>> => apiClient.get(`/accounts/balance/${id}`)
};