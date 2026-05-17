import { getSessionToken } from "@/helpers/session-server-helper";
import { verificarAssinatura } from "@/helpers/token-helper";
import { NextResponse } from "next/server";

export async function GET() {
  const token = await getSessionToken();

  if (!token) {
    return NextResponse.json({ authenticated: false });
  }

  const verification = verificarAssinatura(token);

  if (!verification.valido) {
    return NextResponse.json({ authenticated: false });
  }

  return NextResponse.json({
    authenticated: true,
    user: verification.payload.user,
  });
}
