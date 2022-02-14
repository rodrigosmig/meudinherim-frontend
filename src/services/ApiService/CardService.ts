import { AxiosResponse } from "axios";
import { ICard, ICardFormData, ICardResponse, ICardUpdateData, IInvoice, IInvoiceResponse, IOpenInvoicesResponse } from "../../types/card";
import { setupApiClient } from "../api";

const apiClient = setupApiClient();

export const cardService = {
  list: (): Promise<AxiosResponse<ICardResponse>> => apiClient.get(`/cards`),
  create: (values: ICardFormData): Promise<AxiosResponse<ICard>> => apiClient.post(`/cards`, values),
  update: (values: ICardUpdateData): Promise<AxiosResponse<ICard>> => apiClient.put(`/cards/${values.cardId}`, values.data),
  delete: (id: number): Promise<AxiosResponse> => apiClient.delete(`/cards/${id}`),
  getInvoices: (
    cardId: number, 
    status: 'open' | 'paid',
    page: number, 
    perPage: number
  ): Promise<AxiosResponse<IInvoiceResponse>> => apiClient.get(`/cards/${cardId}/invoices?status=${status}&page=${page}&per_page=${perPage}`),
  getInvoice: (cardId: number, invoiceId: number): Promise<AxiosResponse<IInvoice>> => apiClient.get(`/cards/${cardId}/invoices/${invoiceId}`),
  getOpenInvoices: (): Promise<AxiosResponse<IOpenInvoicesResponse>> => apiClient.get(`/cards/invoices/open`)
};