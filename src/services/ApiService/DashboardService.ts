import { AxiosResponse } from "axios";
import { setupApiClient } from "../api";

const apiClient = setupApiClient();

interface DashboardResponse {
    months: string[];
    total: {
        income: number;
        expense: number;
        invoices: number;
    },
    pieChart: {
        income_category: {
            value: number,
            label: string
        }[],
        expense_category: {
            value: number,
            label: string
        }[],
        card_expense_category: {
            value: number,
            label: string
        }[],
    },
    barChart: {
        income: number[];
        expense: number[];
    },
    lineChart: {
        invoices: {
            name: string;
            data: number[];
        }[]
    }
}

export const dashboardService = {
  getValues: (date: string): Promise<AxiosResponse<DashboardResponse>> => apiClient.get(`/dashboard?date=${date}`),
};