import { normalizarApiResponsePaginadaBackendParaFrontend, paraPaginaBackend } from "@/helpers/paginacao-helper";
import { handleApiResponse } from "@/helpers/response-helper";
import { validarAutenticacao } from "@/helpers/session-client-helper";
import { ApiResponse } from "@/types/api";
import { AlterarLancamentoCartaoRequest, AlterarLancamentoCartaoResponse, CadastrarLancamentoCartaoRequest, CadastrarLancamentoCartaoResponse, LancamentoCartao, ListarLancamentosCartaoRequest } from "@/types/lancamento-cartao";
import { Pagina } from "@/types/pagina";

export const lancamentoCartaoService = {
  listar: async (
    request: ListarLancamentosCartaoRequest,
  ): Promise<ApiResponse<Pagina<LancamentoCartao>>> => {
    const params = new URLSearchParams({
      comPaginacao: request.comPaginacao.toString(),
      page: paraPaginaBackend(request.pagina).toString(),
      size: request.size.toString(),
    });

    const url = `/api/proxy/v1/cartoes/${request.idCartao}/faturas/${request.idFatura}/lancamentos?${params.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      credentials: "same-origin",
    });

    validarAutenticacao(response);

    if (!response.ok) throw new Error("Falha ao listar lançamentos de cartão");

    const payload: ApiResponse<Pagina<LancamentoCartao>> = await response.json();

    return normalizarApiResponsePaginadaBackendParaFrontend(payload);
  },

  cadastrar: async (
    request: CadastrarLancamentoCartaoRequest,
  ): Promise<CadastrarLancamentoCartaoResponse> => {
    const url = `/api/proxy/v1/cartoes/${request.idConta}/lancamentos`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });

    validarAutenticacao(response);

    return handleApiResponse<CadastrarLancamentoCartaoResponse>(
      response,
    );
  },

  alterar: async (
    idLancamento: string,
    request: AlterarLancamentoCartaoRequest,
  ): Promise<AlterarLancamentoCartaoResponse> => {
    const url = `/api/proxy/v1/cartoes/lancamentos/${idLancamento}`;

    const response = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });

    validarAutenticacao(response);

    return handleApiResponse<AlterarLancamentoCartaoResponse>(
      response,
    );
  },

  deletar: async (idLancamento: string): Promise<ApiResponse<void>> => {
    const url = `/api/proxy/v1/cartoes/lancamentos/${idLancamento}`;

    const response = await fetch(url, {
      method: "DELETE",
      credentials: "same-origin",
    });

    validarAutenticacao(response);

    return handleApiResponse<ApiResponse<void>>(response);
  },
}