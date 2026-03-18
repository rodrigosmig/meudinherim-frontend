import {
  normalizarApiResponsePaginadaBackendParaFrontend,
  paraPaginaBackend,
} from "@/helpers/paginacao-helper";
import { validarAutenticacao } from "@/helpers/session-client-helper";
import { ApiResponse } from "@/types/api";
import {
  LancamentoConta,
  LancamentosContaRequest,
} from "@/types/lancamento-conta";
import { Pagina } from "@/types/pagina";

export const lancamentoContaService = {
  listar: async (
    request: LancamentosContaRequest,
  ): Promise<ApiResponse<Pagina<LancamentoConta>>> => {
    const params = new URLSearchParams({
      inicio: request.inicio,
      fim: request.fim,
      comPaginacao: request.comPaginacao.toString(),
      page: paraPaginaBackend(request.pagina).toString(),
      size: request.size.toString(),
    });

    const url = `/api/proxy/v1/contas/${request.idConta}/lancamentos?${params.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      credentials: "same-origin",
    });

    validarAutenticacao(response);

    if (!response.ok) throw new Error("Falha ao listar lançamentos de conta");

    const payload: ApiResponse<Pagina<LancamentoConta>> = await response.json();

    return normalizarApiResponsePaginadaBackendParaFrontend(payload);
  },
};
