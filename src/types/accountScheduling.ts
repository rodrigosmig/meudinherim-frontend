import { ICategory } from './category';
import { Pagination } from './pagination';

interface AccountScheduling {
  due_date: string;
  description: string;
  value: number;
} 

export interface IAccountScheduling extends AccountScheduling {
  id: number;  
  paid_date: string | null; 
  category: ICategory;
  invoice: null | {invoice_id: number, card_id: number};
  paid: boolean;
  monthly: boolean;
  has_parcels: boolean;
  is_parcel: boolean,
  total_purchase: number,
  parcel_number: number,
  parcelable_id: number,
}

export interface IAccountSchedulingCreateData extends AccountScheduling {
  category_id: number;
  monthly?: boolean;
  installment?: boolean;
  installments_number?: number;
  invoice_id?: number
  tags: string[]
}

export interface IAccountSchedulingFormData {
  due_date: string;
  category_id: number;
  description: string;
  value: number;
  monthly: boolean
}

export interface IAccountSchedulingUpdateData {
  id: number;
  data: IAccountSchedulingFormData;
}

export interface ITransactionFormData {
  paid_date: string;
  account_id: number;
  value: number;
  parcelable_id?: number;
}

export interface ITransactionData {
  id: number;
  data: ITransactionFormData;
}

export interface IResponse extends Pagination {
  data: AccountScheduling[];
}

export interface ICancelData {
  id: number, 
  parcelable_id: null | number
}

export interface IGenerateResponseError {
  category_id: string[];
}

export type IGenerateKeyError = keyof IGenerateResponseError

export interface IAccountSchedulingResponseError {
  category_id: string[];
  description: string[];
  value: string[];
}

export type IAccountSchedulingErrorKey = keyof IAccountSchedulingResponseError;


export interface ITransactionResponseError {
  paid_date: string[];
  account_id: string[];
  value: string[];
}

export type ITransactionErrorKey = keyof ITransactionResponseError;

export type StatusType = 'all' | 'open' | 'paid';