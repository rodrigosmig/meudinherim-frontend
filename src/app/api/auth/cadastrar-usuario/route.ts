import { httpClient } from "@/services/api/axios-client";
import { ApiFormErrorResponse, ApiResponse } from "@/types/api";
import { CadastrarUsuarioData, CadastrarUsuarioRequest } from "@/types/auth";
import { AxiosError } from "axios";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CadastrarUsuarioRequest;
    const response = await httpClient.post<ApiResponse<CadastrarUsuarioData>>(
      "/v1/auth/register",
      body,
    );
    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    const axiosError = error as AxiosError<ApiFormErrorResponse | ApiResponse>;
    const status = axiosError.response?.status || 500;
    const data = axiosError.response?.data || {
      message: {
        codigo: 500,
        descricao: "Erro inesperado ao cadastrar o usuário.",
      },
      data: { fields: [] },
    };
    return NextResponse.json(data, { status });
  }
}
