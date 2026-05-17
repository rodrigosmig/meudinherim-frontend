import { RELATORIO_LANCAMENTOS_POR_CATEGORIA_QUERY_KEY } from "@/helpers/query-keys-helper";
import { ApiResponse } from "@/types/api";
import { RelatorioLancamentosPorCategoriaData } from "@/types/relatorio";
import { TipoRelatorioPorCategoria } from "@/types/enum/tipo-relatorio-por-categoria";
import { relatorioService } from "@/services/relatorios-service";
import { useQuery } from "@tanstack/react-query";

export function useRelatorioLancamentosPorCategoria(
  inicio: string,
  fim: string,
  tipo: TipoRelatorioPorCategoria,
  uuid: string,
  tags: string[],
) {
  return useQuery({
    queryKey: [RELATORIO_LANCAMENTOS_POR_CATEGORIA_QUERY_KEY, inicio, fim, tipo, uuid, tags],
    queryFn: async () => {
      const res = await relatorioService.lancamentosPorCategoria({ inicio, fim, tipo, uuid, tags });
      return (res as ApiResponse<RelatorioLancamentosPorCategoriaData>).data;
    },
    enabled: !!(inicio && fim),
    staleTime: 0,
  });
}
