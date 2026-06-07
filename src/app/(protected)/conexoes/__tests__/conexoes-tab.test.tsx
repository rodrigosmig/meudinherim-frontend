import React from "react";
import { render, screen, waitFor, within } from "@/helpers/test/test-helper";
import userEvent from "@testing-library/user-event";

import type { Conexao } from "@/types/conexao";
import { StatusConexao } from "@/types/enum/status-conexao";
import { toast } from "@/components/toast";
import ApiError from "@/types/application-error";
import { DEFAULT_ERROR_MESSAGE } from "@/helpers/route-helpers";

import ConexoesTab from "../conexoes-tab";

// ── mocks ──────────────────────────────────────────────────────────────────

jest.mock("@/components/toast", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

const mockUseConexoes = jest.fn();
jest.mock("@/hooks/use-conexoes", () => ({
  useConexoes: () => mockUseConexoes(),
}));

jest.mock("@/components/primitives/query-list-state", () => ({
  __esModule: true,
  default: ({
    isLoading,
    isError,
    isEmpty,
    emptyMessage,
    onRetry,
    children,
  }: {
    isLoading: boolean;
    isError: boolean;
    isEmpty: boolean;
    emptyMessage: string;
    onRetry?: () => void;
    children: React.ReactNode;
  }) => {
    if (isLoading) return <div data-testid="query-list-loading">Carregando...</div>;
    if (isError) return (
      <div data-testid="query-list-error">
        Erro
        {onRetry && <button onClick={onRetry} data-testid="retry-button">Tentar novamente</button>}
      </div>
    );
    if (isEmpty) return <div data-testid="query-list-empty">{emptyMessage}</div>;
    return <div data-testid="query-list-content">{children}</div>;
  },
}));

jest.mock("@/services/conexoes-service", () => ({
  conexoesService: {
    remover: jest.fn(),
  },
}));

// ── helpers ────────────────────────────────────────────────────────────────

const { conexoesService } = jest.requireMock("@/services/conexoes-service");

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

const conexaoRemovida: Conexao = {
  uuid: "conn-4",
  usuarioConexao: { id: "user-4", nome: "Ana Lima", email: "ana@email.com" },
  status: StatusConexao.REMOVIDA,
  criadoEm: "2025-01-10T07:00:00",
  atualizadoEm: "2025-01-10T07:00:00",
};

function mockQueryReturn(data: Conexao[], overrides: Record<string, unknown> = {}) {
  mockUseConexoes.mockReturnValue({
    data,
    isLoading: false,
    isError: false,
    refetch: jest.fn(),
    ...overrides,
  });
}

const mockOnBuscarContatos = jest.fn();

// ── setup ──────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
  mockQueryReturn([]);
});

// ── testes ─────────────────────────────────────────────────────────────────

describe("ConexoesTab", () => {
  describe("estado de carregamento", () => {
    it("deve exibir estado de carregamento", () => {
      mockQueryReturn([], { isLoading: true });

      render(<ConexoesTab onBuscarContatos={mockOnBuscarContatos} />);

      expect(screen.getByTestId("query-list-loading")).toBeVisible();
    });
  });

  describe("estado de erro", () => {
    it("deve exibir estado de erro", () => {
      mockQueryReturn([], { isError: true });

      render(<ConexoesTab onBuscarContatos={mockOnBuscarContatos} />);

      expect(screen.getByTestId("query-list-error")).toBeVisible();
    });

    it("deve chamar refetch ao clicar em tentar novamente", async () => {
      const user = userEvent.setup();
      const refetch = jest.fn();
      mockQueryReturn([], { isError: true, refetch });

      render(<ConexoesTab onBuscarContatos={mockOnBuscarContatos} />);

      await user.click(screen.getByTestId("retry-button"));
      expect(refetch).toHaveBeenCalled();
    });
  });

  describe("estado vazio", () => {
    it("deve exibir mensagem de estado vazio", () => {
      mockQueryReturn([]);

      render(<ConexoesTab onBuscarContatos={mockOnBuscarContatos} />);

      expect(screen.getByTestId("query-list-empty")).toBeVisible();
      expect(
        screen.getByText("Você ainda não tem conexões ativas."),
      ).toBeVisible();
    });
  });

  describe("renderização de dados", () => {
    it("deve renderizar o botão Buscar contatos", () => {
      mockQueryReturn([conexaoAceita]);

      render(<ConexoesTab onBuscarContatos={mockOnBuscarContatos} />);

      expect(screen.getByRole("button", { name: "Buscar contatos" })).toBeVisible();
    });

    it("deve chamar onBuscarContatos ao clicar no botão", async () => {
      const user = userEvent.setup();
      mockQueryReturn([conexaoAceita]);

      render(<ConexoesTab onBuscarContatos={mockOnBuscarContatos} />);

      await user.click(screen.getByRole("button", { name: "Buscar contatos" }));

      expect(mockOnBuscarContatos).toHaveBeenCalled();
    });

    it("deve renderizar conexões com status ACEITA e PENDENTE", () => {
      mockQueryReturn([conexaoAceita, conexaoPendente, conexaoRecusada, conexaoRemovida]);

      render(<ConexoesTab onBuscarContatos={mockOnBuscarContatos} />);

      // Deve filtrar apenas ACEITA e PENDENTE
      expect(screen.getByText("João Silva")).toBeVisible();
      expect(screen.getByText("Maria Santos")).toBeVisible();
      // RECUSADA e REMOVIDA não devem aparecer
      expect(screen.queryByText("Pedro Costa")).not.toBeInTheDocument();
      expect(screen.queryByText("Ana Lima")).not.toBeInTheDocument();
    });

    it("deve exibir email da conexão", () => {
      mockQueryReturn([conexaoAceita]);

      render(<ConexoesTab onBuscarContatos={mockOnBuscarContatos} />);

      expect(screen.getByText("joao@email.com")).toBeVisible();
    });

    it("deve exibir botão Remover para conexão aceita", () => {
      mockQueryReturn([conexaoAceita]);

      render(<ConexoesTab onBuscarContatos={mockOnBuscarContatos} />);

      expect(screen.getByRole("button", { name: "Remover" })).toBeVisible();
    });

    it("deve exibir badge 'Aguardando confirmação' para conexão pendente", () => {
      mockQueryReturn([conexaoPendente]);

      render(<ConexoesTab onBuscarContatos={mockOnBuscarContatos} />);

      expect(screen.getByText("Aguardando confirmação")).toBeVisible();
    });
  });

  describe("modal de remoção", () => {
    it("deve abrir modal de confirmação ao clicar em Remover", async () => {
      const user = userEvent.setup();
      mockQueryReturn([conexaoAceita]);

      render(<ConexoesTab onBuscarContatos={mockOnBuscarContatos} />);

      await user.click(screen.getByRole("button", { name: "Remover" }));

      expect(screen.getByRole("dialog", { name: "Remover Conexão" })).toBeVisible();
      expect(
        screen.getByText(/Tem certeza que deseja remover a conexão com João Silva\?/),
      ).toBeVisible();
    });

    it("deve fechar modal ao clicar em Cancelar", async () => {
      const user = userEvent.setup();
      mockQueryReturn([conexaoAceita]);

      render(<ConexoesTab onBuscarContatos={mockOnBuscarContatos} />);

      await user.click(screen.getByRole("button", { name: "Remover" }));

      const dialog = screen.getByRole("dialog", { name: "Remover Conexão" });
      await user.click(within(dialog).getByRole("button", { name: "Cancelar" }));

      await waitFor(() => {
        expect(
          screen.queryByRole("dialog", { name: "Remover Conexão" }),
        ).not.toBeInTheDocument();
      });
    });

    it("deve chamar remover e exibir toast de sucesso ao confirmar", async () => {
      conexoesService.remover.mockResolvedValueOnce(undefined);
      const user = userEvent.setup();
      mockQueryReturn([conexaoAceita]);

      render(<ConexoesTab onBuscarContatos={mockOnBuscarContatos} />);

      await user.click(screen.getByRole("button", { name: "Remover" }));
      await user.click(screen.getByRole("button", { name: "Confirmar" }));

      await waitFor(() => {
        expect(conexoesService.remover).toHaveBeenCalledWith("conn-1");
        expect(toast.success).toHaveBeenCalledWith("Conexão removida");
      });
    });

    it("deve exibir toast de erro quando a mutação falha com ApiError", async () => {
      const apiError = new ApiError({ codigo: 400, descricao: "Erro de validação" }, 400);
      conexoesService.remover.mockRejectedValueOnce(apiError);
      const user = userEvent.setup();
      mockQueryReturn([conexaoAceita]);

      render(<ConexoesTab onBuscarContatos={mockOnBuscarContatos} />);

      await user.click(screen.getByRole("button", { name: "Remover" }));
      await user.click(screen.getByRole("button", { name: "Confirmar" }));

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Erro de validação");
      });
    });

    it("deve exibir mensagem de erro padrão quando a mutação falha com erro genérico", async () => {
      conexoesService.remover.mockRejectedValueOnce(new Error("Erro genérico"));
      const user = userEvent.setup();
      mockQueryReturn([conexaoAceita]);

      render(<ConexoesTab onBuscarContatos={mockOnBuscarContatos} />);

      await user.click(screen.getByRole("button", { name: "Remover" }));
      await user.click(screen.getByRole("button", { name: "Confirmar" }));

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(DEFAULT_ERROR_MESSAGE);
      });
    });
  });
});
