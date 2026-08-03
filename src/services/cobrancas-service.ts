import { validarAutenticacao } from "@/helpers/session-client-helper";
import { ApiResponse } from "@/types/api";
import { handleApiResponse } from "@/helpers/response-helper";
import { paraPaginaBackend, normalizarApiResponsePaginadaBackendParaFrontend } from "@/helpers/paginacao-helper";
import { Pagina } from "@/types/pagina";
import {
  CobrancaEmitida,
  CobrancaRecebida,
  GerarContaAPagarRequest,
  GerarContaAPagarResponse,
  ListarCobrancasRequest,
} from "@/types/cobranca";

export const cobrancasService = {
  listarEmitidas: async (
    req: ListarCobrancasRequest,
  ): Promise<ApiResponse<Pagina<CobrancaEmitida>>> => {
    const params = new URLSearchParams();
    params.append("comPaginacao", String(req.comPaginacao));
    params.append("page", String(paraPaginaBackend(req.pagina)));
    params.append("size", String(req.size));
    if (req.status) params.append("status", req.status);
    if (req.inicio) params.append("inicio", req.inicio);
    if (req.fim) params.append("fim", req.fim);

    const url = `/api/proxy/v1/cobrancas/emitidas?${params.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      credentials: "same-origin",
    });

    validarAutenticacao(response);

    const payload = await handleApiResponse<ApiResponse<Pagina<CobrancaEmitida>>>(response);
    return normalizarApiResponsePaginadaBackendParaFrontend(payload);
  },

  listarRecebidas: async (
    req: ListarCobrancasRequest,
  ): Promise<ApiResponse<Pagina<CobrancaRecebida>>> => {
    const params = new URLSearchParams();
    params.append("comPaginacao", String(req.comPaginacao));
    params.append("page", String(paraPaginaBackend(req.pagina)));
    params.append("size", String(req.size));
    if (req.status) params.append("status", req.status);
    if (req.inicio) params.append("inicio", req.inicio);
    if (req.fim) params.append("fim", req.fim);

    const url = `/api/proxy/v1/cobrancas/recebidas?${params.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      credentials: "same-origin",
    });

    validarAutenticacao(response);

    const payload = await handleApiResponse<ApiResponse<Pagina<CobrancaRecebida>>>(response);
    return normalizarApiResponsePaginadaBackendParaFrontend(payload);
  },

  gerarContaAPagar: async (
    uuid: string,
    req: GerarContaAPagarRequest,
  ): Promise<ApiResponse<GerarContaAPagarResponse>> => {
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

  marcarComoPaga: async (uuid: string): Promise<ApiResponse<void>> => {
    const url = `/api/proxy/v1/cobrancas/${uuid}/pagar`;

    const response = await fetch(url, {
      method: "PATCH",
      credentials: "same-origin",
    });

    validarAutenticacao(response);

    return handleApiResponse<ApiResponse<void>>(response);
  },
};
