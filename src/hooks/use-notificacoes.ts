import { NOTIFICACOES_QUERY_KEY } from "@/helpers/query-keys-helper";
import { notificacaoService } from "@/services/notificacoes-service";
import { useQuery } from "@tanstack/react-query";

export function useNotificacoes() {
  return useQuery({
    queryKey: [NOTIFICACOES_QUERY_KEY],
    queryFn: async () => {
      const response = await notificacaoService.listar();
      return response.data;
    },
  });
}
