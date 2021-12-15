import { useQuery } from "react-query";
import { invoiceEntriesService } from "../services/ApiService/InvoiceEntriesService";
import { toBrDate } from '../utils/helpers';


export const getInvoiceEntries = async (cardId: number, invoiceId: number, page: number, perPage: number) => {
  const response = await invoiceEntriesService.list(cardId, invoiceId, page, perPage);

  const entries = response.data.data.map(entry => {
    return {
      ...entry,
      date: toBrDate(entry.date),
    }
  })

  const data = {
    entries,
    meta: {
      from: response.data.from,
      to: response.data.to,
      current_page: response.data.current_page,
      last_page: response.data.last_page,
      per_page: response.data.per_page,
      total: response.data.total
    }
  }

  return data
}

export const useInvoiceEntries = (cardId: number, invoiceId: number, page: number, perPage: number) => {
  return useQuery(['invoiceEntries', cardId, invoiceId, page, perPage], () => getInvoiceEntries(cardId, invoiceId, page, perPage), {
    staleTime: 1000 * 5
  })
}