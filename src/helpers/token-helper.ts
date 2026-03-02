import { TokenPayload } from "@/schema-validation/auth";
import { VerificationResult } from "@/types/auth";
import jwt from "jsonwebtoken";

export function extractToken(payload: unknown) {
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

export function verificarAssinatura(
  token: string,
): VerificationResult<TokenPayload> {
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

export function isValidToken(token: string): boolean {
  return verificarAssinatura(token).valido;
}
