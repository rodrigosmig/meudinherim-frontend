import { toBrDate, toCurrency } from './../utils/helpers';
import { useQuery } from "react-query";
import { cardService } from "../services/ApiService/CardService";

export const getInvoices = async (cardId: number, status: 'open' | 'paid', page: number, perPage: number) => {
  const response = await cardService.getInvoices(cardId, status, page, perPage);

  const invoices = response.data.data.map(invoice => {
    return {
      ...invoice,
      due_date: toBrDate(invoice.due_date),
      closing_date: toBrDate(invoice.closing_date),
      amount: toCurrency(invoice.amount)
    }
  })

  const data = {
    invoices: invoices,
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

export const getInvoice = async (cardId: number, invoiceId: number) => {
  const response = await cardService.getInvoice(cardId, invoiceId);

  const invoice = {
    ...response.data,
      due_date: toBrDate(response.data.due_date),
  }

  return invoice
}

export const useInvoices = (cardId: number, status: 'open' | 'paid', page: number, perPage: number) => {
  return useQuery(['invoices', cardId, status, page, perPage], () => getInvoices(cardId, status, page, perPage), {
    staleTime: 1000 * 5
  })
}

export const useInvoice = (cardId: number, invoiceId: number) => {
  return useQuery(['invoice', cardId, invoiceId], () => getInvoice(cardId, invoiceId), {
    staleTime: 1000 * 5
  })
}