import { clearSessionToken } from "@/lib/auth/session";
import { NextResponse } from "next/server";

export async function POST() {
  await clearSessionToken();
  return NextResponse.json({ authenticated: false });
}
