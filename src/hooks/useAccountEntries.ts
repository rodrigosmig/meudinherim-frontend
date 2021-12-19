import { useContext } from "react";
import { useQuery } from "react-query";
import { AuthContext } from "../contexts/AuthContext";
import { accountEntriesService } from "../services/ApiService/AccountEntriesService";
import { toBrDate } from '../utils/helpers';

export const getAccountEntries = async (account_id: number, filterDate: [string, string], page: number, perPage: number) => {
  const response = await accountEntriesService.list(account_id, filterDate, page, perPage);

  const entries = response.data.data.map(entry => {
    let account_scheduling = null;

    if (entry.account_scheduling != null) {
      account_scheduling = {
        is_parcel: entry.account_scheduling.is_parcel,
        id: entry.account_scheduling.id,
        parcelable_id: entry.account_scheduling.parcelable_id,
        due_date: entry.account_scheduling.due_date,
        paid_date: entry.account_scheduling.paid_date
      }
    }

    return {
      id: entry.id,
      date: toBrDate(entry.date),
      description: entry.description,
      account_scheduling: account_scheduling,
      value: entry.value,
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
  const { user } = useContext(AuthContext);

  return useQuery(['accountEntries', account_id, filterDate, page, perPage, user?.id], () => getAccountEntries(account_id, filterDate, page, perPage), {
    staleTime: 1000 * 5
  })
}