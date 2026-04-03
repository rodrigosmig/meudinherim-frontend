import { TipoCategoria } from "@/types/enum/tipo-categoria";

import { ApiFormErrorResponse, ApiResponse } from "./api";

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
};

export interface ListarLancamentosContaRequest {
  idConta: string;
  inicio: string;
  fim: string;
  comPaginacao: boolean;
  pagina: number;
  size: number;
}

export interface ListaDeLancamentosConta {
  lancamentos: LancamentoConta[];
}

export type CadastrarLancamentoContaRequest = {
  idConta: string;
  idCategoria: string;
  dataLancamento: string;
  descricao: string;
  valor: string;
};

export interface CadastrarLancamentoContaData {
  idLancamento: string;
}

export type CadastrarLancamentoContaResponse =
  | ApiResponse<CadastrarLancamentoContaData>
  | ApiFormErrorResponse;
