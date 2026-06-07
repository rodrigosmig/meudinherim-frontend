import { validarAutenticacao } from "@/helpers/session-client-helper";
import { ApiResponse } from "@/types/api";
import { handleApiResponse } from "@/helpers/response-helper";
import { CobrancaEmitida, CobrancaRecebida, GerarContaAPagarRequest, GerarContaAPagarResponse } from "@/types/cobranca";

export const cobrancasService = {
  listarEmitidas: async (): Promise<ApiResponse<CobrancaEmitida[]>> => {
    const url = `/api/proxy/v1/cobrancas/emitidas`;

    const response = await fetch(url, {
      method: "GET",
      credentials: "same-origin",
    });

    validarAutenticacao(response);

    if (!response.ok) throw new Error("Falha ao listar cobranças emitidas");

    return response.json();
  },

  listarRecebidas: async (): Promise<ApiResponse<CobrancaRecebida[]>> => {
    const url = `/api/proxy/v1/cobrancas/recebidas`;

    const response = await fetch(url, {
      method: "GET",
      credentials: "same-origin",
    });

    validarAutenticacao(response);

    if (!response.ok) throw new Error("Falha ao listar cobranças recebidas");

    return response.json();
  },

  gerarContaAPagar: async (uuid: string, req: GerarContaAPagarRequest): Promise<ApiResponse<GerarContaAPagarResponse>> => {
    const url = `/api/proxy/v1/cobrancas/${uuid}/gerar-conta-pagar`;

    const response = await fetch(url, {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req),
    });

    validarAutenticacao(response);

    return handleApiResponse<ApiResponse<GerarContaAPagarResponse>>(response);
  },

  cancelar: async (uuid: string): Promise<ApiResponse<void>> => {
    const url = `/api/proxy/v1/cobrancas/${uuid}`;

    const response = await fetch(url, {
      method: "DELETE",
      credentials: "same-origin",
    });

    validarAutenticacao(response);

    return handleApiResponse<ApiResponse<void>>(response);
  },
};
