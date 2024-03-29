import { setupApiClient } from "../api";
import { AxiosResponse } from 'axios';
import { IPayable, IPayableCreateData, IPayableResponse, IPayableUpdateData, IPaymentData } from "../../types/payable";

const apiClient = setupApiClient(undefined);

interface PayableCreateForm extends Omit<IPayableCreateData, "tags"> {
  tags: string[];
}

interface PayableUpdateForm extends Omit<IPayableUpdateData, "tags"> {
  tags: string[];
}

export const payableService = {
  list: (filterDate: [string, string], page: number, perPage: number, status: string): Promise<AxiosResponse<IPayableResponse>> => apiClient.get(`/payables?page=${page}&per_page=${perPage}&from=${filterDate[0]}&to=${filterDate[1]}&status=${status}`),
  get: (id: number, parcelable_id?: number): Promise<AxiosResponse<IPayable>> => {
    const parcelableId = parcelable_id ?? '';
    return apiClient.get(`/payables/${id}?parcelable_id=${parcelableId}`)
  },
  create: (data: PayableCreateForm): Promise<AxiosResponse<IPayable>> => apiClient.post(`/payables`, data),
  update: (values: PayableUpdateForm): Promise<AxiosResponse<IPayable>> => apiClient.put(`/payables/${values.id}`, values),
  delete: (id: number): Promise<AxiosResponse> => apiClient.delete(`/payables/${id}`),
  payment: (values: IPaymentData): Promise<AxiosResponse> => apiClient.post(`/payables/${values.id}/payment`, values.data),
  cancelPayment: (id: number, parcelable_id?: number): Promise<AxiosResponse> => {
    const parcelableId = parcelable_id ?? '';
    return apiClient.post(`/payables/${id}/cancel-payment?parcelable_id=${parcelableId}`)
  }
};
