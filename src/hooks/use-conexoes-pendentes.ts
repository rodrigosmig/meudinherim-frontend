import { CONEXOES_PENDENTES_QUERY_KEY } from "@/helpers/query-keys-helper";
import { conexoesService } from "@/services/conexoes-service";
import { Conexao } from "@/types/conexao";
import { useQuery } from "@tanstack/react-query";

export function useConexoesPendentes() {
  return useQuery({
    queryKey: [CONEXOES_PENDENTES_QUERY_KEY],
    queryFn: async () => {
      const response = await conexoesService.listarPendentes();
      return response.data as Conexao[];
    },
    staleTime: 1000 * 60 * 5,
  });
}
