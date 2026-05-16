import { POST } from "../route";

jest.mock("@/helpers/route-helpers", () => ({
  getApiBaseUrl: () => "http://api.test",
  DEFAULT_ERROR_MESSAGE: "Ocorreu um erro inesperado",
}));

jest.mock("@/helpers/session-server-helper", () => ({
  setSessionToken: jest.fn(),
}));

jest.mock("@/helpers/token-helper", () => ({
  extractToken: jest.fn(),
  verificarAssinatura: jest.fn(),
}));

jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((data: unknown, init?: { status?: number }) => ({
      body: data,
      status: init?.status ?? 200,
    })),
  },
}));

import { extractToken, verificarAssinatura } from "@/helpers/token-helper";
import { setSessionToken } from "@/helpers/session-server-helper";
import { NextResponse } from "next/server";

const mockExtractToken = extractToken as jest.Mock;
const mockVerificarAssinatura = verificarAssinatura as jest.Mock;
const mockSetSessionToken = setSessionToken as jest.Mock;
const mockNextResponseJson = NextResponse.json as jest.Mock;

function makeRequest(body: object): Request {
  return { json: async () => body } as unknown as Request;
}

describe("POST /api/auth/login", () => {
  const mockFetch = jest.fn();

  beforeAll(() => {
    global.fetch = mockFetch;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("encaminha email, password e recaptchaToken ao backend", async () => {
    const jwtToken = "jwt.token.here";
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: { token: jwtToken } }),
    });
    mockExtractToken.mockReturnValue(jwtToken);
    mockVerificarAssinatura.mockReturnValue({
      valido: true,
      payload: { user: { id: "1", nome: "Teste", email: "teste@teste.com" } },
    });

    await POST(makeRequest({ email: "teste@teste.com", password: "senha123", recaptchaToken: "captcha-abc" }));

    expect(mockFetch).toHaveBeenCalledWith(
      "http://api.test/v1/auth/login",
      expect.objectContaining({
        body: JSON.stringify({
          email: "teste@teste.com",
          password: "senha123",
          recaptchaToken: "captcha-abc",
        }),
      }),
    );
  });

  it("retorna dados do usuário e salva o token em sessão quando backend responde com sucesso", async () => {
    const jwtToken = "jwt.token.here";
    const userData = { id: "1", nome: "Teste", email: "teste@teste.com" };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ data: { token: jwtToken } }),
    });
    mockExtractToken.mockReturnValue(jwtToken);
    mockVerificarAssinatura.mockReturnValue({ valido: true, payload: { user: userData } });

    await POST(makeRequest({ email: "teste@teste.com", password: "senha123", recaptchaToken: "captcha-abc" }));

    expect(mockSetSessionToken).toHaveBeenCalledWith(jwtToken);
    expect(mockNextResponseJson).toHaveBeenCalledWith(
      expect.objectContaining({ data: { user: userData } }),
      { status: 200 },
    );
  });

  it("repassa o erro do backend quando recaptchaToken está ausente ou inválido", async () => {
    const backendError = {
      message: { codigo: 422, descricao: "O campo recaptchaToken não deve estar em branco" },
      data: { fields: [{ field: "recaptchaToken", message: "não deve estar em branco" }] },
    };

    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 422,
      json: async () => backendError,
    });

    await POST(makeRequest({ email: "teste@teste.com", password: "senha123", recaptchaToken: "" }));

    expect(mockNextResponseJson).toHaveBeenCalledWith(backendError, { status: 422 });
    expect(mockSetSessionToken).not.toHaveBeenCalled();
  });

  it("retorna 401 quando a assinatura do token é inválida", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: { token: "bad-token" } }),
    });
    mockExtractToken.mockReturnValue("bad-token");
    mockVerificarAssinatura.mockReturnValue({ valido: false, erro: "assinatura inválida" });

    await POST(makeRequest({ email: "teste@teste.com", password: "senha123", recaptchaToken: "captcha-abc" }));

    expect(mockNextResponseJson).toHaveBeenCalledWith(expect.any(Object), { status: 401 });
    expect(mockSetSessionToken).not.toHaveBeenCalled();
  });

  it("retorna 401 quando o token não é encontrado no payload do backend", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: {} }),
    });
    mockExtractToken.mockReturnValue(null);

    await POST(makeRequest({ email: "teste@teste.com", password: "senha123", recaptchaToken: "captcha-abc" }));

    expect(mockNextResponseJson).toHaveBeenCalledWith(expect.any(Object), { status: 401 });
    expect(mockSetSessionToken).not.toHaveBeenCalled();
  });

  it("retorna 500 em caso de erro inesperado", async () => {
    mockFetch.mockRejectedValueOnce(new Error("network error"));

    await POST(makeRequest({ email: "teste@teste.com", password: "senha123", recaptchaToken: "captcha-abc" }));

    expect(mockNextResponseJson).toHaveBeenCalledWith(expect.any(Object), { status: 500 });
  });
});
