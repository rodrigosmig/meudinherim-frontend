import React from "react";
import { render, screen, waitFor, within } from "@/helpers/test/test-helper";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { toast } from "@/components/toast";
import { Conta } from "@/types/contas";
import { Status } from "@/types/enum/status";
import { TipoConta } from "@/types/enum/tipo-conta";

import TabelaContas from "../tabela-contas";

// ── mocks ──────────────────────────────────────────────────────────────────

jest.mock("@/components/toast", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

jest.mock("../conta-form", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock("@/services/contas-service", () => ({
  contasService: {
    deletar: jest.fn(),
    ativar: jest.fn(),
    desativar: jest.fn(),
  },
}));

// ── helpers ────────────────────────────────────────────────────────────────

const { contasService } = jest.requireMock("@/services/contas-service");

const createWrapper = () => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
};

const contaAtiva: Conta = {
  uuid: "conta-1",
  nome: "Conta Principal",
  tipo: TipoConta.CONTA_CORRENTE,
  status: Status.ATIVO,
  icon: "",
  saldo: 2500,
};

const contaInativa: Conta = {
  uuid: "conta-2",
  nome: "Poupança Reserva",
  tipo: TipoConta.POUPANCA,
  status: Status.INATIVO,
  icon: "",
  saldo: -100,
};

// ── setup ──────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
});

// ── testes ─────────────────────────────────────────────────────────────────

describe("TabelaContas", () => {
  describe("renderização", () => {
    it("deve renderizar as colunas do cabeçalho", () => {
      render(<TabelaContas contas={[]} />, { wrapper: createWrapper() });

      expect(screen.getByText("Nome")).toBeVisible();
      expect(screen.getByText("Tipo")).toBeVisible();
      expect(screen.getByText("Saldo")).toBeVisible();
      expect(screen.getByText("Ações")).toBeVisible();
    });

    it("deve renderizar os dados da conta", () => {
      render(<TabelaContas contas={[contaAtiva]} />, { wrapper: createWrapper() });

      expect(screen.getByText("Conta Principal")).toBeVisible();
      expect(screen.getByText("Conta Corrente")).toBeVisible();
      expect(screen.getByText(/2\.500,00/)).toBeVisible();
    });

    it("deve aplicar text-positive para saldo positivo", () => {
      render(<TabelaContas contas={[contaAtiva]} />, { wrapper: createWrapper() });

      const saldoCell = screen.getByText(/2\.500,00/).closest("td");
      expect(saldoCell).toHaveClass("text-positive");
    });

    it("deve aplicar text-negative para saldo negativo", () => {
      render(<TabelaContas contas={[contaInativa]} />, { wrapper: createWrapper() });

      const saldoCell = screen.getByText(/100,00/).closest("td");
      expect(saldoCell).toHaveClass("text-negative");
    });

    it("deve renderizar tipo Poupança corretamente", () => {
      render(<TabelaContas contas={[contaInativa]} />, { wrapper: createWrapper() });

      expect(screen.getByText("Poupança")).toBeVisible();
    });

    it("deve renderizar múltiplas contas", () => {
      render(<TabelaContas contas={[contaAtiva, contaInativa]} />, {
        wrapper: createWrapper(),
      });

      const [, ...rows] = screen.getAllByRole("row");
      expect(rows).toHaveLength(2);
    });
  });

  describe("modal de exclusão", () => {
    it("deve abrir o modal de excluir ao clicar no botão Excluir", async () => {
      const user = userEvent.setup();
      render(<TabelaContas contas={[contaAtiva]} />, { wrapper: createWrapper() });

      const [, row] = screen.getAllByRole("row");
      const [, trash] = within(row).getAllByRole("button");
      await user.click(trash);

      const dialog = screen.getByRole("dialog", { name: "Excluir Conta" });
      expect(dialog).toBeVisible();
      expect(
        within(dialog).getByText(/Tem certeza que deseja excluir a conta "Conta Principal"\?/),
      ).toBeVisible();
    });

    it("deve fechar o modal ao clicar em Cancelar", async () => {
      const user = userEvent.setup();
      render(<TabelaContas contas={[contaAtiva]} />, { wrapper: createWrapper() });

      const [, row] = screen.getAllByRole("row");
      const [, trash] = within(row).getAllByRole("button");
      await user.click(trash);
      await user.click(screen.getByRole("button", { name: "Cancelar" }));

      expect(
        screen.queryByRole("dialog", { name: "Excluir Conta" }),
      ).not.toBeInTheDocument();
    });

    it("deve chamar deletar e exibir toast de sucesso ao confirmar", async () => {
      contasService.deletar.mockResolvedValueOnce(undefined);
      const user = userEvent.setup();
      render(<TabelaContas contas={[contaAtiva]} />, { wrapper: createWrapper() });

      const [, row] = screen.getAllByRole("row");
      const [, trash] = within(row).getAllByRole("button");
      await user.click(trash);
      await user.click(screen.getByRole("button", { name: "Confirmar" }));

      await waitFor(() => {
        expect(contasService.deletar).toHaveBeenCalledWith("conta-1");
        expect(toast.success).toHaveBeenCalledWith("Conta excluída com sucesso!");
      });
    });
  });

  describe("modal de alteração de status", () => {
    it("deve abrir modal 'Desativar Conta' para conta ativa", async () => {
      const user = userEvent.setup();
      render(<TabelaContas contas={[contaAtiva]} />, { wrapper: createWrapper() });

      const [, row] = screen.getAllByRole("row");
      const [, , statusBtn] = within(row).getAllByRole("button");
      await user.click(statusBtn);

      const dialog = screen.getByRole("dialog", { name: "Desativar Conta" });
      expect(dialog).toBeVisible();
      expect(
        within(dialog).getByText(/Tem certeza que deseja desativar a conta "Conta Principal"\?/),
      ).toBeVisible();
    });

    it("deve abrir modal 'Ativar Conta' para conta inativa", async () => {
      const user = userEvent.setup();
      render(<TabelaContas contas={[contaInativa]} />, { wrapper: createWrapper() });

      const [, row] = screen.getAllByRole("row");
      const [, , statusBtn] = within(row).getAllByRole("button");
      await user.click(statusBtn);

      const dialog = screen.getByRole("dialog", { name: "Ativar Conta" });
      expect(dialog).toBeVisible();
    });

    it("deve chamar desativar e exibir toast de sucesso para conta ativa", async () => {
      contasService.desativar.mockResolvedValueOnce(undefined);
      const user = userEvent.setup();
      render(<TabelaContas contas={[contaAtiva]} />, { wrapper: createWrapper() });

      const [, row] = screen.getAllByRole("row");
      const [, , statusBtn] = within(row).getAllByRole("button");
      await user.click(statusBtn);
      await user.click(screen.getByRole("button", { name: "Confirmar" }));

      await waitFor(() => {
        expect(contasService.desativar).toHaveBeenCalledWith("conta-1");
        expect(toast.success).toHaveBeenCalledWith("Conta desativada com sucesso!");
      });
    });

    it("deve chamar ativar e exibir toast de sucesso para conta inativa", async () => {
      contasService.ativar.mockResolvedValueOnce(undefined);
      const user = userEvent.setup();
      render(<TabelaContas contas={[contaInativa]} />, { wrapper: createWrapper() });

      const [, row] = screen.getAllByRole("row");
      const [, , statusBtn] = within(row).getAllByRole("button");
      await user.click(statusBtn);
      await user.click(screen.getByRole("button", { name: "Confirmar" }));

      await waitFor(() => {
        expect(contasService.ativar).toHaveBeenCalledWith("conta-2");
        expect(toast.success).toHaveBeenCalledWith("Conta ativada com sucesso!");
      });
    });
  });
});
