import { LANCAMENTOS_CARTAO_QUERY_KEY } from "@/helpers/query-keys-helper";
import { lancamentoCartaoService } from "@/services/lancamento-cartao-service";
import { useQuery } from "@tanstack/react-query";

export function useLancamentosCartaoPaginacao(
  idCartao: string,
  idFatura: string,
  page: number,
  perPage: number,
) {
  return useQuery({
    queryKey: [
      LANCAMENTOS_CARTAO_QUERY_KEY,
      idCartao,
      idFatura,
      page,
      perPage,
    ],
    queryFn: async () => {
      const response = await lancamentoCartaoService.listar({
        idCartao: idCartao,
        idFatura: idFatura,
        comPaginacao: true,
        pagina: page,
        size: perPage,
      });
      return response.data;
    },
    staleTime: 1000 * 60 * 15,
  });
}
