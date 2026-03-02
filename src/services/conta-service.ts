import { validarAutenticacao } from "@/helpers/session-client-helper";
import { ContasRequest, ListaDeContas } from "@/types/contas";
import { ApiResponse } from "@/types/api";

export const contaService = {
  listar: async (
    request: ContasRequest,
  ): Promise<ApiResponse<ListaDeContas>> => {
    const params = new URLSearchParams({
      status: request.status,
      comPaginacao: request.comPaginacao.toString(),
      pagina: request.pagina.toString(),
      size: request.size.toString(),
    });

    const url = `/api/proxy/v1/contas?${params.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      credentials: "same-origin",
    });

    validarAutenticacao(response);

    if (!response.ok) throw new Error("Falha ao listar contas");

    return response.json();
  },
};
