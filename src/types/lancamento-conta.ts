import { TipoCategoria } from "@/types/enum/tipo-categoria";

import { ApiFormErrorResponse, ApiResponse } from "./api";
import { TipoContaAgendada } from "./enum/tipo-conta-agendada";
import { PaginaRequest } from "./pagina";

export type LancamentoConta = {
  uuid: string;
  data: string;
  descricao: string;
  valor: number;
  categoria: {
    uuid: string;
    descricao: string;
    tipo: TipoCategoria;
  };
  conta: {
    uuid: string;
    descricao: string;
  };
  tags: string[];
  parcela: DadosParcela;
  contaAgendada: DadosContaAgendada;
};

export type DadosParcela = {
  idParcela: string;
  idContaAgendada: string;
  tipoContaAgendada: TipoContaAgendada;
  numeroDaParcela: number;
  totalDeParcelas: number;
};

export type DadosContaAgendada = {
  uuid: string;
  tipo: TipoContaAgendada;
};

export interface ListarLancamentosContaRequest extends PaginaRequest {
  idConta: string;
  inicio: string;
  fim: string;
}

export interface ListaDeLancamentosConta {
  lancamentos: LancamentoConta[];
}

export type CadastrarLancamentoContaRequest = {
  idConta: string;
  idCategoria: string;
  dataLancamento: string;
  descricao: string;
  valor: number;
  tags?: string[];
};

export type TransferirEntreContasRequest = {
  idContaOrigem: string;
  idCategoriaOrigem: string;
  idContaDestino: string;
  idCategoriaDestino: string;
  data: string;
  descricao: string;
  valor: number;
};

export interface CadastrarLancamentoContaData {
  idLancamento: string;
}

export interface ObterLancamentoContaData {
  lancamento: LancamentoConta;
}

export type CadastrarLancamentoContaResponse =
  | ApiResponse<CadastrarLancamentoContaData>
  | ApiFormErrorResponse;

export type ObterLancamentoContaResponse =
  | ApiResponse<ObterLancamentoContaData>
  | ApiFormErrorResponse;

export type AlterarLancamentoContaResponse =
  | ApiResponse<ObterLancamentoContaData>
  | ApiFormErrorResponse;
