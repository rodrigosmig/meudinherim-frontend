import { setSessionToken } from "@/lib/auth/session";
import { getApiBaseUrl } from "@/lib/auth/constants";
import { NextResponse } from "next/server";

interface LoginBody {
  email: string;
  password: string;
}

function extractToken(payload: unknown) {
  if (!payload || typeof payload !== "object") return "";

  const root = payload as Record<string, unknown>;
  const data =
    root.data && typeof root.data === "object"
      ? (root.data as Record<string, unknown>)
      : null;

  if (data && typeof data.token === "string") return data.token;

  if (typeof root.token === "string") return root.token;
  if (typeof root.accessToken === "string") return root.accessToken;
  if (typeof root.access_token === "string") return root.access_token;

  return "";
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

    const payload = await response.json().catch(() => ({}));
    console.log("Login response payload:", payload);
    if (!response.ok) {
      return NextResponse.json(payload, { status: response.status });
    }

    const token = extractToken(payload);

    if (!token) {
      return NextResponse.json(
        {
          message: {
            codigo: 502,
            descricao: "Token não retornado pela API de autenticação.",
          },
          data: null,
        },
        { status: 502 },
      );
    }

    await setSessionToken(token);

    return NextResponse.json(payload, { status: response.status });
  } catch {
    return NextResponse.json(
      {
        message: {
          codigo: 500,
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
