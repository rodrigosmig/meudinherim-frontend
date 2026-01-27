import { useContext } from "react";
import { useQuery } from "react-query";
import { AuthContext } from "../contexts/AuthContext";
import { dashboardService } from "../services/ApiService/DashboardService";

export const getValues = async (date: string) => {
  const response = await dashboardService.getValues(date);
  const data = response.data;

  return data
}

export const useDashboard = (date: string) => {
  const { user } = useContext(AuthContext);

  return useQuery(['dashboard', date, user?.id], () => getValues(date), {
    staleTime: 1000 * 5
  })
}