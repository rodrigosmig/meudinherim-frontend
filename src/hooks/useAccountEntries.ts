import { useQuery } from "react-query";
import { accountEntriesService } from "../services/ApiService/AccountEntriesService";
import { toBrDate, toCurrency } from '../utils/helpers';


export const getAccountEntries = async (account_id: number, filterDate: [string, string], page: number, perPage: number) => {
  const response = await accountEntriesService.list(account_id, filterDate, page, perPage);

  const entries = response.data.data.map(entry => {
    return {
      id: entry.id,
      date: toBrDate(entry.date),
      description: entry.description,
      value: toCurrency(entry.value),
      category: entry.category,
      account: entry.account
    }
  })

  const data = {
    entries: entries,
    meta: {
      from: response.data.meta.from,
      to: response.data.meta.to,
      current_page: response.data.meta.current_page,
      last_page: response.data.meta.last_page,
      per_page: response.data.meta.per_page,
      total: response.data.meta.total
    }
  }

  return data
}

export const useAccountEntries = (account_id: number, filterDate: [string, string], page: number, perPage: number) => {
  return useQuery(['accountEntries', account_id, filterDate, page, perPage], () => getAccountEntries(account_id, filterDate, page, perPage), {
    staleTime: 1000 * 5
  })
}