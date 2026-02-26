import { CadastrarUsuarioBody, CadastrarUsuarioResponse, ConfirmarUsuarioParam, LoginBody, LoginResponse, RecuperarSenhaBody, RecuperarSenhaResponse, ReenviarEmailConfirmacaoBody, ResetarSenhaBody, } from "@/types/auth";
import { ApiResponse } from "@/types/api";

export async function cadastrarUsuario(
  cadastrarUsuarioBody: CadastrarUsuarioBody,
): Promise<CadastrarUsuarioResponse> {
  const response = await fetch("/api/auth/cadastrar-usuario", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cadastrarUsuarioBody),
  });
  const data = await response.json();

  return data as CadastrarUsuarioResponse;
}

export async function login(loginBody: LoginBody): Promise<LoginResponse> {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(loginBody),
  });
  const data = await response.json();

  return data as LoginResponse;
}

export async function recuperarSenha(
  recuperarSenhaBody: RecuperarSenhaBody,
): Promise<RecuperarSenhaResponse> {
  const response = await fetch("/api/auth/recuperar-senha", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(recuperarSenhaBody),
  });
  const data = await response.json();

  return data as RecuperarSenhaResponse;
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
  const data = await response.json();

  return data as ApiResponse<void>;
}

export async function reenviarEmailConfirmacao(
  reenviarEmailConfirmacaoBody: ReenviarEmailConfirmacaoBody,
): Promise<ApiResponse<void>> {
  const response = await fetch("/api/auth/reenviar-email-confirmacao", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(reenviarEmailConfirmacaoBody),
  });
  const data = await response.json();

  return data as ApiResponse<void>;
}

export async function resetarSenha(
  resetarSenhaBody: ResetarSenhaBody,
): Promise<ApiResponse<void>> {
  const response = await fetch("/api/auth/resetar-senha", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(resetarSenhaBody),
  });
  const data = await response.json();

  return data as ApiResponse<void>;
}
