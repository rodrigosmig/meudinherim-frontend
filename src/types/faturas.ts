import { StatusPagamento } from "@/types/enum/status-pagamento";

import { ApiFormErrorResponse, ApiResponse } from "./api";
import { PaginaRequest } from "./pagina";

export interface Fatura {
  uuid: string;
  dataVencimento: string;
  dataFechamento: string;
  valorTotal: number;
  status: StatusPagamento;
  isFechada: boolean;
  cartao: {
    uuid: string;
    descricao: string;
  };
}

export interface FaturasRequest extends PaginaRequest {
  idCartao: string;
  statusPagamento: StatusPagamento;
}

export interface ObterFaturaData {
  fatura: Fatura;
}

export type ObterFaturaResponse =
  | ApiResponse<ObterFaturaData>
  | ApiFormErrorResponse;
