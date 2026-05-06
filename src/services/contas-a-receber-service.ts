import {
  normalizarApiResponsePaginadaBackendParaFrontend,
  paraPaginaBackend,
} from "@/helpers/paginacao-helper";
import { handleApiResponse } from "@/helpers/response-helper";
import { validarAutenticacao } from "@/helpers/session-client-helper";
import { ApiResponse } from "@/types/api";
import {
  AlterarContaAReceberResponse,
  CadastrarContaAgendadaRequest,
  CadastrarContaAReceberResponse,
  ContaAgendada,
  ListarContaAgendadaRequest,
  ObterContaAReceberResponse,
  PagarContaAgendadaRequest,
} from "@/types/conta-agendada";
import { Pagina } from "@/types/pagina";

export const contasAReceberService = {
  listar: async (
    request: ListarContaAgendadaRequest,
  ): Promise<ApiResponse<Pagina<ContaAgendada>>> => {
    const params = new URLSearchParams({
      inicio: request.inicio,
      fim: request.fim,
      comPaginacao: request.comPaginacao.toString(),
      page: paraPaginaBackend(request.pagina).toString(),
      size: request.size.toString(),
    });

    if (request.status) {
      params.append("status", request.status);
    }

    const url = `/api/proxy/v1/contas-a-receber?${params.toString()}`;

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
  ): Promise<CadastrarContaAReceberResponse> => {
    const url = `/api/proxy/v1/contas-a-receber`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });

    validarAutenticacao(response);

    return handleApiResponse<CadastrarContaAReceberResponse>(response);
  },

  alterar: async (
    idContaAReceber: string,
    request: CadastrarContaAgendadaRequest,
  ): Promise<AlterarContaAReceberResponse> => {
    const url = `/api/proxy/v1/contas-a-receber/${idContaAReceber}`;

    const response = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });

    validarAutenticacao(response);

    return handleApiResponse<AlterarContaAReceberResponse>(response);
  },

  obter: async (
    idContaAReceber: string,
  ): Promise<ObterContaAReceberResponse> => {
    const url = `/api/proxy/v1/contas-a-receber/${idContaAReceber}`;

    const response = await fetch(url, {
      method: "GET",
      credentials: "same-origin",
    });

    validarAutenticacao(response);

    return handleApiResponse<ObterContaAReceberResponse>(response);
  },

  deletar: async (idContaAReceber: string): Promise<ApiResponse<void>> => {
    const url = `/api/proxy/v1/contas-a-receber/${idContaAReceber}`;

    const response = await fetch(url, {
      method: "DELETE",
      credentials: "same-origin",
    });

    validarAutenticacao(response);

    return handleApiResponse<ApiResponse<void>>(response);
  },

  pagamento: async (
    idContaAReceber: string,
    request: PagarContaAgendadaRequest,
  ): Promise<ApiResponse<void>> => {
    const url = `/api/proxy/v1/contas-a-receber/pagamento/${idContaAReceber}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });

    validarAutenticacao(response);

    return handleApiResponse<ApiResponse<void>>(response);
  },

  cancelarRecebimento: async (
    idContaAReceber: string,
    idParcela?: string,
  ): Promise<ApiResponse<void>> => {
    const params = new URLSearchParams();

    if (idParcela) {
      params.append("idParcela", idParcela);
    }

    const url = `/api/proxy/v1/contas-a-receber/pagamento/cancelar/${idContaAReceber}?${params.toString()}`;

    const response = await fetch(url, {
      method: "POST",
      credentials: "same-origin",
    });

    validarAutenticacao(response);

    return handleApiResponse<ApiResponse<void>>(response);
  },
};
