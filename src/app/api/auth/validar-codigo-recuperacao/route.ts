import { httpClient } from "@/services/api/axios-client";
import { ApiFormErrorResponse, ApiResponse } from "@/types/api";
import { ValidarCodigoRecuperacaoData, ValidarCodigoRecuperacaoRequest } from "@/types/auth";
import { AxiosError } from "axios";
import { NextResponse } from "next/dist/server/web/spec-extension/response";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ValidarCodigoRecuperacaoRequest;
    const response = await httpClient.post<ApiResponse<ValidarCodigoRecuperacaoData>>(
      "/v1/auth/validar-codigo-recuperacao",
      body,
    );
    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    const axiosError = error as AxiosError<ApiFormErrorResponse | ApiResponse<ValidarCodigoRecuperacaoData>>;
    const status = axiosError.response?.status || 500;
    const data = axiosError.response?.data || {
      message: {
        codigo: 500,
        descricao: "Erro inesperado ao validar o código de recuperação.",
      },
      data: { fields: [] },
    };
    return NextResponse.json(data, { status });
  }
}
