import { useQuery } from "react-query";
import { accountService } from "../services/ApiService/AccountService";
import { AccountIdType } from "../types/account";
import { toCurrency } from "../utils/helpers";
import { useUser } from "./useUser";

export const getAccountBalance = async (id: AccountIdType) => {
  const response = await accountService.balance(id);
  console.log(777, response.data)
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

  return useQuery(['account_balance', id, user?.id], () => getAccountBalance(id), {
    refetchOnWindowFocus: id === 'all' ? false : true,
    enabled: id === 'all' ? false : true
  })
}