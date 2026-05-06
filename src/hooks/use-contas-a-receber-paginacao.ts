import { CONTAS_A_RECEBER_QUERY_KEY } from "@/helpers/query-keys-helper";
import { contasAReceberService } from "@/services/contas-a-receber-service";
import { StatusContaAgendada } from "@/types/enum/status-conta-agendada";
import { useQuery } from "@tanstack/react-query";

export function useContasAReceberPaginacao(
  page: number,
  perPage: number,
  inicio: string,
  fim: string,
  status: StatusContaAgendada | "",
) {
  return useQuery({
    queryKey: [CONTAS_A_RECEBER_QUERY_KEY, page, perPage, inicio, fim, status],
    queryFn: async () => {
      const response = await contasAReceberService.listar({
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
