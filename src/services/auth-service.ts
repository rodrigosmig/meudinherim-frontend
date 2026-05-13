import { handleApiResponse } from "@/helpers/response-helper";
import {
  CadastrarUsuarioRequest,
  CadastrarUsuarioResponse,
  ConfirmarUsuarioParam,
  LoginRequest,
  LoginResponse,
  RecuperarSenhaRequest,
  RecuperarSenhaResponse,
  ReenviarEmailConfirmacaoRequest,
  ResetarSenhaRequest,
  ValidarCodigoRecuperacaoRequest,
} from "@/types/auth";
import { ApiResponse } from "@/types/api";

export const authService = {
  cadastrarUsuario: async (
    body: CadastrarUsuarioRequest,
  ): Promise<CadastrarUsuarioResponse> => {
    const response = await fetch("/api/auth/cadastrar-usuario", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return handleApiResponse<CadastrarUsuarioResponse>(response);
  },

  autenticar: async (body: LoginRequest): Promise<LoginResponse> => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return handleApiResponse<LoginResponse>(response);
  },

  recuperarSenha: async (
    body: RecuperarSenhaRequest,
  ): Promise<RecuperarSenhaResponse> => {
    const response = await fetch("/api/auth/recuperar-senha", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return handleApiResponse<RecuperarSenhaResponse>(response);
  },

  validarCodigoRecuperacao: async (
    body: ValidarCodigoRecuperacaoRequest,
  ): Promise<ApiResponse<string>> => {
    const response = await fetch("/api/auth/validar-codigo-recuperacao", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return handleApiResponse<ApiResponse<string>>(response);
  },

  resetarSenha: async (body: ResetarSenhaRequest): Promise<ApiResponse<void>> => {
    const response = await fetch("/api/auth/resetar-senha", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return handleApiResponse<ApiResponse<void>>(response);
  },

  logout: async (): Promise<void> => {
    await fetch("/api/auth/logout", { method: "POST" });
  },

  confirmarEmail: async (
    body: ConfirmarUsuarioParam,
  ): Promise<ApiResponse<void>> => {
    const response = await fetch("/api/auth/confirmar-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return handleApiResponse<ApiResponse<void>>(response);
  },

  reenviarEmailConfirmacao: async (
    body: ReenviarEmailConfirmacaoRequest,
  ): Promise<ApiResponse<void>> => {
    const response = await fetch("/api/auth/reenviar-email-confirmacao", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return handleApiResponse<ApiResponse<void>>(response);
  },
};
