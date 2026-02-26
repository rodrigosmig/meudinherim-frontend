import { ApiFormErrorResponse, ApiResponse } from "./api";

export interface LoginBody {
  email: string;
  password: string;
}

export interface LoginData {
  token: string;
}

export type LoginResponse = ApiResponse<LoginData> | ApiFormErrorResponse;

export interface CadastrarUsuarioBody {
  nome: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

export interface CadastrarUsuarioData {
  idUsuario: string;
}

export type CadastrarUsuarioResponse =
  | ApiResponse<CadastrarUsuarioData>
  | ApiFormErrorResponse;

export interface RecuperarSenhaBody {
  email: string;
}

export type RecuperarSenhaResponse = ApiResponse<void> | ApiFormErrorResponse;

export interface ConfirmarUsuarioParam {
  token: string;
}

export interface ReenviarEmailConfirmacaoBody {
  email: string;
}

export type ReenviarEmailConfirmacaoResponse =
  | ApiResponse<void>
  | ApiFormErrorResponse;

export interface ResetarSenhaBody {
  token: string;
  password: string;
  passwordConfirmation: string;
}
