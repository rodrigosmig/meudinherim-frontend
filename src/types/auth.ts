import { ApiFormErrorResponse, ApiResponse } from "./api";

export interface LoginBody {
  email: string;
  password: string;
}

export interface RecuperarSenhaBody {
  email: string;
}

export interface CadastrarUsuarioBody {
  nome: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

export type CadastroUsuarioData = { idUsuario: string };
export type CadastroUsuarioResponse =
  | ApiResponse<CadastroUsuarioData>
  | ApiFormErrorResponse;
