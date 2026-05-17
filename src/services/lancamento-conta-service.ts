import {
  normalizarApiResponsePaginadaBackendParaFrontend,
  paraPaginaBackend,
} from "@/helpers/paginacao-helper";
import { handleApiResponse } from "@/helpers/response-helper";
import { validarAutenticacao } from "@/helpers/session-client-helper";
import { ApiResponse } from "@/types/api";
import {
  AlterarLancamentoContaResponse,
  CadastrarLancamentoContaRequest,
  CadastrarLancamentoContaResponse,
  LancamentoConta,
  ListarLancamentosContaRequest,
  ObterLancamentoContaResponse,
  TransferirEntreContasRequest,
} from "@/types/lancamento-conta";
import { Pagina } from "@/types/pagina";

export const lancamentoContaService = {
  listar: async (
    request: ListarLancamentosContaRequest,
  ): Promise<ApiResponse<Pagina<LancamentoConta>>> => {
    const params = new URLSearchParams({
      inicio: request.inicio,
      fim: request.fim,
      comPaginacao: request.comPaginacao.toString(),
      page: paraPaginaBackend(request.pagina).toString(),
      size: request.size.toString(),
    });

    const url = `/api/proxy/v1/contas/${request.idConta}/lancamentos?${params.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      credentials: "same-origin",
    });

    validarAutenticacao(response);

    if (!response.ok) throw new Error("Falha ao listar lançamentos de conta");

    const payload: ApiResponse<Pagina<LancamentoConta>> = await response.json();

    return normalizarApiResponsePaginadaBackendParaFrontend(payload);
  },

  cadastrar: async (
    request: CadastrarLancamentoContaRequest,
  ): Promise<CadastrarLancamentoContaResponse> => {
    const url = `/api/proxy/v1/contas/${request.idConta}/lancamentos`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });

    validarAutenticacao(response);

    return handleApiResponse<CadastrarLancamentoContaResponse>(response);
  },

  alterar: async (
    idLancamento: string,
    request: CadastrarLancamentoContaRequest,
  ): Promise<AlterarLancamentoContaResponse> => {
    const url = `/api/proxy/v1/contas/lancamentos/${idLancamento}`;

    const response = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });

    validarAutenticacao(response);

    return handleApiResponse<AlterarLancamentoContaResponse>(response);
  },

  obter: async (
    idLancamento: string,
  ): Promise<ObterLancamentoContaResponse> => {
    const url = `/api/proxy/v1/contas/lancamentos/${idLancamento}`;

    const response = await fetch(url, {
      method: "GET",
      credentials: "same-origin",
    });

    validarAutenticacao(response);

    return handleApiResponse<ObterLancamentoContaResponse>(response);
  },

  deletar: async (idLancamento: string): Promise<ApiResponse<void>> => {
    const url = `/api/proxy/v1/contas/lancamentos/${idLancamento}`;

    const response = await fetch(url, {
      method: "DELETE",
      credentials: "same-origin",
    });

    validarAutenticacao(response);

    return handleApiResponse<ApiResponse<void>>(response);
  },

  transferirEntreContas: async (request: TransferirEntreContasRequest): Promise<ApiResponse<void>> => {
    const url = `/api/proxy/v1/contas/lancamentos/transferencia-entre-contas`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
      credentials: "same-origin",
    });

    validarAutenticacao(response);

    return handleApiResponse<ApiResponse<void>>(response);
  },
};
