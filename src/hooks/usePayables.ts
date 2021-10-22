import { toCurrency, toBrDate } from './../utils/helpers';
import { useQuery } from "react-query";
import { payableService } from "../services/ApiService/PayableService";

export const getPayables = async (filterDate: [string, string], page: number, perPage: number, status: string) => {
  const response = await payableService.list(filterDate, page, perPage, status);

  const payables = response.data.data.map(payable => {
    return {
      id: payable.id,
      due_date: toBrDate(payable.due_date),
      paid_date: toBrDate(payable.paid_date),
      description: payable.description,
      value: toCurrency(payable.value),
      category: {
        id: payable.category.id,
        name: payable.category.name,
      },
      invoice_id: payable.invoice_id,
      paid: payable.paid,
      monthly: payable.monthly,
      has_parcels: payable.has_parcels,
      is_parcel: payable.is_parcel,
      parcelable_id: payable.parcelable_id,
    }
  })

  const data = {
    payables,
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

export const usePayables = (filterDate: [string, string], page: number, perPage: number, status: string) => {
  return useQuery(['payables', filterDate, page, perPage, status], () => getPayables(filterDate, page, perPage, status), {
    staleTime: 1000 * 5
  })
}