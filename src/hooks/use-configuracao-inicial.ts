import { DADOS_CONFIGURACAO_QUERY_KEY } from "@/helpers/query-keys-helper";
import { configuracaoInicialService } from "@/services/configuracao-inicial-service";
import { useQuery } from "@tanstack/react-query";

export function useConfiguracaoInicial() {
  return useQuery({
    queryKey: [DADOS_CONFIGURACAO_QUERY_KEY],
    queryFn: async () => {
      const response = await configuracaoInicialService.obter();
      return response.data;
    },
    staleTime: 1000 * 60 * 15,
  });
}
