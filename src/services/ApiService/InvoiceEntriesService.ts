import { AxiosResponse } from "axios";
import { IAnticipateInstallmentsData, IInvoiceEntry, IInvoiceEntryCreateData, IInvoiceEntryResponse, IInvoiceEntryUpdateData } from "../../types/invoiceEntry";
import { setupApiClient } from "../api";

const apiClient = setupApiClient(undefined);

interface InvoiceEntryCreateForm extends Omit<IInvoiceEntryCreateData, "tags"> {
  tags: string[];
}

interface InvoiceEntryUpdateForm extends Omit<IInvoiceEntryUpdateData, "tags"> {
  tags: string[];
}

export const invoiceEntriesService = {
  list: (
    cardId: number,
    invoiceId: number,
    page: number, 
    perPage: number
  ): Promise<AxiosResponse<IInvoiceEntryResponse>> => apiClient.get(`/cards/${cardId}/invoices/${invoiceId}/entries?page=${page}&per_page=${perPage}`),
  create: (data: InvoiceEntryCreateForm): Promise<AxiosResponse<IInvoiceEntry>> => apiClient.post(`/cards/${data.card_id}/entries`, data),
  update: (values: InvoiceEntryUpdateForm): Promise<AxiosResponse<IInvoiceEntry>> => apiClient.put(`/invoice-entries/${values.id}`, values),
  delete: (id: number): Promise<AxiosResponse> => apiClient.delete(`/invoice-entries/${id}`),
  getNextInstallments: (id: number, installment_number: number): Promise<AxiosResponse> => apiClient.get(`/invoice_entries/${id}/next-parcels?parcel_number=${installment_number}`),
  anticipateInstallments: (values: IAnticipateInstallmentsData,): Promise<AxiosResponse> => apiClient.post(`/invoice_entries/${values.id}/anticipate-parcels`, values.data),
};