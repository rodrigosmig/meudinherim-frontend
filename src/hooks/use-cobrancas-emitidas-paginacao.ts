import { COBRANCAS_EMITIDAS_QUERY_KEY } from "@/helpers/query-keys-helper";
import { cobrancasService } from "@/services/cobrancas-service";
import { StatusCobranca } from "@/types/enum/status-cobranca";
import { useQuery } from "@tanstack/react-query";

export function useCobrancasEmitidasPaginacao(
  page: number,
  perPage: number,
  inicio?: string,
  fim?: string,
  status?: StatusCobranca,
) {
  return useQuery({
    queryKey: [COBRANCAS_EMITIDAS_QUERY_KEY, page, perPage, inicio, fim, status],
    queryFn: async () => {
      const response = await cobrancasService.listarEmitidas({
        comPaginacao: true,
        pagina: page,
        size: perPage,
        inicio,
        fim,
        status,
      });
      return response.data;
    },
    staleTime: 1000 * 60 * 15,
  });
}
