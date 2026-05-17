import { TagOptions } from './tag';
import { ICategory } from "./category";
import { Pagination } from "./pagination";

export interface IInvoiceEntry {
  id: number;
  date: string;
  description: string;
  value: number;
  category: ICategory;
  card_id: number;
  invoice_id: number;
  is_parcel: boolean;
  parcel_number: number;
  parcel_total: number;
  total_purchase: number;
  parcelable_id: number;
  anticipated: boolean;
  tags: string[]
}

export interface IInvoiceEntryFormData {
  category_id: number;
  description: string;
  value: number;
  tags: TagOptions[];
}

export interface IInvoiceEntryCreateData extends IInvoiceEntryFormData {
  card_id: number;
  date: string;
  installment?: boolean;
  installments_number?: number
}

export interface IInvoiceEntryUpdateData extends IInvoiceEntryFormData {
  id: number;
}

export interface IInvoiceEntryResponse extends Pagination {
  data: IInvoiceEntry[];
}

export interface IAnticipateInstallmentsData {
  id: number;
  data: {
    parcels: number[];
  }
}

export interface IInvoiceEntryResponseError {
  category_id: string[];
  description: string[];
  value: string[];
}

export type IInvoiceEntryErrorKey = keyof IInvoiceEntryResponseError;
