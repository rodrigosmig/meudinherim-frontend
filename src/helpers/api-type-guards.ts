// src/utils/api-type-guards.ts
import { ApiFormErrorResponse, ApiResponse } from "@/types/api";

/**
 * Verifica se uma resposta é um erro de formulário (possui fields).
 */
export function isApiFormErrorResponse(
  response: unknown,
): response is ApiFormErrorResponse {
  return (
    !!response &&
    typeof response === "object" &&
    "data" in response &&
    Array.isArray((response as any).data?.fields) &&
    (response as any).data.fields.length > 0
  );
}

/**
 * Verifica se uma resposta é sucesso (codigo === 0).
 * Pode ser usada para qualquer response tipada que siga o padrão ApiResponse.
 */
export function isApiSuccessResponse<T = unknown>(
  response: unknown,
): response is ApiResponse<T> {
  return (
    !!response &&
    typeof response === "object" &&
    "message" in response &&
    typeof (response as any).message?.codigo === "number" &&
    (response as any).message.codigo === 0
  );
}

/**
 * Extrai a mensagem de erro padrão de qualquer response que siga o padrão { message: { descricao: string } }
 * Pode ser usada em qualquer formulário ou serviço.
 */
export function getApiErrorMessage(
  response: unknown,
  fallback = "Erro Interno",
): string {
  return (
    (response as { message?: { descricao?: string } })?.message?.descricao ||
    fallback
  );
}

/**
 * Extrai o código de erro padrão de qualquer response que siga o padrão { message: { codigo: number } }
 * Pode ser usada em qualquer formulário ou serviço.
 */
export function getApiErrorCode(response: unknown, fallback = -999): number {
  return (
    (response as { message?: { codigo?: number } })?.message?.codigo || fallback
  );
}
