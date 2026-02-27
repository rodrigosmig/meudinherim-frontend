import { ConfirmarUsuarioParam } from "@/types/auth";
import { apiClient } from "@/lib/axios-client";
import { NextResponse } from "next/server";
import { ApiResponse } from "@/types/api";
import { AxiosError } from "axios";

export async function POST(request: Request) {
  try {
    const param = (await request.json()) as ConfirmarUsuarioParam;
    const response = await apiClient.post<ApiResponse<void>>(
      "/v1/auth/confirmar-email",
      {},
      {
        params: param,
      },
    );
    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse>;
    const status = axiosError.response?.status || 500;
    const data = axiosError.response?.data || {
      message: {
        codigo: 500,
        descricao: "Erro inesperado ao confirmar o email.",
      },
      data: { fields: [] },
    };
    return NextResponse.json(data, { status });
  }
}
