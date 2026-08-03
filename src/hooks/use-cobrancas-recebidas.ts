import { COBRANCAS_RECEBIDAS_QUERY_KEY } from "@/helpers/query-keys-helper";
import { cobrancasService } from "@/services/cobrancas-service";
import { CobrancaRecebida } from "@/types/cobranca";
import { useQuery } from "@tanstack/react-query";

export function useCobrancasRecebidas() {
  return useQuery({
    queryKey: [COBRANCAS_RECEBIDAS_QUERY_KEY],
    queryFn: async () => {
      const response = await cobrancasService.listarRecebidas({
        comPaginacao: true,
        pagina: 1,
        size: 50,
      });
      return (response.data?.pagina?.conteudo ?? []) as CobrancaRecebida[];
    },
    staleTime: 1000 * 60 * 5,
  });
}
