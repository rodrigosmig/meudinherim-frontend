import React from "react";
import { render, screen, waitFor, within } from "@/helpers/test/test-helper";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toast } from "@/components/toast";
import type { ContaAgendada } from "@/types/conta-agendada";
import { Periodicidade } from "@/types/enum/periodicidade";
import { StatusContaAgendada } from "@/types/enum/status-conta-agendada";
import { TipoContaAgendada } from "@/types/enum/tipo-conta-agendada";
import TabelaContasAPagar from "../tabela-contas-a-pagar";

// ── mocks ──────────────────────────────────────────────────────────────────

jest.mock("@/components/toast", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

jest.mock("../conta-a-pagar-form", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock("../pagar-conta-a-pagar-form", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock("@/components/tags-popover", () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock("@/services/contas-a-pagar-service", () => ({
  contasAPagarService: {
    deletar: jest.fn(),
    cancelarPagamento: jest.fn(),
  },
}));

// ── helpers ────────────────────────────────────────────────────────────────

const { contasAPagarService } = jest.requireMock("@/services/contas-a-pagar-service");

const createWrapper = () => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
};

const dadosParcela = {
  idParcela: "",
  numeroDaParcela: 1,
  totalDeParcelas: 1,
  valorTotal: 0,
  idLancamento: "",
  pago: false,
};

const contaAberta: ContaAgendada = {
  uuid: "conta-1",
  descricao: "Aluguel mensal",
  valor: 1500,
  idFatura: "",
  categoria: { uuid: "cat-1", descricao: "Moradia" },
  tipo: TipoContaAgendada.CONTA_A_PAGAR,
  periodicidade: Periodicidade.MENSAL,
  status: StatusContaAgendada.ABERTO,
  parcelado: false,
  dadosParcela,
  tags: [],
};

const contaPaga: ContaAgendada = {
  uuid: "conta-2",
  descricao: "Internet fibra",
  valor: 150,
  idFatura: "",
  categoria: { uuid: "cat-2", descricao: "Serviços" },
  tipo: TipoContaAgendada.CONTA_A_PAGAR,
  periodicidade: Periodicidade.MENSAL,
  status: StatusContaAgendada.PAGO,
  parcelado: false,
  dadosParcela,
  tags: [],
};

const contaParcelada2aParcela: ContaAgendada = {
  uuid: "conta-3",
  descricao: "Notebook parcelado",
  valor: 3000,
  idFatura: "",
  categoria: { uuid: "cat-3", descricao: "Tecnologia" },
  tipo: TipoContaAgendada.CONTA_A_PAGAR,
  periodicidade: Periodicidade.NENHUMA,
  status: StatusContaAgendada.ABERTO,
  parcelado: true,
  dadosParcela: { ...dadosParcela, numeroDaParcela: 2, totalDeParcelas: 12 },
  tags: [],
};

// ── setup ──────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
});

// ── testes ─────────────────────────────────────────────────────────────────

describe("TabelaContasAPagar", () => {
  describe("renderização", () => {
    it("deve renderizar as colunas do cabeçalho", () => {
      render(<TabelaContasAPagar contas={[]} />, { wrapper: createWrapper() });

      expect(screen.getByText("Vencimento")).toBeVisible();
      expect(screen.getByText("Categoria")).toBeVisible();
      expect(screen.getByText("Descrição")).toBeVisible();
      expect(screen.getByText("Valor")).toBeVisible();
      expect(screen.getByText("Status")).toBeVisible();
      expect(screen.getByText("Recorrência")).toBeVisible();
      expect(screen.getByText("Ações")).toBeVisible();
    });

    it("deve renderizar dados da conta", () => {
      render(<TabelaContasAPagar contas={[contaAberta]} />, { wrapper: createWrapper() });

      expect(screen.getByText("Aluguel mensal")).toBeVisible();
      expect(screen.getByText("Moradia")).toBeVisible();
      expect(screen.getByText(/1\.500,00/)).toBeVisible();
    });

    it("deve exibir badge 'Aberto' para status ABERTO", () => {
      render(<TabelaContasAPagar contas={[contaAberta]} />, { wrapper: createWrapper() });
      expect(screen.getByText("Aberto")).toBeVisible();
    });

    it("deve exibir badge 'Pago' para status PAGO", () => {
      render(<TabelaContasAPagar contas={[contaPaga]} />, { wrapper: createWrapper() });
      expect(screen.getByText("Pago")).toBeVisible();
    });

    it("deve exibir recorrência 'Mensal'", () => {
      render(<TabelaContasAPagar contas={[contaAberta]} />, { wrapper: createWrapper() });
      expect(screen.getByText("Mensal")).toBeVisible();
    });

    it("deve exibir 'Parcelado' para conta parcelada", () => {
      render(<TabelaContasAPagar contas={[contaParcelada2aParcela]} />, {
        wrapper: createWrapper(),
      });
      expect(screen.getByText("Parcelado")).toBeVisible();
    });

    it("deve renderizar múltiplas contas", () => {
      render(<TabelaContasAPagar contas={[contaAberta, contaPaga]} />, {
        wrapper: createWrapper(),
      });

      const [, ...rows] = screen.getAllByRole("row");
      expect(rows).toHaveLength(2);
    });
  });

  describe("botões de ação", () => {
    it("deve renderizar 3 botões para conta em aberto (editar, excluir, pagar)", () => {
      render(<TabelaContasAPagar contas={[contaAberta]} />, { wrapper: createWrapper() });

      const [, row] = screen.getAllByRole("row");
      expect(within(row).getAllByRole("button")).toHaveLength(3);
    });

    it("deve renderizar 3 botões para conta paga (editar, excluir, cancelar)", () => {
      render(<TabelaContasAPagar contas={[contaPaga]} />, { wrapper: createWrapper() });

      const [, row] = screen.getAllByRole("row");
      expect(within(row).getAllByRole("button")).toHaveLength(3);
    });

    it("deve desabilitar editar e excluir para conta parcelada (2ª+ parcela)", () => {
      render(<TabelaContasAPagar contas={[contaParcelada2aParcela]} />, {
        wrapper: createWrapper(),
      });

      const [, row] = screen.getAllByRole("row");
      const [editBtn, deleteBtn] = within(row).getAllByRole("button");
      expect(editBtn).toBeDisabled();
      expect(deleteBtn).toBeDisabled();
    });
  });

  describe("modal de exclusão", () => {
    it("deve abrir modal de exclusão ao clicar em Excluir", async () => {
      const user = userEvent.setup();
      render(<TabelaContasAPagar contas={[contaAberta]} />, { wrapper: createWrapper() });

      const [, row] = screen.getAllByRole("row");
      const [, deleteBtn] = within(row).getAllByRole("button");
      await user.click(deleteBtn);

      const dialog = screen.getByRole("dialog", { name: "Excluir Conta a Pagar" });
      expect(dialog).toBeVisible();
      expect(
        within(dialog).getByText(/Tem certeza que deseja excluir "Aluguel mensal"\?/),
      ).toBeVisible();
    });

    it("deve fechar modal ao clicar em Cancelar", async () => {
      const user = userEvent.setup();
      render(<TabelaContasAPagar contas={[contaAberta]} />, { wrapper: createWrapper() });

      const [, row] = screen.getAllByRole("row");
      const [, deleteBtn] = within(row).getAllByRole("button");
      await user.click(deleteBtn);
      await user.click(screen.getByRole("button", { name: "Cancelar" }));

      expect(
        screen.queryByRole("dialog", { name: "Excluir Conta a Pagar" }),
      ).not.toBeInTheDocument();
    });

    it("deve chamar deletar e exibir toast de sucesso ao confirmar", async () => {
      contasAPagarService.deletar.mockResolvedValueOnce(undefined);
      const user = userEvent.setup();
      render(<TabelaContasAPagar contas={[contaAberta]} />, { wrapper: createWrapper() });

      const [, row] = screen.getAllByRole("row");
      const [, deleteBtn] = within(row).getAllByRole("button");
      await user.click(deleteBtn);
      await user.click(screen.getByRole("button", { name: "Confirmar" }));

      await waitFor(() => {
        expect(contasAPagarService.deletar).toHaveBeenCalledWith("conta-1");
        expect(toast.success).toHaveBeenCalledWith("Conta a pagar excluída com sucesso!");
      });
    });
  });

  describe("cancelamento de pagamento", () => {
    it("deve abrir modal de cancelamento para conta paga", async () => {
      const user = userEvent.setup();
      render(<TabelaContasAPagar contas={[contaPaga]} />, { wrapper: createWrapper() });

      const [, row] = screen.getAllByRole("row");
      const buttons = within(row).getAllByRole("button");
      await user.click(buttons[buttons.length - 1]);

      expect(screen.getByRole("dialog", { name: "Cancelar Pagamento" })).toBeVisible();
    });

    it("deve chamar cancelarPagamento e exibir toast ao confirmar", async () => {
      contasAPagarService.cancelarPagamento.mockResolvedValueOnce(undefined);
      const user = userEvent.setup();
      render(<TabelaContasAPagar contas={[contaPaga]} />, { wrapper: createWrapper() });

      const [, row] = screen.getAllByRole("row");
      const buttons = within(row).getAllByRole("button");
      await user.click(buttons[buttons.length - 1]);
      await user.click(screen.getByRole("button", { name: "Confirmar" }));

      await waitFor(() => {
        expect(contasAPagarService.cancelarPagamento).toHaveBeenCalled();
        expect(toast.success).toHaveBeenCalledWith("Pagamento cancelado com sucesso!");
      });
    });
  });
});
