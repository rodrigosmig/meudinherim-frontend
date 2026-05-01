import {
  normalizarApiResponsePaginadaBackendParaFrontend,
  paraPaginaBackend,
} from "@/helpers/paginacao-helper";
import { handleApiResponse } from "@/helpers/response-helper";
import { validarAutenticacao } from "@/helpers/session-client-helper";
import { ApiResponse } from "@/types/api";
import {
  AlterarContaAPagarResponse,
  CadastrarContaAgendadaRequest,
  CadastrarContaAPagarResponse,
  ContaAgendada,
  ListarContaAgendadaRequestRequest,
  ObterContaAPagarResponse,
  PagarContaAgendadaRequest,
} from "@/types/conta-agendada";
import { Pagina } from "@/types/pagina";

export const contasAPagarService = {
  listar: async (
    request: ListarContaAgendadaRequestRequest,
  ): Promise<ApiResponse<Pagina<ContaAgendada>>> => {
    const params = new URLSearchParams({
      inicio: request.inicio,
      fim: request.fim,
      comPaginacao: request.comPaginacao.toString(),
      page: paraPaginaBackend(request.pagina).toString(),
      size: request.size.toString(),
    });

    if (request.statusPagamento) {
      params.append("statusPagamento", request.statusPagamento);
    }

    const url = `/api/proxy/v1/contas-a-pagar?${params.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      credentials: "same-origin",
    });

    validarAutenticacao(response);

    if (!response.ok) throw new Error("Falha ao listar lançamentos de conta");

    const payload: ApiResponse<Pagina<ContaAgendada>> = await response.json();

    return normalizarApiResponsePaginadaBackendParaFrontend(payload);
  },

  cadastrar: async (
    request: CadastrarContaAgendadaRequest,
  ): Promise<CadastrarContaAPagarResponse> => {
    const url = `/api/proxy/v1/contas-a-pagar`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });

    validarAutenticacao(response);

    return handleApiResponse<CadastrarContaAPagarResponse>(response);
  },

  alterar: async (
    idContaAPagar: string,
    request: CadastrarContaAgendadaRequest,
  ): Promise<AlterarContaAPagarResponse> => {
    const url = `/api/proxy/v1/contas-a-pagar/${idContaAPagar}`;

    const response = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });

    validarAutenticacao(response);

    return handleApiResponse<AlterarContaAPagarResponse>(response);
  },

  obter: async (idContaAPagar: string): Promise<ObterContaAPagarResponse> => {
    const url = `/api/proxy/v1/contas-a-pagar/${idContaAPagar}`;

    const response = await fetch(url, {
      method: "GET",
      credentials: "same-origin",
    });

    validarAutenticacao(response);

    return handleApiResponse<ObterContaAPagarResponse>(response);
  },

  deletar: async (idContaAPagar: string): Promise<ApiResponse<void>> => {
    const url = `/api/proxy/v1/contas-a-pagar/${idContaAPagar}`;

    const response = await fetch(url, {
      method: "DELETE",
      credentials: "same-origin",
    });

    validarAutenticacao(response);

    return handleApiResponse<ApiResponse<void>>(response);
  },

  pagamento: async (
    idContaAPagar: string,
    request: PagarContaAgendadaRequest,
  ): Promise<ApiResponse<void>> => {
    const url = `/api/proxy/v1/contas-a-pagar/pagamento/${idContaAPagar}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });

    validarAutenticacao(response);

    return handleApiResponse<ApiResponse<void>>(response);
  },

  cancelarPagamento: async (
    idContaAPagar: string,
    idParcela?: string,
  ): Promise<ApiResponse<void>> => {
    const params = new URLSearchParams();

    if (idParcela) {
      params.append("idParcela", idParcela);
    }

    const url = `/api/proxy/v1/contas-a-pagar/pagamento/cancelar/${idContaAPagar}?${params.toString()}`;

    const response = await fetch(url, {
      method: "POST",
      credentials: "same-origin",
    });

    validarAutenticacao(response);

    return handleApiResponse<ApiResponse<void>>(response);
  },
};
