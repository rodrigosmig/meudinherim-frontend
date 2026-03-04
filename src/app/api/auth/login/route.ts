import { extractToken, verificarAssinatura } from "@/helpers/token-helper";
import { setSessionToken } from "@/helpers/session-server-helper";
import { getApiBaseUrl } from "@/helpers/route-helpers";
import { catalogoErros } from "@/helpers/erros-helper";
import { NextResponse } from "next/server";
import { LoginBody } from "@/types/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LoginBody;

    const response = await fetch(`${getApiBaseUrl()}/v1/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept-Language": "pt-BR",
      },
      body: JSON.stringify({
        email: body.email,
        password: body.password,
      }),
      cache: "no-store",
    });

    const payload = await response.json();

    if (!response.ok) {
      return NextResponse.json(payload, { status: response.status });
    }

    const token = extractToken(payload);

    if (!token) {
      return NextResponse.json(
        {
          message: {
            codigo: catalogoErros.ERRO_AO_AUTENTICAR_USUARIO,
            descricao: "Erro ao autenticar usuário.",
          },
          data: null,
        },
        { status: 401 },
      );
    }

    const validacaoToken = verificarAssinatura(token);

    if (!validacaoToken.valido) {
      return NextResponse.json(
        {
          message: {
            codigo: catalogoErros.ERRO_AO_AUTENTICAR_USUARIO,
            descricao: "Erro ao autenticar usuário.",
          },
        },
        { status: 401 },
      );
    }

    await setSessionToken(token);

    return NextResponse.json(
      {
        message: {
          codigo: 0,
          descricao: "Sucesso.",
        },
        data: { user: validacaoToken.payload.user },
      },
      { status: response.status },
    );
  } catch {
    return NextResponse.json(
      {
        message: {
          codigo: -999,
          descricao: "Erro inesperado ao autenticar usuário.",
        },
        data: {
          fields: [],
        },
      },
      { status: 500 },
    );
  }
}
