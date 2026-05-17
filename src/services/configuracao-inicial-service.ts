import { validarAutenticacao } from "@/helpers/session-client-helper";
import { ConfiguracaoInicial } from "@/types/configuracao-inicial";
import { ApiResponse } from "@/types/api";

export const configuracaoInicialService = {
  obter: async (): Promise<ApiResponse<ConfiguracaoInicial>> => {
    const url = `/api/proxy/v1/dados-configuracao`;

    const response = await fetch(url, {
      method: "GET",
      credentials: "same-origin",
    });

    validarAutenticacao(response);

    if (!response.ok)
      throw new Error("Falha ao obter os dados de configuração inicial");

    const payload: ApiResponse<ConfiguracaoInicial> = await response.json();

    return payload;
  },
};
