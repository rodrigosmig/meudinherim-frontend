import { reportService } from './../services/ApiService/ReportService';
import { useContext } from "react";
import { useQuery } from "react-query";
import { AuthContext } from "../contexts/AuthContext";

export const getItems = async (filterDate: [string, string]) => {
  const response = await reportService.getTotalByCategory(filterDate);
  const data = response.data;

  return data
}

export const useByCategoryReport = (filterDate: [string, string]) => {
  const { user } = useContext(AuthContext);

  return useQuery(['total_by_category_report', filterDate, user?.id], () => getItems(filterDate), {
    staleTime: 1000 * 5
  })
}