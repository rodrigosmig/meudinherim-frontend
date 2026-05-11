import {
  normalizarApiResponsePaginadaBackendParaFrontend,
  paraPaginaBackend,
} from "@/helpers/paginacao-helper";
import { handleApiResponse } from "@/helpers/response-helper";
import { validarAutenticacao } from "@/helpers/session-client-helper";
import { ApiResponse } from "@/types/api";
import {
  AlterarCategoriaResponse,
  CadastrarCategoriaRequest,
  CadastrarCategoriaResponse,
  Categoria,
  ListarCategoriaRequest,
  ObterCategoriaResponse,
} from "@/types/categorias";
import { Pagina } from "@/types/pagina";

export type CategoryType = "entrada" | "saida";

export const categoriasService = {
  listar: async (
    request: ListarCategoriaRequest,
  ): Promise<ApiResponse<Pagina<Categoria>>> => {
    const params = new URLSearchParams({
      tipo: request.tipo,
      status: request.status.toString(),
      comPaginacao: request.comPaginacao.toString(),
      page: paraPaginaBackend(request.pagina).toString(),
      size: request.size.toString(),
    });

    const url = `/api/proxy/v1/categorias/?${params.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      credentials: "same-origin",
    });

    validarAutenticacao(response);

    if (!response.ok) throw new Error("Falha ao listar categorias");

    const payload: ApiResponse<Pagina<Categoria>> = await response.json();

    return normalizarApiResponsePaginadaBackendParaFrontend(payload);
  },

  cadastrar: async (
    request: CadastrarCategoriaRequest,
  ): Promise<CadastrarCategoriaResponse> => {
    const url = `/api/proxy/v1/categorias`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });

    validarAutenticacao(response);

    return handleApiResponse<CadastrarCategoriaResponse>(response);
  },

  alterar: async (
    idCategoria: string,
    request: CadastrarCategoriaRequest,
  ): Promise<AlterarCategoriaResponse> => {
    const url = `/api/proxy/v1/categorias/${idCategoria}`;

    const response = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });

    validarAutenticacao(response);

    return handleApiResponse<AlterarCategoriaResponse>(response);
  },

  obter: async (idCategoria: string): Promise<ObterCategoriaResponse> => {
    const url = `/api/proxy/v1/categorias/${idCategoria}`;

    const response = await fetch(url, {
      method: "GET",
      credentials: "same-origin",
    });

    validarAutenticacao(response);

    return handleApiResponse<ObterCategoriaResponse>(response);
  },

  deletar: async (idCategoria: string): Promise<ApiResponse<void>> => {
    const url = `/api/proxy/v1/categorias/${idCategoria}`;

    const response = await fetch(url, {
      method: "DELETE",
      credentials: "same-origin",
    });

    validarAutenticacao(response);

    return handleApiResponse<ApiResponse<void>>(response);
  },

  ativar: async (idCategoria: string): Promise<ApiResponse<void>> => {
    const url = `/api/proxy/v1/categorias/${idCategoria}/ativar`;

    const response = await fetch(url, {
      method: "PATCH",
      credentials: "same-origin",
    });

    validarAutenticacao(response);

    return handleApiResponse<ApiResponse<void>>(response);
  },

  desativar: async (idCategoria: string): Promise<ApiResponse<void>> => {
    const url = `/api/proxy/v1/categorias/${idCategoria}/desativar`;

    const response = await fetch(url, {
      method: "PATCH",
      credentials: "same-origin",
    });

    validarAutenticacao(response);

    return handleApiResponse<ApiResponse<void>>(response);
  },
};
