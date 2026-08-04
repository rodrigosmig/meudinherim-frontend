import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

import { Conexao } from "@/types/conexao";
import { StatusConexao } from "@/types/enum/status-conexao";

import { useConexoes } from "../use-conexoes";

// ── mocks ──────────────────────────────────────────────────────────────────

jest.mock("@/services/conexoes-service", () => ({
  conexoesService: { listar: jest.fn() },
}));

const { conexoesService } = jest.requireMock("@/services/conexoes-service");

// ── fixtures ────────────────────────────────────────────────────────────────

const conexao: Conexao = {
  uuid: "conn-1",
  usuarioConexao: { id: "user-1", nome: "João Silva", email: "joao@email.com" },
  status: StatusConexao.ACEITA,
  criadoEm: "2025-01-15T10:00:00",
  atualizadoEm: "2025-01-15T10:00:00",
};

const wrapper = ({ children }: { children: ReactNode }) => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};

// ── setup ──────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
});

// ── testes ─────────────────────────────────────────────────────────────────

describe("useConexoes", () => {
  it("deve retornar a lista de conexões desempacotada de data.conexoes", async () => {
    conexoesService.listar.mockResolvedValueOnce({
      message: { codigo: 0, descricao: "ok" },
      data: { conexoes: [conexao] },
    });

    const { result } = renderHook(() => useConexoes(), { wrapper });

    await waitFor(() => {
      expect(result.current.data).toEqual([conexao]);
    });
  });

  it("deve retornar lista vazia quando data.conexoes está ausente", async () => {
    conexoesService.listar.mockResolvedValueOnce({
      message: { codigo: 0, descricao: "ok" },
      data: undefined,
    });

    const { result } = renderHook(() => useConexoes(), { wrapper });

    await waitFor(() => {
      expect(result.current.data).toEqual([]);
    });
  });
});
