import React from "react";
import { render, screen, waitFor, within } from "@/helpers/test/test-helper";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toast } from "@/components/toast";
import type { ContaAgendada } from "@/types/conta-agendada";
import { Periodicidade } from "@/types/enum/periodicidade";
import { StatusContaAgendada } from "@/types/enum/status-conta-agendada";
import { TipoContaAgendada } from "@/types/enum/tipo-conta-agendada";
import TabelaContasAReceber from "../tabela-contas-a-receber";

// ── mocks ──────────────────────────────────────────────────────────────────

jest.mock("@/components/toast", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

jest.mock("../conta-a-receber-form", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock("../receber-conta-a-receber-form", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock("@/components/tags-popover", () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock("@/services/contas-a-receber-service", () => ({
  contasAReceberService: {
    deletar: jest.fn(),
    cancelarRecebimento: jest.fn(),
  },
}));

// ── helpers ────────────────────────────────────────────────────────────────

const { contasAReceberService } = jest.requireMock("@/services/contas-a-receber-service");

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
  uuid: "receber-1",
  descricao: "Freelance design",
  valor: 2500,
  idFatura: "",
  categoria: { uuid: "cat-1", descricao: "Renda Extra" },
  tipo: TipoContaAgendada.CONTA_A_RECEBER,
  periodicidade: Periodicidade.NENHUMA,
  status: StatusContaAgendada.ABERTO,
  parcelado: false,
  dadosParcela,
  tags: [],
};

const contaRecebida: ContaAgendada = {
  uuid: "receber-2",
  descricao: "Salário mensal",
  valor: 5000,
  idFatura: "",
  categoria: { uuid: "cat-2", descricao: "Salário" },
  tipo: TipoContaAgendada.CONTA_A_RECEBER,
  periodicidade: Periodicidade.MENSAL,
  status: StatusContaAgendada.PAGO,
  parcelado: false,
  dadosParcela,
  tags: [],
};

const contaParcelada2aParcela: ContaAgendada = {
  uuid: "receber-3",
  descricao: "Consultoria parcelada",
  valor: 6000,
  idFatura: "",
  categoria: { uuid: "cat-3", descricao: "Consultoria" },
  tipo: TipoContaAgendada.CONTA_A_RECEBER,
  periodicidade: Periodicidade.NENHUMA,
  status: StatusContaAgendada.ABERTO,
  parcelado: true,
  dadosParcela: { ...dadosParcela, numeroDaParcela: 2, totalDeParcelas: 3 },
  tags: [],
};

// ── setup ──────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
});

// ── testes ─────────────────────────────────────────────────────────────────

describe("TabelaContasAReceber", () => {
  describe("renderização", () => {
    it("deve renderizar as colunas do cabeçalho", () => {
      render(<TabelaContasAReceber contas={[]} />, { wrapper: createWrapper() });

      expect(screen.getByText("Vencimento")).toBeVisible();
      expect(screen.getByText("Categoria")).toBeVisible();
      expect(screen.getByText("Descrição")).toBeVisible();
      expect(screen.getByText("Valor")).toBeVisible();
      expect(screen.getByText("Status")).toBeVisible();
      expect(screen.getByText("Recorrência")).toBeVisible();
      expect(screen.getByText("Ações")).toBeVisible();
    });

    it("deve renderizar dados da conta", () => {
      render(<TabelaContasAReceber contas={[contaAberta]} />, { wrapper: createWrapper() });

      expect(screen.getByText("Freelance design")).toBeVisible();
      expect(screen.getByText("Renda Extra")).toBeVisible();
      expect(screen.getByText(/2\.500,00/)).toBeVisible();
    });

    it("deve exibir badge 'Aberto' para status ABERTO", () => {
      render(<TabelaContasAReceber contas={[contaAberta]} />, { wrapper: createWrapper() });
      expect(screen.getByText("Aberto")).toBeVisible();
    });

    it("deve exibir badge 'Recebido' para status PAGO", () => {
      render(<TabelaContasAReceber contas={[contaRecebida]} />, { wrapper: createWrapper() });
      expect(screen.getByText("Recebido")).toBeVisible();
    });

    it("deve exibir 'Parcelado' para conta parcelada", () => {
      render(<TabelaContasAReceber contas={[contaParcelada2aParcela]} />, {
        wrapper: createWrapper(),
      });
      expect(screen.getByText("Parcelado")).toBeVisible();
    });

    it("deve renderizar múltiplas contas", () => {
      render(<TabelaContasAReceber contas={[contaAberta, contaRecebida]} />, {
        wrapper: createWrapper(),
      });

      const [, ...rows] = screen.getAllByRole("row");
      expect(rows).toHaveLength(2);
    });
  });

  describe("botões de ação", () => {
    it("deve desabilitar editar e excluir para conta parcelada (2ª+ parcela)", () => {
      render(<TabelaContasAReceber contas={[contaParcelada2aParcela]} />, {
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
      render(<TabelaContasAReceber contas={[contaAberta]} />, { wrapper: createWrapper() });

      const [, row] = screen.getAllByRole("row");
      const [, deleteBtn] = within(row).getAllByRole("button");
      await user.click(deleteBtn);

      const dialog = screen.getByRole("dialog", { name: "Excluir Conta a Receber" });
      expect(dialog).toBeVisible();
    });

    it("deve fechar modal ao clicar em Cancelar", async () => {
      const user = userEvent.setup();
      render(<TabelaContasAReceber contas={[contaAberta]} />, { wrapper: createWrapper() });

      const [, row] = screen.getAllByRole("row");
      const [, deleteBtn] = within(row).getAllByRole("button");
      await user.click(deleteBtn);
      await user.click(screen.getByRole("button", { name: "Cancelar" }));

      expect(
        screen.queryByRole("dialog", { name: "Excluir Conta a Receber" }),
      ).not.toBeInTheDocument();
    });

    it("deve chamar deletar e exibir toast de sucesso ao confirmar", async () => {
      contasAReceberService.deletar.mockResolvedValueOnce(undefined);
      const user = userEvent.setup();
      render(<TabelaContasAReceber contas={[contaAberta]} />, { wrapper: createWrapper() });

      const [, row] = screen.getAllByRole("row");
      const [, deleteBtn] = within(row).getAllByRole("button");
      await user.click(deleteBtn);
      await user.click(screen.getByRole("button", { name: "Confirmar" }));

      await waitFor(() => {
        expect(contasAReceberService.deletar).toHaveBeenCalledWith("receber-1");
        expect(toast.success).toHaveBeenCalledWith("Conta a receber excluída com sucesso!");
      });
    });
  });

  describe("cancelamento de recebimento", () => {
    it("deve abrir modal de cancelamento para conta recebida", async () => {
      const user = userEvent.setup();
      render(<TabelaContasAReceber contas={[contaRecebida]} />, { wrapper: createWrapper() });

      const [, row] = screen.getAllByRole("row");
      const buttons = within(row).getAllByRole("button");
      await user.click(buttons[buttons.length - 1]);

      expect(screen.getByRole("dialog", { name: "Cancelar Recebimento" })).toBeVisible();
    });

    it("deve chamar cancelarRecebimento e exibir toast ao confirmar", async () => {
      contasAReceberService.cancelarRecebimento.mockResolvedValueOnce(undefined);
      const user = userEvent.setup();
      render(<TabelaContasAReceber contas={[contaRecebida]} />, { wrapper: createWrapper() });

      const [, row] = screen.getAllByRole("row");
      const buttons = within(row).getAllByRole("button");
      await user.click(buttons[buttons.length - 1]);
      await user.click(screen.getByRole("button", { name: "Confirmar" }));

      await waitFor(() => {
        expect(contasAReceberService.cancelarRecebimento).toHaveBeenCalled();
        expect(toast.success).toHaveBeenCalledWith("Recebimento cancelado com sucesso!");
      });
    });
  });
});
