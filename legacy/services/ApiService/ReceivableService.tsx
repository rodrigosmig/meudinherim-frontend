import { setupApiClient } from "../api";
import { AxiosResponse } from 'axios';
import { IReceivable, IReceivableCreateData, IReceivableResponse, IReceivableUpdateData, IReceivementData } from "../../types/receivable";

const apiClient = setupApiClient(undefined);

interface ReceivableCreateForm extends Omit<IReceivableCreateData, "tags"> {
  tags: string[];
}

interface ReceivableUpdateForm extends Omit<IReceivableUpdateData, "tags"> {
  tags: string[];
}

export const receivableService = {
  list: (filterDate: [string, string], page: number, perPage: number, status: string): Promise<AxiosResponse<IReceivableResponse>> => apiClient.get(`/receivables?page=${page}&per_page=${perPage}&from=${filterDate[0]}&to=${filterDate[1]}&status=${status}`),
  get: (id: number, receivable_id?: number): Promise<AxiosResponse<IReceivable>> => {
    const receivableId = receivable_id ?? '';
    return apiClient.get(`/receivables/${id}?parcelable_id=${receivableId}`)
  },
  create: (data: ReceivableCreateForm): Promise<AxiosResponse<IReceivable>> => apiClient.post(`/receivables`, data),
  update: (values: ReceivableUpdateForm): Promise<AxiosResponse<IReceivable>> => apiClient.put(`/receivables/${values.id}`, values),
  delete: (id: number): Promise<AxiosResponse> => apiClient.delete(`/receivables/${id}`),
  receivement: (values: IReceivementData): Promise<AxiosResponse> => apiClient.post(`/receivables/${values.id}/receivement`, values.data),
  cancelReceivement: (id: number, receivable_id?: number): Promise<AxiosResponse> => {
    const receivableId = receivable_id ?? '';
    return apiClient.post(`/receivables/${id}/cancel-receivement?parcelable_id=${receivableId}`)
  }
};
