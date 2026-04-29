import { CARTOES_QUERY_KEY } from "@/helpers/query-keys-helper";
import { cartoesService } from "@/services/cartoes-service";
import { Status } from "@/types/enum/status";
import { useQuery } from "@tanstack/react-query";

export function useCartoesPaginacao(
  page: number,
  perPage: number,
  status: Status | "",
) {
  return useQuery({
    queryKey: [CARTOES_QUERY_KEY, page, perPage, status],
    queryFn: async () => {
      const response = await cartoesService.listar({
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
