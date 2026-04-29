import { FATURAS_QUERY_KEY } from "@/helpers/query-keys-helper";
import { faturasService } from "@/services/faturas-service";
import { StatusPagamento } from "@/types/enum/status-pagamento";
import { useQuery } from "@tanstack/react-query";

export function useFaturasPaginacao(
  idCartao: string,
  page: number,
  perPage: number,
  status: StatusPagamento | "",
) {
  return useQuery({
    queryKey: [FATURAS_QUERY_KEY, idCartao, page, perPage, status],
    queryFn: async () => {
      const response = await faturasService.listar({
        idCartao,
        statusPagamento: status as StatusPagamento,
        comPaginacao: true,
        pagina: page,
        size: perPage,
      });
      return response.data;
    },
    enabled: !!idCartao,
    staleTime: 1000 * 60 * 15,
  });
}
