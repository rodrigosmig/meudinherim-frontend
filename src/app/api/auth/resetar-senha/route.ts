import { NextResponse } from "next/dist/server/web/spec-extension/response";
import { ApiFormErrorResponse, ApiResponse } from "@/types/api";
import { httpClient } from "@/services/api/axios-client";
import { ResetarSenhaRequest as ResetarSenhaBody } from "@/types/auth";
import { AxiosError } from "axios";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ResetarSenhaBody;
    const response = await httpClient.post<ApiResponse<void>>(
      "/v1/auth/resetar-senha",
      body,
    );
    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    const axiosError = error as AxiosError<
      ApiFormErrorResponse | ApiResponse<void>
    >;
    const status = axiosError.response?.status || 500;
    const data = axiosError.response?.data || {
      message: {
        codigo: 500,
        descricao: "Erro inesperado ao resetar senha do usuário.",
      },
      data: { fields: [] },
    };
    return NextResponse.json(data, { status });
  }
}
