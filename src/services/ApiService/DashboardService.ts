import { AxiosResponse } from "axios";
import { IDashboardResponse } from "../../types/dashboard";
import { setupApiClient } from "../api";

const apiClient = setupApiClient();

export const dashboardService = {
  getValues: (date: string): Promise<AxiosResponse<IDashboardResponse>> => apiClient.get(`/dashboard?date=${date}`),
};