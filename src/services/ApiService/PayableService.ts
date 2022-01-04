import { setupApiClient } from "../api";
import { AxiosResponse } from 'axios';

interface Payable {
  id: number;
  due_date: string;
  paid_date: string | null;
  description: string;
  value: number;
  category: {
    id: number;
    name: string;
    type: 2;
  };
  invoice: null | {invoice_id:number, card_id: number};
  paid: boolean;
  monthly: boolean;
  has_parcels: boolean;
  is_parcel: boolean,
  total_purchase: number,
  parcel_number: number,
  parcelable_id: number,
}

interface PayableResponse {
  data: Payable[];
}
interface CreateFormData {
  due_date: string;
  category_id: number;
  description: string;
  value: number;
  monthly?: boolean;
  installment?: boolean;
  installments_number?: number;
  invoice_id?: number
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

interface PaymentFormData {
  id: number;
  data: {
    paid_date: string;
    account_id: number;
    value: number;
    parcelable_id?: number;
  }
}

interface PayableResponse {
  data: Payable[];
  current_page: number;
  from: number;
  to: number;
  last_page: number;
  per_page: number;
  total: number;
}

const apiClient = setupApiClient();

export const payableService = {
  list: (filterDate: [string, string], page: number, perPage: number, status: string): Promise<AxiosResponse<PayableResponse>> => apiClient.get(`/payables?page=${page}&per_page=${perPage}&from=${filterDate[0]}&to=${filterDate[1]}&status=${status}`),
  get: (id: number, parcelable_id?: number): Promise<AxiosResponse<Payable>> => {
    const parcelableId = parcelable_id ?? '';
    return apiClient.get(`/payables/${id}?parcelable_id=${parcelableId}`)
  },
  create: (data: CreateFormData): Promise<AxiosResponse<Payable>> => apiClient.post(`/payables`, data),
  update: (values: EditFormData): Promise<AxiosResponse<Payable>> => apiClient.put(`/payables/${values.id}`, values.data),
  delete: (id: number): Promise<AxiosResponse> => apiClient.delete(`/payables/${id}`),
  payment: (values: PaymentFormData): Promise<AxiosResponse> => apiClient.post(`/payables/${values.id}/payment`, values.data),
  cancelPayment: (id: number, parcelable_id?: number): Promise<AxiosResponse> => {
    const parcelableId = parcelable_id ?? '';
    return apiClient.post(`/payables/${id}/cancel-payment?parcelable_id=${parcelableId}`)
  }
};
