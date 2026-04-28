import { ApiFormErrorResponse, ApiResponse } from "./api";
import { Status } from "./enum/status";
import { TipoCategoria } from "./enum/tipo-categoria";
import { PaginaRequest } from "./pagina";

export interface Categoria {
  uuid: string;
  nome: string;
  tipo: TipoCategoria;
  status: Status;
  exibirNaDashboard: boolean;
}

export interface ListarCategoriaRequest extends PaginaRequest {
  tipo: string;
  status: Status | "";
}

export interface CadastrarCategoriaRequest {
  nome: string;
  tipo: TipoCategoria;
  exibirNaDashboard: boolean;
}

export interface CadastrarCategoriaData {
  idCategoria: string;
}

export interface ObterCategoriaData {
  categoria: Categoria;
}

export type CadastrarCategoriaResponse =
  | ApiResponse<CadastrarCategoriaData>
  | ApiFormErrorResponse;

export type ObterCategoriaResponse =
  | ApiResponse<ObterCategoriaData>
  | ApiFormErrorResponse;

export type AlterarCategoriaResponse =
  | ApiResponse<ObterCategoriaData>
  | ApiFormErrorResponse;
