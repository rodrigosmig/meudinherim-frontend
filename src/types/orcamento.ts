import { ApiFormErrorResponse, ApiResponse } from "./api";
import { PaginaRequest } from "./pagina";

export interface Orcamento {
  uuid: string;
  valor: number;
  categoria: {
    uuid: string;
    descricao: string;
  };
}

export interface ListarOrcamentoRequest extends PaginaRequest {}

export type CadastrarOrcamentoRequest = {
  idCategoria: string;
  valor: number;
};

export interface CadastrarOrcamentoData {
  idOrcamento: string;
}

export interface ObterOrcamentoData {
  orcamento: Orcamento;
}

export type CadastrarOrcamentoResponse =
  | ApiResponse<CadastrarOrcamentoData>
  | ApiFormErrorResponse;

export type ObterOrcamentoResponse =
  | ApiResponse<ObterOrcamentoData>
  | ApiFormErrorResponse;

export type AlterarOrcamentoResponse =
  | ApiResponse<ObterOrcamentoData>
  | ApiFormErrorResponse;
