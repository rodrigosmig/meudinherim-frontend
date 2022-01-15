import { AxiosResponse } from "axios";
import { setupApiClient } from "../api";

const apiClient = setupApiClient();

interface Payable {
  id: number;
  due_date: string;
  paid_date: string | null;
  description: string;
  value: number;
  category: {
    id: number;
    name: string;
    type: 2;
  };
  invoice: null | {invoice_id:number, card_id: number};
  paid: boolean;
  monthly: boolean;
  has_parcels: boolean;
  is_parcel: boolean,
  total_purchase: number,
  parcel_number: number,
  parcelable_id: number,
}

interface Receivable {
  id: number;
  due_date: string;
  paid_date: string | null;
  description: string;
  value: number;
  category: {
    id: number;
    name: string;
    type: 1;
  };
  invoice_id: number | null;
  paid: boolean;
  monthly: boolean;
  has_parcels: boolean;
  is_parcel: boolean,
  total_purchase: number,
  parcel_number: number,
  parcelable_id: number,
}

interface AccountReportResponse {
  payables: {
    items: Payable[];
    total: number;
  },
  receivables: {
    items: Receivable[];
    total: number;
  },
  invoices: {
    total: number;
  }
}

interface TotalByCategoryResponse {
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

interface TotalByCategoryDetailedResponse {
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

type AccountStatus = 'all' | 'open' | 'paid';
type ReportType = 'card' | 'account';

export const reportService = {
  getAccountItems: (filterDate: [string, string], status: AccountStatus): Promise<AxiosResponse<AccountReportResponse>> => apiClient.get(`/reports/accounts?&from=${filterDate[0]}&to=${filterDate[1]}&status=${status}`),
  getTotalByCategory: (filterDate: [string, string]): Promise<AxiosResponse<TotalByCategoryResponse>> => apiClient.get(`/reports/total-by-category?&from=${filterDate[0]}&to=${filterDate[1]}`),
  getTotalByCategoryDetailed: (filterDate: [string, string], categoryId: number, reportType: ReportType): Promise<AxiosResponse<TotalByCategoryDetailedResponse>> => {
    return apiClient.get(`/reports/total-by-category/details?from=${filterDate[0]}&to=${filterDate[1]}&category_id=${categoryId}&type=${reportType}`)
  }
};