import { useContext } from "react";
import { useQuery } from "react-query";
import { AuthContext } from "../contexts/AuthContext";
import { accountService } from "../services/ApiService/AccountService";

export const getAccounts = async () => {
  const response = await accountService.list();

  const data = response.data.data

  return data
}

export const getAccountsForForm = async (valueDefault = false) => {
  const response = await accountService.list();

  const formAccounts = response.data.data.map(account => {
    return {
      value: account.id,
      label: account.name
    }
  });

  let data = formAccounts;

  if (valueDefault) {
    data = [
      {
        value: 0,
        label: 'Todas as Contas'
      },
      ...formAccounts
    ];
  }

  return data;
}

export const useAccounts = () => {
  const { user } = useContext(AuthContext);

  return useQuery(['accounts', user?.id], () => getAccounts(), {
    staleTime: 1000 * 5
  })
}

export const useAccountsForm = (valueDefault = false) => {
  const { user } = useContext(AuthContext);

  return useQuery(['accounts-form', user?.id], () => getAccountsForForm(valueDefault), {
    staleTime: 1000 * 5
  })
}