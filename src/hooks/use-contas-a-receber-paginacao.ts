import { CONTAS_A_RECEBER_QUERY_KEY } from "@/helpers/query-keys-helper";
import { contasAReceberService } from "@/services/contas-a-receber-service";
import { StatusPagamento } from "@/types/enum/status-pagamento";
import { useQuery } from "@tanstack/react-query";

export function useContasAReceberPaginacao(
  page: number,
  perPage: number,
  inicio: string,
  fim: string,
  statusPagamento: StatusPagamento | "",
) {
  return useQuery({
    queryKey: [
      CONTAS_A_RECEBER_QUERY_KEY,
      page,
      perPage,
      inicio,
      fim,
      statusPagamento,
    ],
    queryFn: async () => {
      const response = await contasAReceberService.listar({
        inicio,
        fim,
        statusPagamento: statusPagamento as StatusPagamento,
        comPaginacao: true,
        pagina: page,
        size: perPage,
      });
      return response.data;
    },
    staleTime: 1000 * 60 * 15,
  });
}
