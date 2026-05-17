import {
  normalizarApiResponsePaginadaBackendParaFrontend,
  paraPaginaBackend,
} from "@/helpers/paginacao-helper";
import { handleApiResponse } from "@/helpers/response-helper";
import { validarAutenticacao } from "@/helpers/session-client-helper";
import { ApiResponse } from "@/types/api";
import {
  AlterarOrcamentoResponse,
  CadastrarOrcamentoRequest,
  CadastrarOrcamentoResponse,
  ListarOrcamentoRequest,
  ObterOrcamentoResponse,
  Orcamento,
} from "@/types/orcamento";
import { Pagina } from "@/types/pagina";

export const orcamentoService = {
  listar: async (
    request: ListarOrcamentoRequest,
  ): Promise<ApiResponse<Pagina<Orcamento>>> => {
    const params = new URLSearchParams({
      comPaginacao: request.comPaginacao.toString(),
      page: paraPaginaBackend(request.pagina).toString(),
      size: request.size.toString(),
    });
    const url = `/api/proxy/v1/orcamentos?${params.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      credentials: "same-origin",
    });

    validarAutenticacao(response);

    if (!response.ok) throw new Error("Falha ao listar orçamentos");

    const payload: ApiResponse<Pagina<Orcamento>> = await response.json();

    return normalizarApiResponsePaginadaBackendParaFrontend(payload);
  },

  cadastrar: async (
    request: CadastrarOrcamentoRequest,
  ): Promise<CadastrarOrcamentoResponse> => {
    const url = `/api/proxy/v1/orcamentos`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });

    validarAutenticacao(response);

    return handleApiResponse<CadastrarOrcamentoResponse>(response);
  },

  alterar: async (
    idOrcamento: string,
    request: CadastrarOrcamentoRequest,
  ): Promise<AlterarOrcamentoResponse> => {
    const url = `/api/proxy/v1/orcamentos/${idOrcamento}`;

    const response = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });

    validarAutenticacao(response);

    return handleApiResponse<AlterarOrcamentoResponse>(response);
  },

  obter: async (idOrcamento: string): Promise<ObterOrcamentoResponse> => {
    const url = `/api/proxy/v1/orcamentos/${idOrcamento}`;

    const response = await fetch(url, {
      method: "GET",
      credentials: "same-origin",
    });

    validarAutenticacao(response);

    return handleApiResponse<ObterOrcamentoResponse>(response);
  },

  deletar: async (idOrcamento: string): Promise<ApiResponse<void>> => {
    const url = `/api/proxy/v1/orcamentos/${idOrcamento}`;

    const response = await fetch(url, {
      method: "DELETE",
      credentials: "same-origin",
    });

    validarAutenticacao(response);

    return handleApiResponse<ApiResponse<void>>(response);
  },
};
