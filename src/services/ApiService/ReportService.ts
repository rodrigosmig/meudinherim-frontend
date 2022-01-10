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
  }
}

type AccountStatus = 'all' | 'open' | 'paid';

export const reportService = {
  getAccountItems: (filterDate: [string, string], status: AccountStatus): Promise<AxiosResponse<AccountReportResponse>> => apiClient.get(`/reports/accounts?&from=${filterDate[0]}&to=${filterDate[1]}&status=${status}`),
};