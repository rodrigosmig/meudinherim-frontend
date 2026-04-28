import { ApiFormErrorResponse, ApiResponse } from "./api";
import { TipoCategoria } from "./enum/tipo-categoria";
import { PaginaRequest } from "./pagina";
import { Parcela } from "./parcela";

export type LancamentoCartao = {
  uuid: string;
  data: string;
  descricao: string;
  valor: number;
  categoria: {
    uuid: string;
    descricao: string;
    tipo: TipoCategoria;
  };
  isParcelado: boolean;
  parcelas: Parcela[];
  idFatura: string;
  tags: string[];
};

export interface ListarLancamentosCartaoRequest extends PaginaRequest {
  idCartao: string;
  idFatura: string;
}

export type CadastrarLancamentoCartaoRequest = {
  idConta: string;
  idCategoria: string;
  dataLancamento: string;
  descricao: string;
  valor: number;
  parcelado: boolean;
  quantidadeParcelas: number;
  tags?: string[];
};

export type AlterarLancamentoCartaoRequest = {
  idConta: string;
  idCategoria: string;
  descricao: string;
  valor: number;
  tags?: string[];
};

export interface CadastrarLancamentoCartaoData {
  idLancamento: string;
}

export interface ObterLancamentoCartaoData {
  lancamento: LancamentoCartao;
}

export type CadastrarLancamentoCartaoResponse =
  | ApiResponse<CadastrarLancamentoCartaoData>
  | ApiFormErrorResponse;

export type ObterLancamentoCartaoResponse =
  | ApiResponse<ObterLancamentoCartaoData>
  | ApiFormErrorResponse;

export type AlterarLancamentoCartaoResponse =
  | ApiResponse<ObterLancamentoCartaoData>
  | ApiFormErrorResponse;
