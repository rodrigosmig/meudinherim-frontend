import { ApiResponse } from "@/types/api";
import { RelatorioDetalhesLancamentosPorCategoriaData } from "@/types/relatorio";
import { TipoRelatorioPorCategoria } from "@/types/enum/tipo-relatorio-por-categoria";
import { relatorioService } from "@/services/relatorios-service";
import { useQuery } from "@tanstack/react-query";

type Params = {
  inicio: string;
  fim: string;
  tipo: TipoRelatorioPorCategoria;
  uuid: string;
  tags: string[];
  idCategoria: string;
} | null;

export function useDetalhesLancamentosPorCategoria(params: Params) {
  return useQuery({
    queryKey: ["detalhes_lancamentos_por_categoria", params],
    queryFn: async () => {
      const res = await relatorioService.detalhesLancamentosPorCategoria({
        inicio: params!.inicio,
        fim: params!.fim,
        tipo: params!.tipo,
        uuid: params!.uuid,
        tags: params!.tags,
        idCategoria: params!.idCategoria,
      });
      return (res as ApiResponse<RelatorioDetalhesLancamentosPorCategoriaData>).data;
    },
    enabled: !!params && !!params.inicio && !!params.fim,
    staleTime: 0,
  });
}
