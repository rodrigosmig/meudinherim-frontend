import { validarAutenticacao } from "@/helpers/session-client-helper";
import { ListaDeNotificacoes } from "@/types/notificacoes";
import { ApiResponse } from "@/types/api";

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
};
