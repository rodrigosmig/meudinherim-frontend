export type Invoice = {
  id: string;
  cardId: string;
  cardName: string;
  dueDate: string;
  closingDate: string;
  totalAmount: number;
  status: "open" | "closed" | "paid";
};

// export async function listInvoices() {
//   const response = await apiClient.get<Invoice[]>("invoices");

//   return {
//     ...response,
//     data: response.data ?? [],
//   };
// }

// export async function updateInvoice(
//   invoiceId: string,
//   payload: Partial<Pick<Invoice, "status">>,
// ) {
//   return apiClient.put<Invoice>(`invoices/${invoiceId}`, payload);
// }
