import { ORCAMENTOS_QUERY_KEY } from "@/helpers/query-keys-helper";
import { orcamentoService } from "@/services/orcamentos-service";
import { useQuery } from "@tanstack/react-query";

export function useOrcamentosPaginacao(page: number, perPage: number) {
  return useQuery({
    queryKey: [ORCAMENTOS_QUERY_KEY, page, perPage],
    queryFn: async () => {
      const response = await orcamentoService.listar({
        comPaginacao: true,
        pagina: page,
        size: perPage,
      });
      return response.data;
    },
    staleTime: 1000 * 60 * 15,
  });
}
