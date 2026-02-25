import { NextResponse } from "next/dist/server/web/spec-extension/response";
import { getApiBaseUrl } from "@/helpers/constants";
import { RecuperarSenhaBody } from "@/types/auth";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RecuperarSenhaBody;

    const response = await fetch(`${getApiBaseUrl()}/v1/auth/recuperar-senha`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept-Language": "pt-BR",
      },
      body: JSON.stringify({
        email: body.email,
      }),
      cache: "no-store",
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      return NextResponse.json(payload, { status: response.status });
    }

    return NextResponse.json(payload, { status: response.status });
  } catch {
    return NextResponse.json(
      {
        message: {
          codigo: 500,
          descricao: "Erro inesperado ao recuperar a senha.",
        },
        data: {
          fields: [],
        },
      },
      { status: 500 },
    );
  }
}
