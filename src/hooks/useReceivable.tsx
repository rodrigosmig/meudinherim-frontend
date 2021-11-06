import { toBrDate } from './../utils/helpers';
import { useQuery } from "react-query";
import { receivableService } from '../services/ApiService/ReceivableService';

export const getReceivables = async (filterDate: [string, string], page: number, perPage: number, status: string) => {
  const response = await receivableService.list(filterDate, page, perPage, status);

  const receivables = response.data.data.map(receivable => {
    return {
      id: receivable.id,
      due_date: toBrDate(receivable.due_date),
      paid_date: toBrDate(receivable.paid_date),
      description: receivable.description,
      value: receivable.value,
      category: {
        id: receivable.category.id,
        name: receivable.category.name,
        type: receivable.category.type
      },
      invoice_id: receivable.invoice_id,
      paid: receivable.paid,
      monthly: receivable.monthly,
      has_parcels: receivable.has_parcels,
      is_parcel: receivable.is_parcel,
      total_purchase: receivable.total_purchase,
      parcel_number: receivable.parcel_number,
      parcelable_id: receivable.parcelable_id,
    }
  })

  const data = {
    receivables,
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

export const useReceivables = (filterDate: [string, string], page: number, perPage: number, status: string) => {
  return useQuery(['receivables', filterDate, page, perPage, status], () => getReceivables(filterDate, page, perPage, status), {
    staleTime: 1000 * 5
  })
}