export type ApiRequestOptions = {
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

export function normalizeMessage(
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

export function normalizeEnvelope<T>(
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
