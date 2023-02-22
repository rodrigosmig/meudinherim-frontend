import { Pagination } from "./pagination";

export interface InvoiceState {
  isLoading: boolean;
  openInvoicesMenu: {
    invoices: IInvoiceState[]
    total: string;
  }
}

interface IInvoiceState extends Omit<IInvoice, "amount"> {
  amount: string
};

export interface Card {
  id: number;
  name: string;
}

export interface ICard extends Card {
  pay_day: number;
  closing_day: number;
  credit_limit: number;
  balance: number;
}

export interface ICardResponse {
  data: ICard[]
}

export interface ICardFormData {
  name: string;
  pay_day: number;
  closing_day: number;
  credit_limit: number;
}

export interface ICardUpdateData {
  cardId: number;
  data: ICardFormData;
}

export interface IOpenInvoicesResponse {
  invoices: IInvoice[];
  total: number;
}

export interface IInvoice {
  id: number;
  due_date: string;
  closing_date: string;
  amount: number;
  paid: boolean;
  isClosed: boolean;
  hasPayable: boolean;
  card: Card;
}

export interface IInvoiceResponse {
  data: IInvoice[];
  meta: Pagination;
}

export type ICardResponseError = {
  name: string[];
  pay_day: string[];
  closing_day: string[];
  credit_limit: string[];
}

export type ICardErrorKey = keyof ICardResponseError

export interface IPartialPaymentInvoiceData {
  date: string;
  description: string;
  value: number;
  account_id: number;
  card_id: number;
  income_category_id: number;
  expense_category_id: number;
}

export interface IPartialPaymentInvoiceResponseError {
  date: string[];
  description: string[];
  value: string[];
  account_id: string[];
  card_id: string[];
  income_category_id: string[];
  expense_category_id: string[];
}

export type IPartialPaymentErrorKey = keyof IPartialPaymentInvoiceResponseError;
