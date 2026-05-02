import { handleApiResponse } from "@/helpers/response-helper";
import { validarAutenticacao } from "@/helpers/session-client-helper";
import {
  RelatorioContasAgendadasRequest,
  RelatorioContasAgendadasResponse,
} from "@/types/relatorio";

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
};
