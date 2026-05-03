import { RelatorioContasAgendadasRequest, RelatorioContasAgendadasResponse, RelatorioDetalhesLancamentosPorCategoriaRequest, RelatorioDetalhesLancamentosPorCategoriaResponse, RelatorioLancamentosPorCategoriaRequest, RelatorioLancamentosPorCategoriaResponse, } from "@/types/relatorio";
import { validarAutenticacao } from "@/helpers/session-client-helper";
import { handleApiResponse } from "@/helpers/response-helper";

export const relatorioService = {
  contasAgendadas: async (
    request: RelatorioContasAgendadasRequest,
  ): Promise<RelatorioContasAgendadasResponse> => {
    const params = new URLSearchParams({
      inicio: request.inicio,
      fim: request.fim,
      statusPagamento: request.statusPagamento.toString(),
    });

    const url = `/api/proxy/v1/relatorios/contas-agendadas/?${params.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      credentials: "same-origin",
    });

    validarAutenticacao(response);

    return handleApiResponse<RelatorioContasAgendadasResponse>(response);
  },

  lancamentosPorCategoria: async (
    request: RelatorioLancamentosPorCategoriaRequest,
  ): Promise<RelatorioLancamentosPorCategoriaResponse> => {
    const params = new URLSearchParams({
      inicio: request.inicio,
      fim: request.fim,
      tipo: request.tipo,
      tags: request.tags.join(","),
    });
    if (request.uuid) params.append("uuid", request.uuid);

    const url = `/api/proxy/v1/relatorios/lancamentos-por-categoria/?${params.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      credentials: "same-origin",
    });

    validarAutenticacao(response);

    return handleApiResponse<RelatorioLancamentosPorCategoriaResponse>(
      response,
    );
  },

  detalhesLancamentosPorCategoria: async (
    request: RelatorioDetalhesLancamentosPorCategoriaRequest,
  ): Promise<RelatorioDetalhesLancamentosPorCategoriaResponse> => {
    const params = new URLSearchParams({
      inicio: request.inicio,
      fim: request.fim,
      idCategoria: request.idCategoria,
      tipo: request.tipo,
      tags: request.tags.join(","),
    });
    if (request.uuid) params.append("uuid", request.uuid);

    const url = `/api/proxy/v1/relatorios/lancamentos-por-categoria/detalhes?${params.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      credentials: "same-origin",
    });

    validarAutenticacao(response);

    return handleApiResponse<RelatorioDetalhesLancamentosPorCategoriaResponse>(
      response,
    );
  },
};
