import { IPayable } from "./payable";
import { IReceivable } from "./receivable";

export interface IAccountReportResponse {
  payables: {
    items: IPayable[];
    total: number;
  },
  receivables: {
    items: IReceivable[];
    total: number;
  },
  invoices: {
    total: number;
  }
}

export interface TotalByCategoryResponse {
  category: string;
  id: number;
  total: number;
  quantity: number
}

export interface ITotalCreditByCategory {
  data: TotalByCategoryResponse[]
}

export interface ITotalByCategoryResponse {
  incomes: {
    category: string;
    id: number;
    total: number;
    quantity: number
  }[],
  expenses: {
    category: string;
    id: number;
    total: number;
    quantity: number
  }[],
  creditCard: {
    category: string;
    id: number;
    total: number;
    quantity: number
  }[],
}

export interface ITotalByCategoryDetailedResponse {
  data: {
    id: number;
    date: string;
    description: string;
    value: number;
    category: {
      id: number;
      name: string;
    },
    source: string;
  }[]
}

export type ReportType = 'card' | 'account';