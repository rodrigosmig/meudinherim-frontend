import { setupApiClient } from "../api";
import { AxiosRequestConfig, AxiosResponse } from 'axios';

interface Payable {
  id: number;
  due_date: string;
  paid_date: string | null;
  description: string;
  value: number;
  category: {
    id: number;
    name: string;
  };
  invoice_id: number | null;
  paid: boolean;
  monthly: number;
  has_parcels: boolean;
}

interface PayableResponse {
  data: Payable[];
}
interface FormData {
  due_date: string;
  category_id: number;
  description: string;
  value: number;
  monthly: boolean
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
  create: (values: FormData): Promise<AxiosResponse<Payable>> => apiClient.post(`/payables`, values),
};
