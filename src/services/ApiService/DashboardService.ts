import { AxiosResponse } from "axios";
import { IDashboardResponse } from "../../types/dashboard";
import { setupApiClient } from "../api";

const apiClient = setupApiClient(undefined);

export const dashboardService = {
  getValues: (date: string): Promise<AxiosResponse<IDashboardResponse>> => apiClient.get(`/dashboard?date=${date}`),
};