import { useQuery } from "react-query";
import { accountService } from "../services/ApiService/AccountService";

export const getAccounts = async () => {
  const response = await accountService.list();

  const data = response.data.data

  return data
}

export const useAccounts = () => {
  return useQuery(['accounts'], () => getAccounts(), {
    staleTime: 1000 * 5
  })
}