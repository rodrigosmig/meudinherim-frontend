import { useContext } from "react";
import { useQuery } from "react-query";
import { AuthContext } from "../contexts/AuthContext";
import { accountService } from "../services/ApiService/AccountService";
import { ACCOUNTS, ACCOUNTS_FORM } from "../utils/helpers";

export const getAccounts = async (active: boolean) => {
  const response = await accountService.list(active);

  const data = response.data.data

  return data
}

export const getAccountsForForm = async (valueDefault = false) => {
  const response = await accountService.list(true);

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

export const useAccounts = (active: boolean) => {
  const { user } = useContext(AuthContext);

  return useQuery([ACCOUNTS, active, user?.id], () => getAccounts(active), {
    staleTime: 1000 * 60 * 15
  })
}

export const useAccountsForm = (valueDefault = false) => {
  const { user } = useContext(AuthContext);

  return useQuery([ACCOUNTS_FORM, user?.id], () => getAccountsForForm(valueDefault), {
    staleTime: 1000 * 60 * 15
  })
}