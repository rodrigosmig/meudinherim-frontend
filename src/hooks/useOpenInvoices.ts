import { toBrDate, toCurrency } from './../utils/helpers';
import { useQuery } from "react-query";
import { cardService } from "../services/ApiService/CardService";
import { useUser } from './useUser';

export const getOpenInvoices = async () => {
  const response = await cardService.getOpenInvoices();

  const invoices = response.data.invoices.map(invoice => {
    return {
      ...invoice,
      due_date: toBrDate(invoice.due_date),
      amount: toCurrency(invoice.amount)
    }
  })

  return {
    invoices,
    total: toCurrency(response.data.total)
  }
}

export const useOpenInvoices = () => {
  const { user } = useUser();

  return useQuery(['open_invoices', user?.id], () => getOpenInvoices(), {
    refetchOnWindowFocus: false,
    enabled: false
  })
}