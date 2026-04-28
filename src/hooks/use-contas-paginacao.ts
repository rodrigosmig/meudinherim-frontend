import { CONTAS_QUERY_KEY } from "@/helpers/query-keys-helper";
import { contasService } from "@/services/contas-service";
import { Status } from "@/types/enum/status";
import { useQuery } from "@tanstack/react-query";

export function useContasPaginacao(
  page: number,
  perPage: number,
  status: Status | "",
) {
  return useQuery({
    queryKey: [CONTAS_QUERY_KEY, "paginacao", page, perPage, status],
    queryFn: async () => {
      const response = await contasService.listar({
        status: status as Status,
        comPaginacao: true,
        pagina: page,
        size: perPage,
      });
      return response.data;
    },
    staleTime: 1000 * 60 * 15,
  });
}
