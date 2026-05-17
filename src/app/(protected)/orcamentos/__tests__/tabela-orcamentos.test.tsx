import React from "react";
import { render, screen, waitFor, within } from "@/helpers/test/test-helper";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toast } from "@/components/toast";
import type { Orcamento } from "@/types/orcamento";
import TabelaOrcamentos from "../tabela-orcamentos";

// ── mocks ──────────────────────────────────────────────────────────────────

jest.mock("@/components/toast", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

jest.mock("../orcamento-form", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock("@/services/orcamentos-service", () => ({
  orcamentoService: { deletar: jest.fn() },
}));

// ── helpers ────────────────────────────────────────────────────────────────

const { orcamentoService } = jest.requireMock("@/services/orcamentos-service");

const createWrapper = () => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
};

const orcamento1: Orcamento = {
  uuid: "orc-1",
  valor: 2000,
  categoria: { uuid: "cat-1", descricao: "Alimentação" },
};

const orcamento2: Orcamento = {
  uuid: "orc-2",
  valor: 500,
  categoria: { uuid: "cat-2", descricao: "Transporte" },
};

// ── setup ──────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
});

// ── testes ─────────────────────────────────────────────────────────────────

describe("TabelaOrcamentos", () => {
  describe("renderização", () => {
    it("deve renderizar as colunas do cabeçalho", () => {
      render(<TabelaOrcamentos orcamentos={[]} />, { wrapper: createWrapper() });

      expect(screen.getByText("Categoria")).toBeVisible();
      expect(screen.getByText("Valor")).toBeVisible();
      expect(screen.getByText("Ações")).toBeVisible();
    });

    it("deve renderizar os dados do orçamento", () => {
      render(<TabelaOrcamentos orcamentos={[orcamento1]} />, { wrapper: createWrapper() });

      expect(screen.getByText("Alimentação")).toBeVisible();
      expect(screen.getByText(/2\.000,00/)).toBeVisible();
    });

    it("deve renderizar múltiplos orçamentos", () => {
      render(<TabelaOrcamentos orcamentos={[orcamento1, orcamento2]} />, {
        wrapper: createWrapper(),
      });

      const [, ...rows] = screen.getAllByRole("row");
      expect(rows).toHaveLength(2);
    });

    it("deve renderizar 2 botões de ação por linha", () => {
      render(<TabelaOrcamentos orcamentos={[orcamento1]} />, { wrapper: createWrapper() });

      const [, row] = screen.getAllByRole("row");
      expect(within(row).getAllByRole("button")).toHaveLength(2);
    });
  });

  describe("modal de exclusão", () => {
    it("deve abrir modal ao clicar em excluir", async () => {
      const user = userEvent.setup();
      render(<TabelaOrcamentos orcamentos={[orcamento1]} />, { wrapper: createWrapper() });

      const [, row] = screen.getAllByRole("row");
      const [, deleteBtn] = within(row).getAllByRole("button");
      await user.click(deleteBtn);

      const dialog = screen.getByRole("dialog", { name: "Excluir Orçamento" });
      expect(dialog).toBeVisible();
      expect(
        within(dialog).getByText(/Tem certeza que deseja excluir o orçamento de "Alimentação"\?/),
      ).toBeVisible();
    });

    it("deve fechar modal ao clicar em Cancelar", async () => {
      const user = userEvent.setup();
      render(<TabelaOrcamentos orcamentos={[orcamento1]} />, { wrapper: createWrapper() });

      const [, row] = screen.getAllByRole("row");
      const [, deleteBtn] = within(row).getAllByRole("button");
      await user.click(deleteBtn);
      await user.click(screen.getByRole("button", { name: "Cancelar" }));

      expect(
        screen.queryByRole("dialog", { name: "Excluir Orçamento" }),
      ).not.toBeInTheDocument();
    });

    it("deve chamar deletar e exibir toast de sucesso ao confirmar", async () => {
      orcamentoService.deletar.mockResolvedValueOnce(undefined);
      const user = userEvent.setup();
      render(<TabelaOrcamentos orcamentos={[orcamento1]} />, { wrapper: createWrapper() });

      const [, row] = screen.getAllByRole("row");
      const [, deleteBtn] = within(row).getAllByRole("button");
      await user.click(deleteBtn);
      await user.click(screen.getByRole("button", { name: "Confirmar" }));

      await waitFor(() => {
        expect(orcamentoService.deletar).toHaveBeenCalledWith("orc-1");
        expect(toast.success).toHaveBeenCalledWith("Orçamento excluído com sucesso!");
      });
    });

    it("deve exibir toast de erro quando a exclusão falha", async () => {
      const { default: ApiError } = await import("@/types/application-error");
      orcamentoService.deletar.mockRejectedValueOnce(
        new ApiError({ codigo: "ERRO", descricao: "Erro ao excluir" }, 400),
      );
      const user = userEvent.setup();
      render(<TabelaOrcamentos orcamentos={[orcamento1]} />, { wrapper: createWrapper() });

      const [, row] = screen.getAllByRole("row");
      const [, deleteBtn] = within(row).getAllByRole("button");
      await user.click(deleteBtn);
      await user.click(screen.getByRole("button", { name: "Confirmar" }));

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Erro ao excluir");
      });
    });
  });
});
