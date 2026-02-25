import { CadastrarUsuarioBody, CadastrarUsuarioResponse, LoginBody, LoginResponse, RecuperarSenhaBody, RecuperarSenhaResponse, } from "@/types/auth";

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
