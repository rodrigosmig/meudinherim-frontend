import { CadastrarUsuarioBody, CadastrarUsuarioData } from "@/types/auth";
import { ApiFormErrorResponse, ApiResponse } from "@/types/api";
import { httpClient } from "@/services/api/axios-client";
import { NextResponse } from "next/server";
import { AxiosError } from "axios";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CadastrarUsuarioBody;
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
