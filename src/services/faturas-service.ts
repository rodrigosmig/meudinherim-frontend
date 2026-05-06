import {
  normalizarApiResponsePaginadaBackendParaFrontend,
  paraPaginaBackend,
} from "@/helpers/paginacao-helper";
import { handleApiResponse } from "@/helpers/response-helper";
import { validarAutenticacao } from "@/helpers/session-client-helper";
import { ApiResponse } from "@/types/api";
import {
  Fatura,
  FaturasRequest,
  ObterFaturaResponse,
  PagamentoParcialFaturaRequest,
} from "@/types/faturas";
import { Pagina } from "@/types/pagina";

export const faturasService = {
  listar: async (
    request: FaturasRequest,
  ): Promise<ApiResponse<Pagina<Fatura>>> => {
    const params = new URLSearchParams({
      status: request.status,
      comPaginacao: request.comPaginacao.toString(),
      page: paraPaginaBackend(request.pagina).toString(),
      size: request.size.toString(),
    });

    const url = `/api/proxy/v1/cartoes/${request.idCartao}/faturas?${params.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      credentials: "same-origin",
    });

    validarAutenticacao(response);

    if (!response.ok) throw new Error("Falha ao listar faturas");

    const payload: ApiResponse<Pagina<Fatura>> = await response.json();

    return normalizarApiResponsePaginadaBackendParaFrontend(payload);
  },

  obter: async (
    idCartao: string,
    idFatura: string,
  ): Promise<ObterFaturaResponse> => {
    const url = `/api/proxy/v1/cartoes/${idCartao}/faturas/${idFatura}`;

    const response = await fetch(url, {
      method: "GET",
      credentials: "same-origin",
    });

    validarAutenticacao(response);

    return handleApiResponse<ObterFaturaResponse>(response);
  },

  pagamentoParcial: async (
    idCartao: string,
    idFatura: string,
    request: PagamentoParcialFaturaRequest,
  ): Promise<ApiResponse<void>> => {
    const url = `/api/proxy/v1/cartoes/${idCartao}/faturas/${idFatura}/pagamento-parcial`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });

    validarAutenticacao(response);

    return handleApiResponse<ApiResponse<void>>(response);
  },
};
