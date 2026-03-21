import { clearSessionToken, getSessionToken, } from "@/helpers/session-server-helper";
import { getApiBaseUrl } from "@/helpers/route-helpers";
import { isValidToken } from "@/helpers/token-helper";
import { NextResponse } from "next/server";

// Allowlist of top-level resources allowed to be proxied. Keep this list
// conservative — add only the upstream resources your app needs.
const ALLOWED_RESOURCES = new Set([
  "auth",
  "contas",
  "faturas",
  "cartoes",
  "contas-a-pagar",
  "contas-a-receber",
  "tags",
  "relatorios",
  "categorias",
  "usuarios",
  "notificacoes",
]);

async function proxy(request: Request, path: string[]) {
  const token = await getSessionToken();
  const tokenIsValid = isValidToken(token);

  if (!token || !tokenIsValid) {
    if (token && !tokenIsValid) {
      try {
        await clearSessionToken();
      } catch (err) {
        console.warn("Erro ao limpar a sessão:", err);
      }
    }

    return NextResponse.json({ message: "Não autenticado." }, { status: 401 });
  }

  const url = new URL(request.url);
  // validate requested path against allowlist
  const normalized = path.map((p) => String(p).toLowerCase());
  const base =
    normalized[0] === "v1" ? (normalized[1] ?? "") : (normalized[0] ?? "");

  if (!base || !ALLOWED_RESOURCES.has(base)) {
    return NextResponse.json(
      { message: "Recurso não permitido." },
      { status: 403 },
    );
  }
  const upstreamUrl = `${getApiBaseUrl()}/${path.join("/")}${url.search}`;

  const headers = new Headers(request.headers);
  headers.set("Authorization", `Bearer ${token}`);
  headers.delete("host");

  const method = request.method.toUpperCase();
  const hasBody = !["GET", "HEAD"].includes(method);

  const response = await fetch(upstreamUrl, {
    method,
    headers,
    body: hasBody ? request.body : undefined,
    duplex: hasBody ? "half" : undefined,
    cache: "no-store",
  } as RequestInit);
  console.log("Resposta do upstream:", response);
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const data = await response.json().catch(() => ({}));
    return NextResponse.json(data, { status: response.status });
  }

  const text = await response.text();
  return new NextResponse(text, {
    status: response.status,
    headers: {
      "content-type": contentType || "text/plain",
    },
  });
}

export async function GET(
  request: Request,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  return proxy(request, path);
}

export async function POST(
  request: Request,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  return proxy(request, path);
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  return proxy(request, path);
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  return proxy(request, path);
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  return proxy(request, path);
}
