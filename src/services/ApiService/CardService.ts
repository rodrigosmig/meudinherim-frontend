import { AxiosResponse } from "axios";
import { setupApiClient } from "../api";

interface Card {
  id: number;
  name: string;
  pay_day: number;
  closing_day: number;
  credit_limit: number;
  balance: number;
}

interface Invoice {
  id: number;
  due_date: string;
  closing_date: string;
  amount: number;
  paid: boolean;
  isClosed: boolean;
  hasPayable: boolean;
  card: {
    id: number;
    name: string;
  }
}

interface InvoiceResponse {
  data: Invoice[];
  meta: {
    from: number;
    to: number;
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  }
}

interface OpenInvoicesResponse {
  invoices: Invoice[];
  total: number;
}

interface CardResponse {
  data: Card[]
}

interface FormData {
  name: string;
  pay_day: number;
  closing_day: number;
  credit_limit: number;
}

interface EditCardFormData {
  cardId: number;
  data: FormData;
}

const apiClient = setupApiClient();

export const cardService = {
  list: (): Promise<AxiosResponse<CardResponse>> => apiClient.get(`/cards`),
  create: (values: FormData): Promise<AxiosResponse<Card>> => apiClient.post(`/cards`, values),
  update: (values: EditCardFormData): Promise<AxiosResponse<Card>> => apiClient.put(`/cards/${values.cardId}`, values.data),
  delete: (id: number): Promise<AxiosResponse> => apiClient.delete(`/cards/${id}`),
  getInvoices: (
    cardId: number, 
    status: 'open' | 'paid',
    page: number, 
    perPage: number
  ): Promise<AxiosResponse<InvoiceResponse>> => apiClient.get(`/cards/${cardId}/invoices?status=${status}&page=${page}&per_page=${perPage}`),
  getInvoice: (cardId: number, invoiceId: number): Promise<AxiosResponse<Invoice>> => apiClient.get(`/cards/${cardId}/invoices/${invoiceId}`),
  getOpenInvoices: (): Promise<AxiosResponse<OpenInvoicesResponse>> => apiClient.get(`/cards/invoices/open`)
};