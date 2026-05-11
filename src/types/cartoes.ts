import { ApiFormErrorResponse, ApiResponse } from "./api";
import { Status } from "./enum/status";
import { PaginaRequest } from "./pagina";

export type Cartao = {
  uuid: string;
  nome: string;
  diaVencimento: number;
  diaFechamento: number;
  limiteCredito: number;
  saldo: number;
  status: Status;
  icon: string;
};

export interface CartoesRequest extends PaginaRequest {
  status: Status;
}

export interface CadastrarCartaoRequest {
  nome: string;
  diaVencimento: number;
  diaFechamento: number;
  limiteCredito: number;
  icon: string;
}

export interface CadastrarCartaoData {
  idCartao: string;
}

export interface ObterCartaoData {
  cartao: Cartao;
}

export type CadastrarCartaoResponse =
  | ApiResponse<CadastrarCartaoData>
  | ApiFormErrorResponse;

export type ObterCartaoResponse =
  | ApiResponse<ObterCartaoData>
  | ApiFormErrorResponse;

export type AlterarCartaoResponse =
  | ApiResponse<ObterCartaoData>
  | ApiFormErrorResponse;
