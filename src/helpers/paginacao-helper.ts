import { ApiResponse } from "@/types/api";
import { Pagina, Paginacao } from "@/types/pagina";

const PRIMEIRA_PAGINA_BACKEND = 0;
const PRIMEIRA_PAGINA_FRONTEND = 1;

export function paraPaginaBackend(paginaFrontend: number): number {
  if (!Number.isFinite(paginaFrontend)) {
    return PRIMEIRA_PAGINA_BACKEND;
  }

  return Math.max(Math.trunc(paginaFrontend) - 1, PRIMEIRA_PAGINA_BACKEND);
}

export function paraPaginaFrontend(paginaBackend: number): number {
  if (!Number.isFinite(paginaBackend)) {
    return PRIMEIRA_PAGINA_FRONTEND;
  }

  return Math.trunc(paginaBackend) + 1;
}

export function normalizarPaginacaoBackendParaFrontend(
  paginacao: Paginacao,
): Paginacao {
  return {
    ...paginacao,
    paginaAtual: paraPaginaFrontend(paginacao.paginaAtual),
    ultimaPagina: paraPaginaFrontend(paginacao.ultimaPagina),
  };
}

export function normalizarPaginaBackendParaFrontend<T>(
  pagina: Pagina<T>,
): Pagina<T> {
  return {
    ...pagina,
    pagina: {
      ...pagina.pagina,
      paginacao: normalizarPaginacaoBackendParaFrontend(pagina.pagina.paginacao),
    },
  };
}

export function normalizarApiResponsePaginadaBackendParaFrontend<T>(
  response: ApiResponse<Pagina<T>>,
): ApiResponse<Pagina<T>> {
  if (!response.data) {
    return response;
  }

  return {
    ...response,
    data: normalizarPaginaBackendParaFrontend(response.data),
  };
}