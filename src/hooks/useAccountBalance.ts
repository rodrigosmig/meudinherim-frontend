import { useQuery } from "react-query";
import { accountService } from "../services/ApiService/AccountService";
import { AccountIdType } from "../types/account";
import { ACCOUNT_BALANCE, toCurrency } from "../utils/helpers";
import { useUser } from "./useUser";

export const getAccountBalance = async (id: AccountIdType) => {
  const response = await accountService.balance(id);

  const balances = response.data.balances.map(account => {
    return {
      ...account,
      balance: toCurrency(account.balance),
      positive: account.balance >= 0
    }

  })

  const data = {
    balances: balances,
    total: {
      value: toCurrency(response.data.total),
      positive: response.data.total >= 0
    }
  }

  return data
}

export const useAccountBalance = (id: AccountIdType) => {
  const { user } = useUser();

  return useQuery([ACCOUNT_BALANCE, id, user?.id], () => getAccountBalance(id), {
    staleTime: 1000 * 60 * 15
  })
}