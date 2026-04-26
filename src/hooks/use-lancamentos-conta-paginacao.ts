import { LANCAMENTOS_CONTA_QUERY_KEY } from "@/helpers/query-keys-helper";
import { lancamentoContaService } from "@/services/lancamento-conta-service";
import { useQuery } from "@tanstack/react-query";

export function useLancamentosContaPaginacao(
  idConta: string,
  page: number,
  perPage: number,
  inicio: string,
  fim: string,
) {
  return useQuery({
    queryKey: [
      LANCAMENTOS_CONTA_QUERY_KEY,
      idConta,
      page,
      perPage,
      inicio,
      fim,
    ],
    queryFn: async () => {
      const response = await lancamentoContaService.listar({
        idConta: idConta,
        inicio,
        fim,
        comPaginacao: true,
        pagina: page,
        size: perPage,
      });
      return response.data;
    },
    staleTime: 1000 * 60 * 15,
  });
}
