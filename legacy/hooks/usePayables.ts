import { PAYABLES, toBrDate } from './../utils/helpers';
import { useQuery } from "react-query";
import { payableService } from "../services/ApiService/PayableService";
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export const getPayables = async (filterDate: [string, string], page: number, perPage: number, status: string) => {
  const response = await payableService.list(filterDate, page, perPage, status);

  const payables = response.data.data.map(payable => {
    return {
      id: payable.id,
      due_date: toBrDate(payable.due_date),
      paid_date: toBrDate(payable.paid_date),
      description: payable.description,
      value: payable.value,
      category: {
        id: payable.category.id,
        name: payable.category.name,
        type: payable.category.type
      },
      invoice: payable.invoice,
      paid: payable.paid,
      monthly: payable.monthly,
      has_parcels: payable.has_parcels,
      is_parcel: payable.is_parcel,
      total_purchase: payable.total_purchase,
      parcel_number: payable.parcel_number,
      parcelable_id: payable.parcelable_id,
      tags: payable.tags
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
  const { user } = useContext(AuthContext);

  return useQuery([PAYABLES, filterDate, page, perPage, status, user?.id], () => getPayables(filterDate, page, perPage, status), {
    staleTime: 1000 * 60 * 15
  })
}