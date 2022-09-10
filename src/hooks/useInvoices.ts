import { INVOICE, INVOICES, toBrDate, toCurrency } from './../utils/helpers';
import { useQuery } from "react-query";
import { cardService } from "../services/ApiService/CardService";
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export const getInvoices = async (cardId: number, status: 'open' | 'paid', page: number, perPage: number) => {
  const response = await cardService.getInvoices(cardId, status, page, perPage);

  const invoices = response.data.data.map(invoice => {
    return {
      ...invoice,
      closing_date: toBrDate(invoice.closing_date),
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
      due_date: response.data.due_date,
  }

  return invoice
}

export const useInvoices = (cardId: number, status: 'open' | 'paid', page: number, perPage: number) => {
  const { user } = useContext(AuthContext);

  return useQuery([INVOICE, cardId, status, page, perPage, user?.id], () => getInvoices(cardId, status, page, perPage), {
    staleTime: 1000 * 60 * 15
  })
}

export const useInvoice = (cardId: number, invoiceId: number) => {
  const { user } = useContext(AuthContext);

  return useQuery([INVOICES, cardId, invoiceId, user?.id], () => getInvoice(cardId, invoiceId), {
    staleTime: 1000 * 60 * 15
  })
}