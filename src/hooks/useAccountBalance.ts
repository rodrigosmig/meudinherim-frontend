import { useContext } from "react";
import { useQuery } from "react-query";
import { AuthContext } from "../contexts/AuthContext";
import { accountService } from "../services/ApiService/AccountService";
import { toCurrency } from "../utils/helpers";

export const getAccountBalance = async (id: number | null) => {
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

export const useAccountBalance = (id: number | null) => {
  const { user } = useContext(AuthContext);

  return useQuery(['account_balance', id, user?.id], () => getAccountBalance(id), {
    staleTime: 1000 * 5
  })
}