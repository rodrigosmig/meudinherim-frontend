import { RELATORIO_CONTAS_AGENDADAS_QUERY_KEY } from "@/helpers/query-keys-helper";
import { relatorioService } from "@/services/relatorios-service";
import { ApiResponse } from "@/types/api";
import { StatusContaAgendada } from "@/types/enum/status-conta-agendada";
import { RelatorioContasAgendadas } from "@/types/relatorio";
import { useQuery } from "@tanstack/react-query";

export function useRelatorioContasAgendadas(
  inicio: string,
  fim: string,
  status: StatusContaAgendada,
) {
  return useQuery({
    queryKey: [RELATORIO_CONTAS_AGENDADAS_QUERY_KEY, inicio, fim, status],
    queryFn: async () => {
      const res = await relatorioService.contasAgendadas({
        inicio,
        fim,
        status,
      });
      return (res as ApiResponse<RelatorioContasAgendadas>).data;
    },
    enabled: !!(inicio && fim),
    staleTime: 0,
  });
}
