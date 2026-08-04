import React from "react";
import { render, screen, waitFor } from "@/helpers/test/test-helper";
import userEvent from "@testing-library/user-event";
import { QueryClient } from "@tanstack/react-query";

import type { Conexao } from "@/types/conexao";
import { StatusConexao } from "@/types/enum/status-conexao";
import { toast } from "@/components/toast";
import ApiError from "@/types/application-error";
import { DEFAULT_ERROR_MESSAGE } from "@/helpers/route-helpers";

import SolicitacoesPendentesTab from "../solicitacoes-pendentes-tab";

// ── mocks ──────────────────────────────────────────────────────────────────

jest.mock("@/components/toast", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

const mockUseConexoesPendentes = jest.fn();
jest.mock("@/hooks/use-conexoes-pendentes", () => ({
  useConexoesPendentes: () => mockUseConexoesPendentes(),
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
    aceitar: jest.fn(),
    recusar: jest.fn(),
  },
}));

// ── helpers ────────────────────────────────────────────────────────────────

const { conexoesService } = jest.requireMock("@/services/conexoes-service");

const solicitacao: Conexao = {
  uuid: "pend-1",
  usuarioConexao: { id: "user-1", nome: "João Silva", email: "joao@email.com" },
  status: StatusConexao.PENDENTE,
  criadoEm: "2025-01-15T10:00:00",
  atualizadoEm: "2025-01-15T10:00:00",
};

const solicitacao2: Conexao = {
  uuid: "pend-2",
  usuarioConexao: { id: "user-2", nome: "Maria Santos", email: "maria@email.com" },
  status: StatusConexao.PENDENTE,
  criadoEm: "2025-02-01T08:00:00",
  atualizadoEm: "2025-02-01T08:00:00",
};

function mockQueryReturn(data: Conexao[], overrides: Record<string, unknown> = {}) {
  mockUseConexoesPendentes.mockReturnValue({
    data,
    isLoading: false,
    isError: false,
    refetch: jest.fn(),
    ...overrides,
  });
}

// ── setup ──────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
  mockQueryReturn([]);
});

// ── testes ─────────────────────────────────────────────────────────────────

describe("SolicitacoesPendentesTab", () => {
  describe("estado de carregamento", () => {
    it("deve exibir estado de carregamento", () => {
      mockQueryReturn([], { isLoading: true });

      render(<SolicitacoesPendentesTab />);

      expect(screen.getByTestId("query-list-loading")).toBeVisible();
    });
  });

  describe("estado de erro", () => {
    it("deve exibir estado de erro", () => {
      mockQueryReturn([], { isError: true });

      render(<SolicitacoesPendentesTab />);

      expect(screen.getByTestId("query-list-error")).toBeVisible();
    });

    it("deve chamar refetch ao clicar em tentar novamente", async () => {
      const user = userEvent.setup();
      const refetch = jest.fn();
      mockQueryReturn([], { isError: true, refetch });

      render(<SolicitacoesPendentesTab />);

      await user.click(screen.getByTestId("retry-button"));
      expect(refetch).toHaveBeenCalled();
    });
  });

  describe("estado vazio", () => {
    it("deve exibir mensagem de estado vazio", () => {
      mockQueryReturn([]);

      render(<SolicitacoesPendentesTab />);

      expect(screen.getByTestId("query-list-empty")).toBeVisible();
      expect(
        screen.getByText("Nenhuma solicitação pendente"),
      ).toBeVisible();
    });
  });

  describe("renderização de dados", () => {
    it("deve renderizar a lista de solicitações pendentes", () => {
      mockQueryReturn([solicitacao, solicitacao2]);

      render(<SolicitacoesPendentesTab />);

      expect(screen.getByTestId("query-list-content")).toBeVisible();
      expect(screen.getByText("João Silva")).toBeVisible();
      expect(screen.getByText("Maria Santos")).toBeVisible();
    });

    it("deve exibir email das solicitações", () => {
      mockQueryReturn([solicitacao]);

      render(<SolicitacoesPendentesTab />);

      expect(screen.getByText("joao@email.com")).toBeVisible();
    });

    it("deve exibir botões Aceitar e Recusar", () => {
      mockQueryReturn([solicitacao]);

      render(<SolicitacoesPendentesTab />);

      expect(screen.getByRole("button", { name: "Aceitar" })).toBeVisible();
      expect(screen.getByRole("button", { name: "Recusar" })).toBeVisible();
    });
  });

  describe("mutação aceitar", () => {
    it("deve chamar aceitar e exibir toast de sucesso ao clicar em Aceitar", async () => {
      conexoesService.aceitar.mockResolvedValueOnce(undefined);
      const user = userEvent.setup();
      mockQueryReturn([solicitacao]);

      render(<SolicitacoesPendentesTab />);

      await user.click(screen.getByRole("button", { name: "Aceitar" }));

      await waitFor(() => {
        expect(conexoesService.aceitar).toHaveBeenCalledWith("pend-1");
        expect(toast.success).toHaveBeenCalledWith("Conexão aceita!");
      });
    });

    it("deve exibir toast de erro quando aceitar falha com ApiError", async () => {
      const apiError = new ApiError({ codigo: 400, descricao: "Erro ao aceitar" }, 400);
      conexoesService.aceitar.mockRejectedValueOnce(apiError);
      const user = userEvent.setup();
      mockQueryReturn([solicitacao]);

      render(<SolicitacoesPendentesTab />);

      await user.click(screen.getByRole("button", { name: "Aceitar" }));

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Erro ao aceitar");
      });
    });

    it("deve exibir mensagem de erro padrão quando aceitar falha com erro genérico", async () => {
      conexoesService.aceitar.mockRejectedValueOnce(new Error("Erro genérico"));
      const user = userEvent.setup();
      mockQueryReturn([solicitacao]);

      render(<SolicitacoesPendentesTab />);

      await user.click(screen.getByRole("button", { name: "Aceitar" }));

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(DEFAULT_ERROR_MESSAGE);
      });
    });

    it("deve invalidar cache de conexões, pendentes e configuração inicial ao aceitar", async () => {
      conexoesService.aceitar.mockResolvedValueOnce(undefined);
      const invalidateSpy = jest.spyOn(QueryClient.prototype, "invalidateQueries");
      const user = userEvent.setup();
      mockQueryReturn([solicitacao]);

      render(<SolicitacoesPendentesTab />);

      await user.click(screen.getByRole("button", { name: "Aceitar" }));

      await waitFor(() => {
        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["conexoes"] });
        expect(invalidateSpy).toHaveBeenCalledWith({
          queryKey: ["conexoes_pendentes"],
        });
        expect(invalidateSpy).toHaveBeenCalledWith({
          queryKey: ["dados_configuracao"],
        });
      });
    });
  });

  describe("mutação recusar", () => {
    it("deve chamar recusar e exibir toast de sucesso ao clicar em Recusar", async () => {
      conexoesService.recusar.mockResolvedValueOnce(undefined);
      const user = userEvent.setup();
      mockQueryReturn([solicitacao]);

      render(<SolicitacoesPendentesTab />);

      await user.click(screen.getByRole("button", { name: "Recusar" }));

      await waitFor(() => {
        expect(conexoesService.recusar).toHaveBeenCalledWith("pend-1");
        expect(toast.success).toHaveBeenCalledWith("Solicitação recusada");
      });
    });

    it("deve exibir toast de erro quando recusar falha com ApiError", async () => {
      const apiError = new ApiError({ codigo: 400, descricao: "Erro ao recusar" }, 400);
      conexoesService.recusar.mockRejectedValueOnce(apiError);
      const user = userEvent.setup();
      mockQueryReturn([solicitacao]);

      render(<SolicitacoesPendentesTab />);

      await user.click(screen.getByRole("button", { name: "Recusar" }));

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Erro ao recusar");
      });
    });

    it("deve exibir mensagem de erro padrão quando recusar falha com erro genérico", async () => {
      conexoesService.recusar.mockRejectedValueOnce(new Error("Erro genérico"));
      const user = userEvent.setup();
      mockQueryReturn([solicitacao]);

      render(<SolicitacoesPendentesTab />);

      await user.click(screen.getByRole("button", { name: "Recusar" }));

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(DEFAULT_ERROR_MESSAGE);
      });
    });

    it("deve invalidar cache de conexões, pendentes e configuração inicial ao recusar", async () => {
      conexoesService.recusar.mockResolvedValueOnce(undefined);
      const invalidateSpy = jest.spyOn(QueryClient.prototype, "invalidateQueries");
      const user = userEvent.setup();
      mockQueryReturn([solicitacao]);

      render(<SolicitacoesPendentesTab />);

      await user.click(screen.getByRole("button", { name: "Recusar" }));

      await waitFor(() => {
        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["conexoes"] });
        expect(invalidateSpy).toHaveBeenCalledWith({
          queryKey: ["conexoes_pendentes"],
        });
        expect(invalidateSpy).toHaveBeenCalledWith({
          queryKey: ["dados_configuracao"],
        });
      });
    });
  });
});
