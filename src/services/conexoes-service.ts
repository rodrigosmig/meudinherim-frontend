import { validarAutenticacao } from "@/helpers/session-client-helper";
import { ApiResponse } from "@/types/api";
import { handleApiResponse } from "@/helpers/response-helper";
import {
  ConexaoResponse,
  EnviarSolicitacaoConexaoRequest,
  EnviarSolicitacaoConexaoResponse,
  Usuario,
} from "@/types/conexao";

export const conexoesService = {
  listar: async (): Promise<ApiResponse<ConexaoResponse>> => {
    const url = `/api/proxy/v1/conexoes`;

    const response = await fetch(url, {
      method: "GET",
      credentials: "same-origin",
    });

    validarAutenticacao(response);

    if (!response.ok) throw new Error("Falha ao listar conexões");

    return response.json();
  },

  listarPendentes: async (): Promise<ApiResponse<ConexaoResponse>> => {
    const url = `/api/proxy/v1/conexoes/pendentes`;

    const response = await fetch(url, {
      method: "GET",
      credentials: "same-origin",
    });

    validarAutenticacao(response);

    if (!response.ok) throw new Error("Falha ao listar conexões");

    return response.json();
  },

  buscarUsuarios: async (q: string): Promise<ApiResponse<Usuario[]>> => {
    const params = new URLSearchParams({ q });
    const url = `/api/proxy/v1/perfil/buscar?${params}`;

    const response = await fetch(url, {
      method: "GET",
      credentials: "same-origin",
    });

    validarAutenticacao(response);

    if (!response.ok) throw new Error("Falha ao listar conexões");

    return response.json();
  },

  enviarSolicitacao: async (
    req: EnviarSolicitacaoConexaoRequest
  ): Promise<ApiResponse<EnviarSolicitacaoConexaoResponse>> => {
    const url = `/api/proxy/v1/conexoes`;

    const response = await fetch(url, {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req),
    });

    validarAutenticacao(response);

    return handleApiResponse<ApiResponse<EnviarSolicitacaoConexaoResponse>>(response);
  },

  aceitar: async (uuid: string): Promise<ApiResponse<void>> => {
    const url = `/api/proxy/v1/conexoes/${uuid}/aceitar`;

    const response = await fetch(url, {
      method: "PATCH",
      credentials: "same-origin",
    });

    validarAutenticacao(response);

    return handleApiResponse<ApiResponse<void>>(response);
  },

  recusar: async (uuid: string): Promise<ApiResponse<void>> => {
    const url = `/api/proxy/v1/conexoes/${uuid}/recusar`;

    const response = await fetch(url, {
      method: "PATCH",
      credentials: "same-origin",
    });

    validarAutenticacao(response);

    return handleApiResponse<ApiResponse<void>>(response);
  },

  remover: async (uuid: string): Promise<ApiResponse<void>> => {
    const url = `/api/proxy/v1/conexoes/${uuid}`;

    const response = await fetch(url, {
      method: "DELETE",
      credentials: "same-origin",
    });

    validarAutenticacao(response);

    return handleApiResponse<ApiResponse<void>>(response);
  },
};
