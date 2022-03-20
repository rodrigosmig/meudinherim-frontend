import { AxiosResponse } from "axios";
import { StatusType } from "../../types/accountScheduling";
import { IAccountReportResponse, ITotalByCategoryDetailedResponse, ITotalByCategoryResponse, ITotalCreditByCategory, ReportType } from "../../types/report";
import { setupApiClient } from "../api";

const apiClient = setupApiClient();

export const reportService = {
  getAccountItems: (filterDate: [string, string], status: StatusType): Promise<AxiosResponse<IAccountReportResponse>> => apiClient.get(`/reports/accounts?&from=${filterDate[0]}&to=${filterDate[1]}&status=${status}`),
  getTotalByCategory: (filterDate: [string, string]): Promise<AxiosResponse<ITotalByCategoryResponse>> => apiClient.get(`/reports/total-by-category?&from=${filterDate[0]}&to=${filterDate[1]}`),
  getTotalCreditByCategory: (filterDate: [string, string]): Promise<AxiosResponse<ITotalCreditByCategory>> => apiClient.get(`/reports/total-credit-by-category?&from=${filterDate[0]}&to=${filterDate[1]}`),
  getTotalByCategoryDetailed: (filterDate: [string, string], categoryId: number, reportType: ReportType): Promise<AxiosResponse<ITotalByCategoryDetailedResponse>> => {
    return apiClient.get(`/reports/total-by-category/details?from=${filterDate[0]}&to=${filterDate[1]}&category_id=${categoryId}&type=${reportType}`)
  }
};