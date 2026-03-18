import { LANCAMENTOS_CONTA_QUERY_KEY } from "@/helpers/query-keys-helper";
import { lancamentoContaService } from "@/services/lancamento-conta-service";
import { useQuery } from "@tanstack/react-query";

export function useLancamentosConta(idConta: string, page: number, perPage: number) {
  return useQuery({
    queryKey: [LANCAMENTOS_CONTA_QUERY_KEY, idConta, page, perPage],
    queryFn: async () => {
      const response = await lancamentoContaService.listar({
        idConta: idConta,
        inicio: "2026-02-01",
        fim: "2026-03-15",
        comPaginacao: true,
        pagina: page,
        size: perPage,
      });
      return response.data;
    },
  });
}