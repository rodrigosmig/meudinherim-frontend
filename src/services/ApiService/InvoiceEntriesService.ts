import { AxiosResponse } from "axios";
import { setupApiClient } from "../api";

interface Category {
  id: number,
  type: 1 | 2,
  name: string,
}

interface InvoiceEntry {
  id: number;
  date: string;
  description: string;
  value: number;
  category: Category;
  card_id: number;
  invoice_id: number;
  is_parcel: boolean;
  parcel_number: number;
  parcel_total: number;
  total_purchase: number;
  parcelable_id: number;
  anticipated: boolean;
}

interface InvoiceEntryResponse {
  data: InvoiceEntry[];
  current_page: number;
  from: number;
  to: number;
  last_page: number;
  per_page: number;
  total: number;
}

interface EditInvoiceEntryFormData {
  id: number;
  data: {
    category_id: number;
    description: string;
    value: number;
  }
}

interface AnticipateInstallmentsFormData {
  id: number;
  data: {
    parcels: number[];
  }
}

interface CreateInvoiceEntryFormData {
    card_id: number;
    date: string;
    category_id: number;
    description: string;
    value: number;
}

const apiClient = setupApiClient();

export const invoiceEntriesService = {
  list: (
    cardId: number,
    invoiceId: number,
    page: number, 
    perPage: number
  ): Promise<AxiosResponse<InvoiceEntryResponse>> => apiClient.get(`/cards/${cardId}/invoices/${invoiceId}/entries?page=${page}&per_page=${perPage}`),
  create: (data: CreateInvoiceEntryFormData): Promise<AxiosResponse<InvoiceEntry>> => apiClient.post(`/cards/${data.card_id}/entries`, data),
  update: (values: EditInvoiceEntryFormData): Promise<AxiosResponse<InvoiceEntry>> => apiClient.put(`/invoice-entries/${values.id}`, values.data),
  delete: (id: number): Promise<AxiosResponse> => apiClient.delete(`/invoice-entries/${id}`),
  getNextInstallments: (id: number, installment_number: number): Promise<AxiosResponse> => apiClient.get(`/invoice_entries/${id}/next-parcels?parcel_number=${installment_number}`),
  anticipateInstallments: (values: AnticipateInstallmentsFormData,): Promise<AxiosResponse> => apiClient.post(`/invoice_entries/${values.id}/anticipate-parcels`, values.data),
};