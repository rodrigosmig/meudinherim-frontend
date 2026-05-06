import { CONTAS_A_PAGAR_QUERY_KEY } from "@/helpers/query-keys-helper";
import { contasAPagarService } from "@/services/contas-a-pagar-service";
import { useQuery } from "@tanstack/react-query";

import { StatusContaAgendada } from "./../types/enum/status-conta-agendada";

export function useContasAPagarPaginacao(
  page: number,
  perPage: number,
  inicio: string,
  fim: string,
  status: StatusContaAgendada | "",
) {
  return useQuery({
    queryKey: [CONTAS_A_PAGAR_QUERY_KEY, page, perPage, inicio, fim, status],
    queryFn: async () => {
      const response = await contasAPagarService.listar({
        inicio,
        fim,
        status: status as StatusContaAgendada,
        comPaginacao: true,
        pagina: page,
        size: perPage,
      });
      return response.data;
    },
    staleTime: 1000 * 60 * 15,
  });
}
