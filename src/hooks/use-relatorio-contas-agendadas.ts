import { RELATORIO_CONTAS_AGENDADAS_QUERY_KEY } from "@/helpers/query-keys-helper";
import { ApiResponse } from "@/types/api";
import { RelatorioContasAgendadas } from "@/types/relatorio";
import { StatusPagamento } from "@/types/enum/status-pagamento";
import { relatorioService } from "@/services/relatorios-service";
import { useQuery } from "@tanstack/react-query";

export function useRelatorioContasAgendadas(
  inicio: string,
  fim: string,
  statusPagamento: StatusPagamento,
) {
  return useQuery({
    queryKey: [RELATORIO_CONTAS_AGENDADAS_QUERY_KEY, inicio, fim, statusPagamento],
    queryFn: async () => {
      const res = await relatorioService.contasAgendadas({ inicio, fim, statusPagamento });
      return (res as ApiResponse<RelatorioContasAgendadas>).data;
    },
    enabled: !!(inicio && fim),
    staleTime: 0,
  });
}
