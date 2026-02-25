import { CadastrarUsuarioBody } from "@/types/auth";
import { ApiResponse, ApiFormErrorResponse } from "@/types/api";
import { NextResponse } from "next/server";
import { api } from "@/lib/axios-client";
import { AxiosError } from "axios";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CadastrarUsuarioBody;
    const response = await api.post<ApiResponse<{ idUsuario: string }>>(
      "/v1/auth/register",
      body
    );
    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    const axiosError = error as AxiosError<ApiFormErrorResponse | ApiResponse>;
    const status = axiosError.response?.status || 500;
    const data = axiosError.response?.data || {
      message: { codigo: 500, descricao: "Erro inesperado ao cadastrar o usuário." },
      data: { fields: [] }
    };
    return NextResponse.json(data, { status });
  }
}
