"use client";

import { CONTAS_QUERY_KEY } from "@/helpers/constants";
import { contaService } from "@/services/conta-service";
import { useQuery } from "@tanstack/react-query";

export function useAccounts() {
  return useQuery({
    queryKey: CONTAS_QUERY_KEY,
    queryFn: async () => {
      const response = await contaService.listar({
        comPaginacao: false,
        ativas: true,
        pagina: 0,
        size: 10,
      });
      return response.data;
    },
  });
}

// export function useUpdateAccount() {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: ({ id, data }: { id: string; data: Partial<Conta> }) =>
//       updateAccount(id, data),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ACCOUNTS_QUERY_KEY });
//     },
//   });
// }

// export function useAccount(accountId: string) {
//   const { data: accounts } = useAccounts();
//   return accounts?.contas.find((account) => account.uuid === accountId);
// }
