'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  listInvoices,
  updateInvoice,
  type Invoice,
} from '@/services/invoices-service';

export const INVOICES_QUERY_KEY = ['invoices'] as const;

export function useInvoices() {
  return useQuery({
    queryKey: INVOICES_QUERY_KEY,
    queryFn: async () => {
      const response = await listInvoices();
      return response.data;
    },
  });
}

export function useUpdateInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Pick<Invoice, 'status'>>;
    }) => updateInvoice(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVOICES_QUERY_KEY });
    },
  });
}

export function useInvoice(invoiceId: string) {
  const { data: invoices } = useInvoices();
  return invoices?.find((invoice) => invoice.id === invoiceId);
}
