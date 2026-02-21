import { normalizeMessage } from "@/lib/api";

export type LoginFieldError = {
  field: string;
  message: string;
};

function extractFieldErrors(payload: unknown): LoginFieldError[] {
  if (!payload || typeof payload !== "object") return [];

  const root = payload as Record<string, unknown>;
  if (!root.data || typeof root.data !== "object") return [];

  const data = root.data as Record<string, unknown>;
  if (!Array.isArray(data.fields)) return [];

  return data.fields
    .filter(
      (fieldError): fieldError is Record<string, unknown> =>
        Boolean(fieldError) && typeof fieldError === "object",
    )
    .map((fieldError) => ({
      field: typeof fieldError.field === "string" ? fieldError.field : "",
      message:
        typeof fieldError.message === "string"
          ? fieldError.message
          : "Campo inválido",
    }))
    .filter((fieldError) => !!fieldError.field);
}

export async function login(email: string, password: string) {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const payload = await response.json().catch(() => null);
  const message = normalizeMessage(
    payload && typeof payload === "object"
      ? (payload as Record<string, unknown>).message
      : null,
    response.status,
    response.ok ? "Sucesso" : "Falha ao realizar login.",
  );

  return {
    ok: response.ok,
    status: response.status,
    message,
    fields: extractFieldErrors(payload),
  };
}

export async function logout() {
  await fetch("/api/auth/logout", {
    method: "POST",
  });
}

export async function recuperarSenha(email: string) {
  const response = await fetch("/api/auth/recuperar-senha", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  const payload = await response.json().catch(() => null);
  const message = normalizeMessage(
    payload && typeof payload === "object"
      ? (payload as Record<string, unknown>).message
      : null,
    response.status,
    response.ok ? "Sucesso" : "Falha ao recuperar senha.",
  );

  return {
    ok: response.ok,
    status: response.status,
    message,
    fields: extractFieldErrors(payload),
  };
}
