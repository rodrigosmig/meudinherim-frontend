import {handleApiResponse} from "@/helpers/response-helper";
import {ApiResponse} from "@/types/api";
import {
  CadastrarUsuarioRequest,
  CadastrarUsuarioResponse,
  ConfirmarUsuarioParam,
  LoginRequest,
  LoginResponse,
  RecuperarSenhaRequest,
  RecuperarSenhaResponse,
  ReenviarEmailConfirmacaoBody,
  ResetarSenhaRequest,
} from "@/types/auth";

export async function cadastrarUsuario(
  cadastrarUsuarioBody: CadastrarUsuarioRequest,
): Promise<CadastrarUsuarioResponse> {
  const response = await fetch("/api/auth/cadastrar-usuario", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cadastrarUsuarioBody),
  });

  return await handleApiResponse<CadastrarUsuarioResponse>(response);
}

export async function autenticar(
  loginBody: LoginRequest,
): Promise<LoginResponse> {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(loginBody),
  });

  return await handleApiResponse<LoginResponse>(response);
}

export async function recuperarSenha(
  recuperarSenhaBody: RecuperarSenhaRequest,
): Promise<RecuperarSenhaResponse> {
  const response = await fetch("/api/auth/recuperar-senha", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(recuperarSenhaBody),
  });

  return await handleApiResponse<RecuperarSenhaResponse>(response);
}

export async function logout() {
  await fetch("/api/auth/logout", {
    method: "POST",
  });
}

export async function confirmarEmail(
  confirmarEmailParam: ConfirmarUsuarioParam,
): Promise<ApiResponse<void>> {
  const response = await fetch("/api/auth/confirmar-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(confirmarEmailParam),
  });

  return await handleApiResponse<ApiResponse<void>>(response);
}

export async function reenviarEmailConfirmacao(
  reenviarEmailConfirmacaoBody: ReenviarEmailConfirmacaoBody,
): Promise<ApiResponse<void>> {
  const response = await fetch("/api/auth/reenviar-email-confirmacao", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(reenviarEmailConfirmacaoBody),
  });

  return await handleApiResponse<ApiResponse<void>>(response);
}

export async function resetarSenha(
  resetarSenhaBody: ResetarSenhaRequest,
): Promise<ApiResponse<void>> {
  const response = await fetch("/api/auth/resetar-senha", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(resetarSenhaBody),
  });

  return await handleApiResponse<ApiResponse<void>>(response);
}
