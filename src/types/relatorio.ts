import { ApiFormErrorResponse, ApiResponse } from "./api";
import { ContaAgendada } from "./conta-agendada";
import { StatusContaAgendada } from "./enum/status-conta-agendada";
import { TipoRelatorioPorCategoria } from "./enum/tipo-relatorio-por-categoria";

export interface RelatorioRequest {
  inicio: string;
  fim: string;
}

export interface RelatorioContasAgendadasRequest extends RelatorioRequest {
  status: StatusContaAgendada;
}

export interface RelatorioLancamentosPorCategoriaRequest extends RelatorioRequest {
  tipo: TipoRelatorioPorCategoria;
  uuid: string;
  tags: string[];
}

export interface RelatorioDetalhesLancamentosPorCategoriaRequest extends RelatorioLancamentosPorCategoriaRequest {
  idCategoria: string;
}

export interface RelatorioContasAgendadas {
  contasAPagar: ItemRelatorioContasAgendadas;
  contasAReceber: ItemRelatorioContasAgendadas;
  totalFaturas: number;
}

export interface ItemRelatorioContasAgendadas {
  itens: ContaAgendada[];
  total: number;
}

export interface RelatorioLancamentosPorCategoriaData {
  entrada: ItemLancamentoPorCategoria[];
  saida: ItemLancamentoPorCategoria[];
}

export type ItemLancamentoPorCategoria = {
  idCategoria: string;
  nomeCategoria: string;
  quantidade: number;
  total: number;
};

export interface RelatorioDetalhesLancamentosPorCategoriaData {
  lancamentos: ItemDetalhesLancamentoPorCategoria[];
}

export type ItemDetalhesLancamentoPorCategoria = {
  uuid: string;
  data: string;
  descricao: string;
  valor: number;
  tags: string[];
  tipo: string;
  contaOuCartao: {
    uuid: string;
    descricao: string;
  };
};

export type RelatorioContasAgendadasResponse =
  | ApiResponse<RelatorioContasAgendadas>
  | ApiFormErrorResponse;

export type RelatorioLancamentosPorCategoriaResponse =
  | ApiResponse<RelatorioLancamentosPorCategoriaData>
  | ApiFormErrorResponse;

export type RelatorioDetalhesLancamentosPorCategoriaResponse =
  | ApiResponse<RelatorioDetalhesLancamentosPorCategoriaData>
  | ApiFormErrorResponse;
