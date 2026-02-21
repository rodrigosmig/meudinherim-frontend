import {
  ApiRequestOptions,
  ApiResult,
  ApiEnvelope,
  normalizeEnvelope,
} from "@/lib/api";

async function request<T>(path: string, options: ApiRequestOptions = {}) {
  const normalizedPath = path.replace(/^\//, "");

  const response = await fetch(`/api/proxy/${normalizedPath}`, {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const payload = await response.json().catch(() => null);
  const envelope = normalizeEnvelope<T>(
    payload,
    response.status,
    response.ok ? "Sucesso" : "Erro na requisição.",
  );

  if (!response.ok) {
    return {
      ok: false as const,
      status: response.status,
      message: envelope.message,
      data: null as T | null,
    } satisfies ApiResult<T>;
  }

  return {
    ok: true as const,
    status: response.status,
    message: envelope.message,
    data: envelope.data,
  } satisfies ApiResult<T>;
}

export const apiClient = {
  get: <T>(path: string) => request<T>(path, { method: "GET" }),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "POST", body }),
  put: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "PUT", body }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "PATCH", body }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};
