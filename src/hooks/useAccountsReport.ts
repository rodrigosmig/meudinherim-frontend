import { reportService } from './../services/ApiService/ReportService';
import { useContext } from "react";
import { useQuery } from "react-query";
import { AuthContext } from "../contexts/AuthContext";
import { StatusType } from '../types/accountScheduling';

export const getItems = async (filterDate: [string, string], status: StatusType) => {
  const response = await reportService.getAccountItems(filterDate, status);
  const data = response.data;
  
  return data
}

export const useAccountsReport = (filterDate: [string, string], status: StatusType) => {
  const { user } = useContext(AuthContext);

  return useQuery(['accounts_report', filterDate, status, user?.id], () => getItems(filterDate, status), {
    staleTime: 1000 * 5
  })
}