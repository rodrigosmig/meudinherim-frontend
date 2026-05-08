import { ApiFormErrorResponse, ApiResponse } from "./api";
import { StatusFatura } from "./enum/status-fatura";
import { PaginaRequest } from "./pagina";

export interface Fatura {
  uuid: string;
  dataVencimento: string;
  dataFechamento: string;
  valorTotal: number;
  status: StatusFatura;
  permiteFecharFatura: boolean;
  cartao: {
    uuid: string;
    descricao: string;
  };
}

export interface FaturasRequest extends PaginaRequest {
  idCartao: string;
  status: StatusFatura;
}

export interface PagamentoParcialFaturaRequest {
  idCategoriaEntrada: string;
  idCategoriaSaida: string;
  idConta: string;
  dataPagamento: string;
  descricao: string;
  valor: number;
}

export interface FecharFaturaRequestRequest {
  idCategoria: string;
}

export interface ObterFaturaData {
  fatura: Fatura;
}

export type ObterFaturaResponse =
  | ApiResponse<ObterFaturaData>
  | ApiFormErrorResponse;
