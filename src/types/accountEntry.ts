import { IAccount } from "./account";
import { ICategory } from "./category";
import { Pagination } from "./pagination";

interface AccountEntry {
  date: string;
  description: string;
  value: number;
}

export interface IAccountEntry extends AccountEntry {
  id: number;
  category: ICategory;
  account_scheduling?: {
    is_parcel: boolean,
    id: number,
    parcelable_id: null | number,
    due_date: string,
    paid_date: string
  } | null,
  account: IAccount;
}

export interface IAccountEntryResponse {
  data: IAccountEntry[];
  meta: Pagination
}

export interface IAccountEntryUpdateData {
  id: number;
  data: {
    date: string;
    category_id: number;
    description: string;
    value: number;
  }
}

export interface IAccountEntryFormData extends AccountEntry {
    account_id: number;
    category_id: number;
}

export interface IAccountEntryTransferData extends AccountEntry {
  source_account_id: number;
  destination_account_id: number;
  source_category_id: number;
  destination_category_id: number;
}

export interface IAccountEntryTransferResponseError {
  date: string[];
  description: string[];
  value: string[];
  source_category_id: string[];
  destination_category_id: string[];
  source_account_id: string[];
  destination_account_id: string[];
}

export type ITransferErrorKey = keyof IAccountEntryTransferResponseError;

export interface IAccountEntryResponseError {
  category_id: string[];
  description: string[];
  value: string[];
}

export type IAccountEntryErrorKey = keyof IAccountEntryResponseError;