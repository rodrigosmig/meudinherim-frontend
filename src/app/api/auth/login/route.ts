import { LoginBody, VerificationResult } from "@/types/auth";
import { TokenPayload } from "@/schema-validation/auth";
import { setSessionToken } from "@/helpers/session";
import { getApiBaseUrl } from "@/helpers/constants";
import { catalogoErros } from "@/helpers/erros";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export const runtime = "nodejs";

function extractToken(payload: unknown) {
  if (!payload || typeof payload !== "object") return "";

  const root = payload as Record<string, unknown>;
  const data =
    root.data && typeof root.data === "object"
      ? (root.data as Record<string, unknown>)
      : null;

  if (data && typeof data.token === "string") return data.token;

  if (typeof root.token === "string") return root.token;

  return "";
}

function verificarAssinatura(token: string): VerificationResult<TokenPayload> {
  const secretKey = process.env.JWT_SECRET_KEY || "";
  try {
    const decoded = jwt.verify(token, Buffer.from(secretKey, "base64"), {
      algorithms: ["HS256"],
    });
    return { valido: true, payload: decoded as TokenPayload };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { valido: false, erro: message };
  }
}

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
      { token, user: validacaoToken.payload.user },
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
