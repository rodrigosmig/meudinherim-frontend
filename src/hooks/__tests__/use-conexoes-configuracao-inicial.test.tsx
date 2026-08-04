import { renderHook, waitFor } from "@testing-library/react";

import { Conexao } from "@/types/conexao";
import { StatusConexao } from "@/types/enum/status-conexao";

import { useConexoesConfiguracaoInicial } from "../use-conexoes-configuracao-inicial";

// ── mocks ──────────────────────────────────────────────────────────────────

const mockUseConfiguracaoInicial = jest.fn();
jest.mock("@/hooks/use-configuracao-inicial", () => ({
  useConfiguracaoInicial: () => mockUseConfiguracaoInicial(),
}));

// ── fixtures ────────────────────────────────────────────────────────────────

const conexaoAceita: Conexao = {
  uuid: "conn-1",
  usuarioConexao: { id: "user-1", nome: "João Silva", email: "joao@email.com" },
  status: StatusConexao.ACEITA,
  criadoEm: "2025-01-15T10:00:00",
  atualizadoEm: "2025-01-15T10:00:00",
};

const conexaoPendente: Conexao = {
  uuid: "conn-2",
  usuarioConexao: { id: "user-2", nome: "Maria Santos", email: "maria@email.com" },
  status: StatusConexao.PENDENTE,
  criadoEm: "2025-02-01T08:00:00",
  atualizadoEm: "2025-02-01T08:00:00",
};

const conexaoRecusada: Conexao = {
  uuid: "conn-3",
  usuarioConexao: { id: "user-3", nome: "Pedro Costa", email: "pedro@email.com" },
  status: StatusConexao.RECUSADA,
  criadoEm: "2025-01-20T09:00:00",
  atualizadoEm: "2025-01-20T09:00:00",
};

// ── setup ──────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
});

// ── testes ─────────────────────────────────────────────────────────────────

describe("useConexoesConfiguracaoInicial", () => {
  it("deve expor todas as conexões da configuração inicial", async () => {
    mockUseConfiguracaoInicial.mockReturnValue({
      data: { conexoes: [conexaoAceita, conexaoPendente, conexaoRecusada] },
      isLoading: false,
      isFetching: false,
    });

    const { result } = renderHook(() => useConexoesConfiguracaoInicial());

    await waitFor(() => {
      expect(result.current.conexoes).toHaveLength(3);
    });
    expect(result.current.conexoes).toEqual([
      conexaoAceita,
      conexaoPendente,
      conexaoRecusada,
    ]);
  });

  it("deve expor apenas conexões ACEITAS em conexoesAtivas", async () => {
    mockUseConfiguracaoInicial.mockReturnValue({
      data: { conexoes: [conexaoAceita, conexaoPendente, conexaoRecusada] },
      isLoading: false,
      isFetching: false,
    });

    const { result } = renderHook(() => useConexoesConfiguracaoInicial());

    await waitFor(() => {
      expect(result.current.conexoesAtivas).toHaveLength(1);
    });
    expect(result.current.conexoesAtivas[0]).toEqual(conexaoAceita);
  });

  it("deve tratar campo conexoes ausente como lista vazia", async () => {
    mockUseConfiguracaoInicial.mockReturnValue({
      data: { contas: [], faturas: [], categorias: [], notificacoes: [], tags: [] },
      isLoading: false,
      isFetching: false,
    });

    const { result } = renderHook(() => useConexoesConfiguracaoInicial());

    await waitFor(() => {
      expect(result.current.conexoes).toEqual([]);
    });
    expect(result.current.conexoesAtivas).toEqual([]);
  });

  it("deve repassar isLoading e isFetching da configuração inicial", () => {
    mockUseConfiguracaoInicial.mockReturnValue({
      data: undefined,
      isLoading: true,
      isFetching: false,
    });

    const { result } = renderHook(() => useConexoesConfiguracaoInicial());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.isFetching).toBe(false);
    expect(result.current.conexoes).toEqual([]);
  });
});
