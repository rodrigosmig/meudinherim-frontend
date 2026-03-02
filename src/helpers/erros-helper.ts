import ApiError from "@/types/application-error";

export const catalogoErros = {
  TOKEN_NAO_ENCONTRADO: -7,
  EMAIL_JA_CADASTRADO: -30,
  CAMPO_INVALIDO_OU_OBRIGATORIO: -90,
  ERRO_AO_AUTENTICAR_USUARIO: -91,
  TOKEN_EXPIRADO: -94,
  ERRO_INTERNO_DO_SERVIDOR: -999,
};

export async function handleApiResponse<T = unknown>(
  response: Response,
): Promise<T> {
  const payload = await response.json().catch(() => undefined);

  if (!response.ok) {
    throw ApiError.fromResponse(response.status, payload);
  }

  return payload as T;
}
