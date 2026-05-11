import {
  normalizarApiResponsePaginadaBackendParaFrontend,
  paraPaginaBackend,
} from "@/helpers/paginacao-helper";
import { handleApiResponse } from "@/helpers/response-helper";
import { validarAutenticacao } from "@/helpers/session-client-helper";
import { ApiResponse } from "@/types/api";
import {
  AlterarCartaoResponse,
  CadastrarCartaoRequest,
  CadastrarCartaoResponse,
  Cartao,
  CartoesRequest,
  ObterCartaoResponse,
} from "@/types/cartoes";
import { Pagina } from "@/types/pagina";

export const cartoesService = {
  listar: async (
    request: CartoesRequest,
  ): Promise<ApiResponse<Pagina<Cartao>>> => {
    const params = new URLSearchParams({
      status: request.status,
      comPaginacao: request.comPaginacao.toString(),
      page: paraPaginaBackend(request.pagina).toString(),
      size: request.size.toString(),
    });

    const url = `/api/proxy/v1/cartoes?${params.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      credentials: "same-origin",
    });

    validarAutenticacao(response);

    if (!response.ok) throw new Error("Falha ao listar cartões");

    const payload: ApiResponse<Pagina<Cartao>> = await response.json();

    return normalizarApiResponsePaginadaBackendParaFrontend(payload);
  },

  cadastrar: async (
    request: CadastrarCartaoRequest,
  ): Promise<CadastrarCartaoResponse> => {
    const url = `/api/proxy/v1/cartoes`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });

    validarAutenticacao(response);

    return handleApiResponse<CadastrarCartaoResponse>(response);
  },

  alterar: async (
    idCartao: string,
    request: CadastrarCartaoRequest,
  ): Promise<AlterarCartaoResponse> => {
    const url = `/api/proxy/v1/cartoes/${idCartao}`;

    const response = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });

    validarAutenticacao(response);

    return handleApiResponse<AlterarCartaoResponse>(response);
  },

  obter: async (idCartao: string): Promise<ObterCartaoResponse> => {
    const url = `/api/proxy/v1/cartoes/${idCartao}`;

    const response = await fetch(url, {
      method: "GET",
      credentials: "same-origin",
    });

    validarAutenticacao(response);

    return handleApiResponse<ObterCartaoResponse>(response);
  },

  ativar: async (idCartao: string): Promise<ApiResponse<void>> => {
    const url = `/api/proxy/v1/cartoes/${idCartao}/ativar`;

    const response = await fetch(url, {
      method: "PATCH",
      credentials: "same-origin",
    });

    validarAutenticacao(response);

    return handleApiResponse<ApiResponse<void>>(response);
  },

  desativar: async (idCartao: string): Promise<ApiResponse<void>> => {
    const url = `/api/proxy/v1/cartoes/${idCartao}/desativar`;

    const response = await fetch(url, {
      method: "PATCH",
      credentials: "same-origin",
    });

    validarAutenticacao(response);

    return handleApiResponse<ApiResponse<void>>(response);
  },
};
