import {
  normalizarApiResponsePaginadaBackendParaFrontend,
  paraPaginaBackend,
} from "@/helpers/paginacao-helper";
import { handleApiResponse } from "@/helpers/response-helper";
import { validarAutenticacao } from "@/helpers/session-client-helper";
import { ApiResponse } from "@/types/api";
import {
  AlterarContaResponse,
  CadastrarContaRequest,
  CadastrarContaResponse,
  Conta,
  ContasRequest,
  ObterContaResponse,
} from "@/types/contas";
import { Pagina } from "@/types/pagina";

export const contasService = {
  listar: async (
    request: ContasRequest,
  ): Promise<ApiResponse<Pagina<Conta>>> => {
    const params = new URLSearchParams({
      status: request.status,
      comPaginacao: request.comPaginacao.toString(),
      page: paraPaginaBackend(request.pagina).toString(),
      size: request.size.toString(),
    });

    const url = `/api/proxy/v1/contas?${params.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      credentials: "same-origin",
    });

    validarAutenticacao(response);

    if (!response.ok) throw new Error("Falha ao listar contas");

    const payload: ApiResponse<Pagina<Conta>> = await response.json();

    return normalizarApiResponsePaginadaBackendParaFrontend(payload);
  },

  cadastrar: async (
    request: CadastrarContaRequest,
  ): Promise<CadastrarContaResponse> => {
    const url = `/api/proxy/v1/contas`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });

    validarAutenticacao(response);

    return handleApiResponse<CadastrarContaResponse>(response);
  },

  alterar: async (
    idConta: string,
    request: CadastrarContaRequest,
  ): Promise<AlterarContaResponse> => {
    const url = `/api/proxy/v1/contas/${idConta}`;

    const response = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });

    validarAutenticacao(response);

    return handleApiResponse<AlterarContaResponse>(response);
  },

  obter: async (idConta: string): Promise<ObterContaResponse> => {
    const url = `/api/proxy/v1/contas/${idConta}`;

    const response = await fetch(url, {
      method: "GET",
      credentials: "same-origin",
    });

    validarAutenticacao(response);

    return handleApiResponse<ObterContaResponse>(response);
  },

  deletar: async (idConta: string): Promise<ApiResponse<void>> => {
    const url = `/api/proxy/v1/contas/${idConta}`;

    const response = await fetch(url, {
      method: "DELETE",
      credentials: "same-origin",
    });

    validarAutenticacao(response);

    return handleApiResponse<ApiResponse<void>>(response);
  },

  ativar: async (idConta: string): Promise<ApiResponse<void>> => {
    const url = `/api/proxy/v1/contas/${idConta}/ativar`;

    const response = await fetch(url, {
      method: "PATCH",
      credentials: "same-origin",
    });

    validarAutenticacao(response);

    return handleApiResponse<ApiResponse<void>>(response);
  },

  desativar: async (idConta: string): Promise<ApiResponse<void>> => {
    const url = `/api/proxy/v1/contas/${idConta}/desativar`;

    const response = await fetch(url, {
      method: "PATCH",
      credentials: "same-origin",
    });

    validarAutenticacao(response);

    return handleApiResponse<ApiResponse<void>>(response);
  },
};
