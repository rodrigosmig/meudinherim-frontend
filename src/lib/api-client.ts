type ApiRequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  headers?: Record<string, string>;
};

export type ApiMessage = {
  codigo: number;
  descricao: string;
};

export type ApiEnvelope<T> = {
  message: ApiMessage;
  data: T;
};

export type ApiResult<T> = {
  ok: boolean;
  status: number;
  message: ApiMessage;
  data: T | null;
};

function normalizeMessage(
  message: unknown,
  fallbackCodigo: number,
  fallbackDescricao: string,
): ApiMessage {
  if (message && typeof message === "object") {
    const messageObj = message as Record<string, unknown>;

    if (
      typeof messageObj.codigo === "number" &&
      typeof messageObj.descricao === "string"
    ) {
      return {
        codigo: messageObj.codigo,
        descricao: messageObj.descricao,
      };
    }
  }

  return {
    codigo: fallbackCodigo,
    descricao: fallbackDescricao,
  };
}

function normalizeEnvelope<T>(
  payload: unknown,
  status: number,
  fallbackDescricao: string,
): ApiEnvelope<T | null> {
  if (payload && typeof payload === "object") {
    const payloadObj = payload as Record<string, unknown>;

    return {
      message: normalizeMessage(payloadObj.message, status, fallbackDescricao),
      data: (payloadObj.data as T | undefined) ?? null,
    };
  }

  return {
    message: {
      codigo: status,
      descricao: fallbackDescricao,
    },
    data: null,
  };
}

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
