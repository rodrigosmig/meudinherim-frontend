import { ApiFormErrorResponse, ApiResponse } from "@/types/api";
import { CadastrarUsuarioBody } from "@/types/auth";

export type CadastroUsuarioResponse =
  | ApiResponse<{ idUsuario: string }>
  | ApiFormErrorResponse;

export async function cadastrarUsuario(
  cadastrarUsuarioBody: CadastrarUsuarioBody,
): Promise<CadastroUsuarioResponse> {
  const response = await fetch("/api/auth/cadastrar-usuario", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cadastrarUsuarioBody),
  });
  const data = await response.json();
  // Garante que o retorno seja tipado corretamente
  return data as CadastroUsuarioResponse;
}
