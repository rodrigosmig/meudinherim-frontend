import { COBRANCAS_EMITIDAS_QUERY_KEY } from "@/helpers/query-keys-helper";
import { cobrancasService } from "@/services/cobrancas-service";
import { CobrancaEmitida } from "@/types/cobranca";
import { useQuery } from "@tanstack/react-query";

export function useCobrancasEmitidas() {
  return useQuery({
    queryKey: [COBRANCAS_EMITIDAS_QUERY_KEY],
    queryFn: async () => {
      const response = await cobrancasService.listarEmitidas();
      return response.data as CobrancaEmitida[];
    },
    staleTime: 1000 * 60 * 5,
  });
}
