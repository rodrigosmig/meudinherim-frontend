import { validarAutenticacao } from "@/helpers/session-client-helper";
import { ListaDeFaturas } from "@/types/faturas";
import { ApiResponse } from "@/types/api";

export const faturaService = {
  listarProximasFaturas: async (): Promise<ApiResponse<ListaDeFaturas>> => {
    const url = `/api/proxy/v1/cartoes/proximas-faturas-abertas`;

    const response = await fetch(url, {
      method: "GET",
      credentials: "same-origin",
    });

    validarAutenticacao(response);

    if (!response.ok) throw new Error("Falha ao listar faturas");

    return response.json();
  },
};
