import { ApiFormErrorResponse, ApiResponse } from "./api";

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  ativaNotificacao: boolean;
  avatar: string;
}

export interface AlterarPerfilRequest {
  nome: string;
  email: string;
  ativaNotificacao: boolean;
}

export interface AlterarSenhaRequest {
  senhaAtual: string;
  novaSenha: string;
  novaSenhaConfirmacao: string;
}

export interface AlterarImagemRequest {
  file: File;
}

export interface AlterarPerfilData {
  usuario: Usuario;
}

export interface AlterarImagemData {
  urlAvatar: string;
}

export type AlterarPerfilResponse =
  | ApiResponse<AlterarPerfilData>
  | ApiFormErrorResponse;

export type AlterarSenhaResponse =
  | ApiResponse<void>
  | ApiFormErrorResponse;

export type AlterarImagemResponse =
  | ApiResponse<AlterarImagemData>
  | ApiFormErrorResponse;
