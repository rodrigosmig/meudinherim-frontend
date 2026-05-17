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
    request: CadastrarUsuarioRequest,
  ): Promise<CadastrarUsuarioResponse> => {
    const response = await fetch("/api/auth/cadastrar-usuario", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });
    return handleApiResponse<CadastrarUsuarioResponse>(response);
  },

  autenticar: async (request: LoginRequest): Promise<LoginResponse> => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });
    return handleApiResponse<LoginResponse>(response);
  },

  recuperarSenha: async (
    request: RecuperarSenhaRequest,
  ): Promise<RecuperarSenhaResponse> => {
    const response = await fetch("/api/auth/recuperar-senha", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });
    return handleApiResponse<RecuperarSenhaResponse>(response);
  },

  validarCodigoRecuperacao: async (
    request: ValidarCodigoRecuperacaoRequest,
  ): Promise<ApiResponse<string>> => {
    const response = await fetch("/api/auth/validar-codigo-recuperacao", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });
    return handleApiResponse<ApiResponse<string>>(response);
  },

  resetarSenha: async (request: ResetarSenhaRequest): Promise<ApiResponse<void>> => {
    const response = await fetch("/api/auth/resetar-senha", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
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
