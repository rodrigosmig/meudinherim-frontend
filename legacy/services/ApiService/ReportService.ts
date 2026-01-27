import { AxiosResponse } from "axios";
import { AccountIdType } from "../../types/account";
import { StatusType } from "../../types/accountScheduling";
import { IAccountReportResponse, ITotalByCategoryDetailedResponse, ITotalByCategoryResponse, ITotalCreditByCategory, ReportType } from "../../types/report";
import { setupApiClient } from "../api";

const apiClient = setupApiClient(undefined);

export const reportService = {
  getAccountItems: (filterDate: [string, string], status: StatusType): Promise<AxiosResponse<IAccountReportResponse>> => apiClient.get(`/reports/accounts?&from=${filterDate[0]}&to=${filterDate[1]}&status=${status}`),
  getTotalAccountByCategory: (filterDate: [string, string], accountId: AccountIdType, tags: string[]): Promise<AxiosResponse<ITotalByCategoryResponse>> => apiClient.get(`/reports/total-account-by-category?&from=${filterDate[0]}&to=${filterDate[1]}&account_id=${accountId}&tags=${tags}`),
  getTotalCreditByCategory: (filterDate: [string, string], tags: string[]): Promise<AxiosResponse<ITotalCreditByCategory>> => apiClient.get(`/reports/total-credit-by-category?&from=${filterDate[0]}&to=${filterDate[1]}&tags=${tags}`),
  getTotalByCategoryDetailed: (
    filterDate: [string, string], 
    categoryId: number, 
    reportType: ReportType,
    accountId: number,
    tags: string[]
  ): Promise<AxiosResponse<ITotalByCategoryDetailedResponse>> => {
    return apiClient.get(`/reports/total-by-category/details?from=${filterDate[0]}&to=${filterDate[1]}&category_id=${categoryId}&type=${reportType}&account_id=${accountId}&tags=${tags}`)
  }
};