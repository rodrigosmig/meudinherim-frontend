import { setupApiClient } from "../api";
import { AxiosRequestConfig, AxiosResponse } from 'axios';

interface Receivable {
  id: number;
  due_date: string;
  paid_date: string | null;
  description: string;
  value: number;
  category: {
    id: number;
    name: string;
    type: 1;
  };
  invoice_id: number | null;
  paid: boolean;
  monthly: boolean;
  has_parcels: boolean;
  is_parcel: boolean,
  total_purchase: number,
  parcel_number: number,
  parcelable_id: number,
}

interface ReceivableResponse {
  data: Receivable[];
}
interface CreateFormData {
  due_date: string;
  category_id: number;
  description: string;
  value: number;
  monthly: boolean;
  installment: boolean;
  installments_number: number
}

interface EditFormData {
  id: number;
  data: {
    due_date: string;
    category_id: number;
    description: string;
    value: number;
    monthly: boolean
  }
}

interface ReceivementFormData {
  id: number;
  data: {
    paid_date: string;
    account_id: number;
    value: number;
    parcelable_id?: number;
  }
}

interface ReceivableResponse {
  data: Receivable[];
  current_page: number;
  from: number;
  to: number;
  last_page: number;
  per_page: number;
  total: number;
}

const apiClient = setupApiClient();

export const receivableService = {
  list: (filterDate: [string, string], page: number, perPage: number, status: string): Promise<AxiosResponse<ReceivableResponse>> => apiClient.get(`/receivables?page=${page}&per_page=${perPage}&from=${filterDate[0]}&to=${filterDate[1]}&status=${status}`),
  get: (id: number, receivable_id?: number): Promise<AxiosResponse<Receivable>> => {
    const receivableId = receivable_id ?? '';
    return apiClient.get(`/receivables/${id}?parcelable_id=${receivableId}`)
  },
  create: (data: CreateFormData): Promise<AxiosResponse<Receivable>> => apiClient.post(`/receivables`, data),
  update: (values: EditFormData): Promise<AxiosResponse<Receivable>> => apiClient.put(`/receivables/${values.id}`, values.data),
  delete: (id: number): Promise<AxiosResponse> => apiClient.delete(`/receivables/${id}`),
  receivement: (values: ReceivementFormData): Promise<AxiosResponse> => apiClient.post(`/receivables/${values.id}/receivement`, values.data),
  cancelReceivement: (id: number, receivable_id?: number): Promise<AxiosResponse> => {
    const receivableId = receivable_id ?? '';
    return apiClient.post(`/receivables/${id}/cancel-receivement?parcelable_id=${receivableId}`)
  }
};
