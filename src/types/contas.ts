import { Status } from "@/types/enum/status";

import { ApiFormErrorResponse, ApiResponse } from "./api";
import { TipoConta } from "./enum/tipo-conta";

export type Conta = {
  uuid: string;
  nome: string;
  tipo: TipoConta;
  status: Status;
  icon: string;
  saldo: number;
};

export interface ContasRequest {
  comPaginacao: boolean;
  status: Status;
  pagina: number;
  size: number;
}

export interface ListaDeContas {
  contas: Conta[];
}

export interface CadastrarContaRequest {
  nome: string;
  tipo: TipoConta;
  icon: string;
}

export interface CadastrarContaData {
  idConta: string;
}

export interface ObterContaData {
  Conta: Conta;
}

export type CadastrarContaResponse =
  | ApiResponse<CadastrarContaData>
  | ApiFormErrorResponse;

export type ObterContaResponse =
  | ApiResponse<ObterContaData>
  | ApiFormErrorResponse;

export type AlterarContaResponse =
  | ApiResponse<ObterContaData>
  | ApiFormErrorResponse;
