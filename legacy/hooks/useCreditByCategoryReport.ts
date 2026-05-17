import { reportService } from '../services/ApiService/ReportService';
import { useContext } from "react";
import { useQuery } from "react-query";
import { AuthContext } from "../contexts/AuthContext";
import { CREDIT_TOTAL_BY_CATEGORY } from '../utils/helpers';

export const getItems = async (filterDate: [string, string], tags: string[]) => {
  const response = await reportService.getTotalCreditByCategory(filterDate, tags);
  const data = response.data;

  return data
}

export const useCreditByCategoryReport = (filterDate: [string, string], tags: string[]) => {
  const { user } = useContext(AuthContext);

  return useQuery([CREDIT_TOTAL_BY_CATEGORY, filterDate, tags, user?.id], () => getItems(filterDate, tags), {
    staleTime: 1000 * 60 * 15
  })
}