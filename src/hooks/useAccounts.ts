import { useContext } from "react";
import { useQuery } from "react-query";
import { AuthContext } from "../contexts/AuthContext";
import { accountService } from "../services/ApiService/AccountService";

export const getAccounts = async () => {
  const response = await accountService.list();

  const data = response.data.data

  return data
}

export const getAccountsForForm = async () => {
  const response = await accountService.list();

  const data = response.data.data.map(account => {
    return {
      value: account.id,
      label: account.name
    }
  })

  return data;
}

export const useAccounts = () => {
  const { user } = useContext(AuthContext);

  return useQuery(['accounts', user?.id], () => getAccounts(), {
    staleTime: 1000 * 5
  })
}

export const useAccountsForm = () => {
  const { user } = useContext(AuthContext);

  return useQuery(['accounts-form', user?.id], () => getAccountsForForm(), {
    staleTime: 1000 * 5
  })
}