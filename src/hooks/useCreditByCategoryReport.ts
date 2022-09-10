import { reportService } from '../services/ApiService/ReportService';
import { useContext } from "react";
import { useQuery } from "react-query";
import { AuthContext } from "../contexts/AuthContext";
import { CREDIT_TOTAL_BY_CATEGORY } from '../utils/helpers';

export const getItems = async (filterDate: [string, string]) => {
  const response = await reportService.getTotalCreditByCategory(filterDate);
  const data = response.data;

  return data
}

export const useCreditByCategoryReport = (filterDate: [string, string]) => {
  const { user } = useContext(AuthContext);

  return useQuery([CREDIT_TOTAL_BY_CATEGORY, filterDate, user?.id], () => getItems(filterDate), {
    staleTime: 1000 * 60 * 15
  })
}