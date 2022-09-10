import { reportService } from '../services/ApiService/ReportService';
import { useContext } from "react";
import { useQuery } from "react-query";
import { AuthContext } from "../contexts/AuthContext";
import { AccountIdType } from '../types/account';
import { ACCOUNT_TOTAL_BY_CATEGORY } from '../utils/helpers';

export const getItems = async (filterDate: [string, string], accountId: AccountIdType) => {
  const response = await reportService.getTotalAccountByCategory(filterDate, accountId);
  const data = response.data;

  return data
}

export const useAccountByCategoryReport = (filterDate: [string, string], accountId: AccountIdType) => {
  const { user } = useContext(AuthContext);

  return useQuery([ACCOUNT_TOTAL_BY_CATEGORY, filterDate, accountId, user?.id], () => getItems(filterDate, accountId), {
    staleTime: 1000 * 60 * 15
  })
}