import { ApiFormErrorResponse, ApiResponse } from "./api";
import { Usuario } from "./usuario";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginData {
  //TODO verificar pq o response não retorna usuario completo
  usuario: Usuario;
}

export type LoginResponse = ApiResponse<LoginData>; // | ApiFormErrorResponse;

export interface CadastrarUsuarioRequest {
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

export interface RecuperarSenhaRequest {
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

export interface ResetarSenhaRequest {
  token: string;
  password: string;
  passwordConfirmation: string;
}

export type VerificationResult<T = unknown> =
  | { valido: true; payload: T }
  | { valido: false; erro: string };
