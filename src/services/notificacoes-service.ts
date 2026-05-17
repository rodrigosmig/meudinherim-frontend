import { validarAutenticacao } from "@/helpers/session-client-helper";
import { ListaDeNotificacoes } from "@/types/notificacoes";
import { ApiResponse } from "@/types/api";
import { handleApiResponse } from "@/helpers/response-helper";

export const notificacaoService = {
  listar: async (): Promise<ApiResponse<ListaDeNotificacoes>> => {
    const url = `/api/proxy/v1/notificacoes`;

    const response = await fetch(url, {
      method: "GET",
      credentials: "same-origin",
    });

    validarAutenticacao(response);

    if (!response.ok) throw new Error("Falha ao listar notificações");

    return response.json();
  },

  marcarComoLida: async (idNotificacao: string): Promise<ApiResponse<void>> => {
    const url = `/api/proxy/v1/notificacoes/${idNotificacao}/marcar-como-lida`;

    const response = await fetch(url, {
      method: "PATCH",
      credentials: "same-origin",
    });

    validarAutenticacao(response);

    return handleApiResponse<ApiResponse<void>>(response);
  },

  marcarTodasComoLida: async (): Promise<ApiResponse<void>> => {
    const url = `/api/proxy/v1/notificacoes/marcar-todas-como-lida`;

    const response = await fetch(url, {
      method: "POST",
      credentials: "same-origin",
    });

    validarAutenticacao(response);

    return handleApiResponse<ApiResponse<void>>(response);
  },
};
