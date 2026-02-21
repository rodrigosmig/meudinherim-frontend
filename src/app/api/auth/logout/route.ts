import { clearSessionToken } from "@/helpers/session";
import { NextResponse } from "next/server";

export async function POST() {
  await clearSessionToken();
  return NextResponse.json({ authenticated: false });
}
