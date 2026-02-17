import { getSessionToken } from "@/lib/auth/session";
import { NextResponse } from "next/server";

export async function GET() {
  const token = await getSessionToken();

  return NextResponse.json({
    authenticated: Boolean(token),
  });
}
