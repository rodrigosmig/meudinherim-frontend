import React from "react";
import { render, screen, waitFor, within } from "@/helpers/test/test-helper";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { toast } from "@/components/toast";
import { Cartao } from "@/types/cartao";
import { Status } from "@/types/enum/status";

import TabelaCartoes from "../tabela-cartoes";

// ── mocks ──────────────────────────────────────────────────────────────────

jest.mock("@/components/toast", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

jest.mock("@/app/(protected)/cartoes-de-credito/cartao-form", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock("@/services/cartoes-service", () => ({
  cartoesService: {
    ativar: jest.fn(),
    desativar: jest.fn(),
  },
}));

// ── helpers ────────────────────────────────────────────────────────────────

const { cartoesService } = jest.requireMock("@/services/cartoes-service");

const createWrapper = () => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
};

const cartaoAtivo: Cartao = {
  uuid: "cartao-1",
  nome: "Nubank",
  diaVencimento: 10,
  diaFechamento: 3,
  limiteCredito: 5000,
  saldo: 2500,
  status: Status.ATIVO,
};

const cartaoInativo: Cartao = {
  uuid: "cartao-2",
  nome: "Inter",
  diaVencimento: 15,
  diaFechamento: 8,
  limiteCredito: 3000,
  saldo: 0,
  status: Status.INATIVO,
};

// ── setup ──────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
});

// ── testes ─────────────────────────────────────────────────────────────────

describe("TabelaCartoes", () => {
  describe("renderização", () => {
    it("deve renderizar as colunas do cabeçalho", () => {
      render(<TabelaCartoes cartoes={[]} />, { wrapper: createWrapper() });
      expect(screen.getByText("Nome")).toBeVisible();
      expect(screen.getByText("Vencimento")).toBeVisible();
      expect(screen.getByText("Fechamento")).toBeVisible();
      expect(screen.getByText("Limite")).toBeVisible();
      expect(screen.getByText("Saldo")).toBeVisible();
      expect(screen.getByText("Ações")).toBeVisible();
    });

    it("deve renderizar os dados do cartão", () => {
      render(<TabelaCartoes cartoes={[cartaoAtivo]} />, { wrapper: createWrapper() });
      expect(screen.getByText("Nubank")).toBeVisible();
      expect(screen.getByText("Dia 10")).toBeVisible();
      expect(screen.getByText("Dia 3")).toBeVisible();
    });

    it("deve aplicar text-positive para saldo positivo", () => {
      render(<TabelaCartoes cartoes={[cartaoAtivo]} />, { wrapper: createWrapper() });
      const saldoCell = screen.getByText(/2\.500,00/).closest("td");
      expect(saldoCell).toHaveClass("text-positive");
    });

    it("deve renderizar múltiplos cartões", () => {
      render(<TabelaCartoes cartoes={[cartaoAtivo, cartaoInativo]} />, {
        wrapper: createWrapper(),
      });
      const [, ...rows] = screen.getAllByRole("row");
      expect(rows).toHaveLength(2);
    });

    it("deve renderizar 3 botões de ação por linha (editar, status e ver faturas)", () => {
      render(<TabelaCartoes cartoes={[cartaoAtivo]} />, { wrapper: createWrapper() });
      const [, row] = screen.getAllByRole("row");
      expect(within(row).getAllByRole("button")).toHaveLength(3);
    });
  });

  describe("modal de alteração de status", () => {
    it("deve abrir modal 'Desativar Cartão' para cartão ativo", async () => {
      const user = userEvent.setup();
      render(<TabelaCartoes cartoes={[cartaoAtivo]} />, { wrapper: createWrapper() });

      const [, row] = screen.getAllByRole("row");
      const [, statusBtn] = within(row).getAllByRole("button");
      await user.click(statusBtn);

      const dialog = screen.getByRole("dialog", { name: "Desativar Cartão" });
      expect(dialog).toBeVisible();
      expect(
        within(dialog).getByText(/Tem certeza que deseja desativar o cartão "Nubank"\?/),
      ).toBeVisible();
    });

    it("deve abrir modal 'Ativar Cartão' para cartão inativo", async () => {
      const user = userEvent.setup();
      render(<TabelaCartoes cartoes={[cartaoInativo]} />, { wrapper: createWrapper() });

      const [, row] = screen.getAllByRole("row");
      const [, statusBtn] = within(row).getAllByRole("button");
      await user.click(statusBtn);

      expect(screen.getByRole("dialog", { name: "Ativar Cartão" })).toBeVisible();
    });

    it("deve fechar o modal ao clicar em Cancelar", async () => {
      const user = userEvent.setup();
      render(<TabelaCartoes cartoes={[cartaoAtivo]} />, { wrapper: createWrapper() });

      const [, row] = screen.getAllByRole("row");
      const [, statusBtn] = within(row).getAllByRole("button");
      await user.click(statusBtn);
      await user.click(screen.getByRole("button", { name: "Cancelar" }));

      expect(
        screen.queryByRole("dialog", { name: "Desativar Cartão" }),
      ).not.toBeInTheDocument();
    });

    it("deve chamar desativar e exibir toast de sucesso para cartão ativo", async () => {
      cartoesService.desativar.mockResolvedValueOnce(undefined);
      const user = userEvent.setup();
      render(<TabelaCartoes cartoes={[cartaoAtivo]} />, { wrapper: createWrapper() });

      const [, row] = screen.getAllByRole("row");
      const [, statusBtn] = within(row).getAllByRole("button");
      await user.click(statusBtn);
      await user.click(screen.getByRole("button", { name: "Confirmar" }));

      await waitFor(() => {
        expect(cartoesService.desativar).toHaveBeenCalledWith("cartao-1");
        expect(toast.success).toHaveBeenCalledWith("Cartão desativado com sucesso!");
      });
    });

    it("deve chamar ativar e exibir toast de sucesso para cartão inativo", async () => {
      cartoesService.ativar.mockResolvedValueOnce(undefined);
      const user = userEvent.setup();
      render(<TabelaCartoes cartoes={[cartaoInativo]} />, { wrapper: createWrapper() });

      const [, row] = screen.getAllByRole("row");
      const [, statusBtn] = within(row).getAllByRole("button");
      await user.click(statusBtn);
      await user.click(screen.getByRole("button", { name: "Confirmar" }));

      await waitFor(() => {
        expect(cartoesService.ativar).toHaveBeenCalledWith("cartao-2");
        expect(toast.success).toHaveBeenCalledWith("Cartão ativado com sucesso!");
      });
    });
  });
});
