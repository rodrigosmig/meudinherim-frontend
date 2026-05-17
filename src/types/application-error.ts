import { ApiMessage, ApiResponse } from "./api";

export default class ApiError extends Error {
  public status: number;
  public apiMessage: ApiMessage;
  public data?: unknown;

  constructor(apiMessage: ApiMessage, status = 500, data?: unknown) {
    super(apiMessage?.descricao ?? "Erro interno do servidor");
    this.name = "ApiError";
    this.status = status;
    this.apiMessage = apiMessage;
    this.data = data;
  }

  static fromResponse<T = unknown>(
    status: number,
    payload?: ApiResponse<T> | unknown,
  ) {
    // tenta normalizar payload que segue ApiResponse<T>
    const apiPayload = (payload as ApiResponse<T> | undefined) ?? undefined;
    const msg = apiPayload?.message ?? {
      codigo: -999,
      descricao: String(
        (payload as any)?.message ?? "Erro Interno do Servidor",
      ),
    };
    const data = apiPayload?.data;
    return new ApiError(msg, status, data);
  }
}
