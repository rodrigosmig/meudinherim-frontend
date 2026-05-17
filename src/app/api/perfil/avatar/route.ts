import { getApiBaseUrl } from "@/helpers/route-helpers";
import { getSessionToken, setSessionToken } from "@/helpers/session-server-helper";
import { verificarAssinatura } from "@/helpers/token-helper";
import { AlterarImagemData } from "@/types/usuario";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const token = await getSessionToken();
    const verification = verificarAssinatura(token);

    if (!token || !verification.valido) {
      return NextResponse.json({ message: { codigo: -401, descricao: "Não autenticado." } }, { status: 401 });
    }

    const formData = await request.formData();

    const response = await fetch(`${getApiBaseUrl()}/v1/perfil/avatar`, {
      method: "POST",
      headers: {
        "Accept-Language": "pt-BR",
        Authorization: `Bearer ${token}`,
      },
      body: formData,
      cache: "no-store",
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      return NextResponse.json(payload, { status: response.status });
    }

    const urlAvatar = (payload?.data as AlterarImagemData)?.urlAvatar;
    if (urlAvatar) {
      const currentPayload = verification.payload;
      const { iat, ...rest } = currentPayload as typeof currentPayload & { iat?: number };
      const newTokenPayload = { ...rest, user: { ...rest.user, avatar: urlAvatar } };

      const secretKey = process.env.JWT_SECRET_KEY || "";
      const newToken = jwt.sign(newTokenPayload, Buffer.from(secretKey, "base64"), { algorithm: "HS256" });
      await setSessionToken(newToken);
    }

    return NextResponse.json(payload, { status: response.status });
  } catch {
    return NextResponse.json(
      { message: { codigo: -999, descricao: "Erro inesperado ao alterar imagem." } },
      { status: 500 },
    );
  }
}
