import { ApiFormErrorResponse, ApiResponse } from "./api";
import { Periodicidade } from "./enum/periodicidade";
import { StatusContaAgendada } from "./enum/status-conta-agendada";
import { TipoContaAgendada } from "./enum/tipo-conta-agendada";
import { PaginaRequest } from "./pagina";

export interface ContaAgendada {
  uuid: string;
  dataVencimento: string;
  descricao: string;
  valor: number;
  idFatura: string;
  categoria: {
    uuid: string;
    descricao: string;
  };
  tipo: TipoContaAgendada;
  periodicidade: Periodicidade;
  status: StatusContaAgendada;
  parcelado: boolean;
  dadosParcela: {
    idParcela: string;
    numeroDaParcela: number;
    totalDeParcelas: number;
    valorTotal: number;
    idLancamento: string;
    pago: boolean;
  };
  tags: string[];
}

export interface ListarContaAgendadaRequest extends PaginaRequest {
  status?: StatusContaAgendada;
  inicio: string;
  fim: string;
}

export type CadastrarContaAgendadaRequest = {
  dataVencimento: string;
  descricao: string;
  valor: number;
  idCategoria: string;
  idFatura: string;
  periodicidade: Periodicidade;
  parcelado: boolean;
  quantidadeParcelas: number;
  tags?: string[];
};

export type PagarContaAgendadaRequest = {
  dataPagamento: string;
  valor: number;
  idParcela: string;
  idConta: string;
};

export interface CadastrarContaAReceberData {
  idContaAReceber: string;
}

export interface CadastrarContaAPagarData {
  idContaAPagar: string;
}

export interface ObterContaAReceberData {
  contaAReceber: ContaAgendada;
}

export interface ObterContaAPagarData {
  contaAPagar: ContaAgendada;
}

export type CadastrarContaAReceberResponse =
  | ApiResponse<CadastrarContaAReceberData>
  | ApiFormErrorResponse;

export type CadastrarContaAPagarResponse =
  | ApiResponse<CadastrarContaAPagarData>
  | ApiFormErrorResponse;

export type AlterarContaAPagarResponse =
  | ApiResponse<ObterContaAPagarData>
  | ApiFormErrorResponse;

export type AlterarContaAReceberResponse =
  | ApiResponse<ObterContaAReceberData>
  | ApiFormErrorResponse;

export type ObterContaAPagarResponse =
  | ApiResponse<ObterContaAPagarData>
  | ApiFormErrorResponse;

export type ObterContaAReceberResponse =
  | ApiResponse<ObterContaAReceberData>
  | ApiFormErrorResponse;
