import { CONTAS_A_PAGAR_QUERY_KEY } from "@/helpers/query-keys-helper";
import { contasAPagarService } from "@/services/contas-a-pagar-service";
import { StatusPagamento } from "@/types/enum/status-pagamento";
import { useQuery } from "@tanstack/react-query";

export function useContasAPagarPaginacao(
  page: number,
  perPage: number,
  inicio: string,
  fim: string,
  statusPagamento: StatusPagamento | "",
) {
  return useQuery({
    queryKey: [
      CONTAS_A_PAGAR_QUERY_KEY,
      page,
      perPage,
      inicio,
      fim,
      statusPagamento,
    ],
    queryFn: async () => {
      const response = await contasAPagarService.listar({
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
