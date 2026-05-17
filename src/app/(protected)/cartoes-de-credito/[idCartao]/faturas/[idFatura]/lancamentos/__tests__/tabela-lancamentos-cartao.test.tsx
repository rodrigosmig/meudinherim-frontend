import React from "react";
import { render, screen, waitFor, within } from "@/helpers/test/test-helper";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toast } from "@/components/toast";
import type { LancamentoCartao } from "@/types/lancamento-cartao";
import { TipoCategoria } from "@/types/enum/tipo-categoria";
import { StatusParcela } from "@/types/enum/status-parcela";
import TabelaLancamentosCartao from "../tabela-lancamentos-cartao";

// ── mocks ──────────────────────────────────────────────────────────────────

jest.mock("@/components/toast", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

jest.mock("../lancamento-cartao-form", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock("@/components/tags-popover", () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock("next/navigation", () => ({
  useParams: () => ({ idCartao: "cartao-1", idFatura: "fatura-1" }),
}));

jest.mock("@/services/lancamento-cartao-service", () => ({
  lancamentoCartaoService: { deletar: jest.fn(), antecipar: jest.fn() },
}));

// ── helpers ────────────────────────────────────────────────────────────────

const { lancamentoCartaoService } = jest.requireMock("@/services/lancamento-cartao-service");

const createWrapper = () => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
};

const lancamentoSimples: LancamentoCartao = {
  uuid: "lanc-1",
  data: "2026-05-01",
  descricao: "Supermercado",
  valor: 350,
  categoria: { uuid: "cat-1", descricao: "Alimentação", tipo: TipoCategoria.SAIDA },
  isParcelado: false,
  parcelas: [],
  idFatura: "fatura-1",
  tags: [],
};

const parcelaAberta1 = {
  data: "2026-05-01",
  descricao: "Notebook 1/3",
  numeroDaParcela: 1,
  totalDeParcelas: 3,
  valorDaParcela: 1000,
  valorLancamento: 3000,
  idParcela: "parc-1",
  idLancamento: "lanc-parc",
  idContaAgendada: null,
  idFatura: "fatura-1",
  status: StatusParcela.ABERTO,
};

const parcelaAberta2 = { ...parcelaAberta1, numeroDaParcela: 2, idParcela: "parc-2" };
const parcelaAberta3 = { ...parcelaAberta1, numeroDaParcela: 3, idParcela: "parc-3" };

const lancamentoParcelado1aParcela: LancamentoCartao = {
  uuid: "parc-1",
  data: "2026-05-01",
  descricao: "Notebook 1/3",
  valor: 1000,
  categoria: { uuid: "cat-2", descricao: "Tecnologia", tipo: TipoCategoria.SAIDA },
  isParcelado: true,
  parcelas: [parcelaAberta1, parcelaAberta2, parcelaAberta3],
  idFatura: "fatura-1",
  tags: [],
};

const lancamentoParcelado2aParcela: LancamentoCartao = {
  ...lancamentoParcelado1aParcela,
  uuid: "parc-2",
  descricao: "Notebook 2/3",
};

// ── setup ──────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
});

// ── testes ─────────────────────────────────────────────────────────────────

describe("TabelaLancamentosCartao", () => {
  describe("renderização", () => {
    it("deve renderizar as colunas do cabeçalho", () => {
      render(<TabelaLancamentosCartao lancamentos={[]} />, { wrapper: createWrapper() });

      expect(screen.getByText("Data")).toBeVisible();
      expect(screen.getByText("Categoria")).toBeVisible();
      expect(screen.getByText("Descrição")).toBeVisible();
      expect(screen.getByText("Valor")).toBeVisible();
      expect(screen.getByText("Ações")).toBeVisible();
    });

    it("deve renderizar dados do lançamento", () => {
      render(<TabelaLancamentosCartao lancamentos={[lancamentoSimples]} />, {
        wrapper: createWrapper(),
      });

      expect(screen.getByText("Supermercado")).toBeVisible();
      expect(screen.getByText("Alimentação")).toBeVisible();
      expect(screen.getByText(/350,00/)).toBeVisible();
    });

    it("deve aplicar text-negative para categoria de saída", () => {
      render(<TabelaLancamentosCartao lancamentos={[lancamentoSimples]} />, {
        wrapper: createWrapper(),
      });

      const valorCell = screen.getByText(/350,00/).closest("td");
      expect(valorCell).toHaveClass("text-negative");
    });

    it("deve renderizar múltiplos lançamentos", () => {
      render(
        <TabelaLancamentosCartao
          lancamentos={[lancamentoSimples, lancamentoParcelado1aParcela]}
        />,
        { wrapper: createWrapper() },
      );

      const [, ...rows] = screen.getAllByRole("row");
      expect(rows).toHaveLength(2);
    });
  });

  describe("estados dos botões de ação", () => {
    it("lançamento simples: editar habilitado, excluir habilitado, antecipar desabilitado", () => {
      render(<TabelaLancamentosCartao lancamentos={[lancamentoSimples]} />, {
        wrapper: createWrapper(),
      });

      const [, row] = screen.getAllByRole("row");
      const [editBtn, deleteBtn, anteciparBtn] = within(row).getAllByRole("button");
      expect(editBtn).not.toBeDisabled();
      expect(deleteBtn).not.toBeDisabled();
      expect(anteciparBtn).toBeDisabled();
    });

    it("lançamento parcelado (1ª parcela): editar desabilitado, excluir habilitado, antecipar habilitado", () => {
      render(<TabelaLancamentosCartao lancamentos={[lancamentoParcelado1aParcela]} />, {
        wrapper: createWrapper(),
      });

      const [, row] = screen.getAllByRole("row");
      const [editBtn, deleteBtn, anteciparBtn] = within(row).getAllByRole("button");
      expect(editBtn).toBeDisabled();
      expect(deleteBtn).not.toBeDisabled();
      expect(anteciparBtn).not.toBeDisabled();
    });

    it("lançamento parcelado (2ª+ parcela): editar desabilitado, excluir desabilitado", () => {
      render(<TabelaLancamentosCartao lancamentos={[lancamentoParcelado2aParcela]} />, {
        wrapper: createWrapper(),
      });

      const [, row] = screen.getAllByRole("row");
      const [editBtn, deleteBtn] = within(row).getAllByRole("button");
      expect(editBtn).toBeDisabled();
      expect(deleteBtn).toBeDisabled();
    });
  });

  describe("modal de exclusão", () => {
    it("deve abrir modal ao clicar em excluir lançamento simples", async () => {
      const user = userEvent.setup();
      render(<TabelaLancamentosCartao lancamentos={[lancamentoSimples]} />, {
        wrapper: createWrapper(),
      });

      const [, row] = screen.getAllByRole("row");
      const [, deleteBtn] = within(row).getAllByRole("button");
      await user.click(deleteBtn);

      expect(screen.getByRole("dialog", { name: "Excluir Lançamento" })).toBeVisible();
    });

    it("deve fechar modal ao clicar em Cancelar", async () => {
      const user = userEvent.setup();
      render(<TabelaLancamentosCartao lancamentos={[lancamentoSimples]} />, {
        wrapper: createWrapper(),
      });

      const [, row] = screen.getAllByRole("row");
      const [, deleteBtn] = within(row).getAllByRole("button");
      await user.click(deleteBtn);
      await user.click(screen.getByRole("button", { name: "Cancelar" }));

      expect(
        screen.queryByRole("dialog", { name: "Excluir Lançamento" }),
      ).not.toBeInTheDocument();
    });

    it("deve chamar deletar e exibir toast de sucesso ao confirmar", async () => {
      lancamentoCartaoService.deletar.mockResolvedValueOnce(undefined);
      const user = userEvent.setup();
      render(<TabelaLancamentosCartao lancamentos={[lancamentoSimples]} />, {
        wrapper: createWrapper(),
      });

      const [, row] = screen.getAllByRole("row");
      const [, deleteBtn] = within(row).getAllByRole("button");
      await user.click(deleteBtn);
      await user.click(screen.getByRole("button", { name: "Confirmar" }));

      await waitFor(() => {
        expect(lancamentoCartaoService.deletar).toHaveBeenCalledWith("lanc-1");
        expect(toast.success).toHaveBeenCalledWith("Lançamento excluído com sucesso!");
      });
    });
  });

  describe("modal de antecipar parcelas", () => {
    it("deve abrir modal ao clicar em antecipar", async () => {
      const user = userEvent.setup();
      render(<TabelaLancamentosCartao lancamentos={[lancamentoParcelado1aParcela]} />, {
        wrapper: createWrapper(),
      });

      const [, row] = screen.getAllByRole("row");
      const [, , anteciparBtn] = within(row).getAllByRole("button");
      await user.click(anteciparBtn);

      expect(screen.getByRole("dialog", { name: "Antecipar Parcelas" })).toBeVisible();
    });

    it("deve fechar modal ao clicar em Cancelar", async () => {
      const user = userEvent.setup();
      render(<TabelaLancamentosCartao lancamentos={[lancamentoParcelado1aParcela]} />, {
        wrapper: createWrapper(),
      });

      const [, row] = screen.getAllByRole("row");
      const [, , anteciparBtn] = within(row).getAllByRole("button");
      await user.click(anteciparBtn);
      await user.click(screen.getByRole("button", { name: "Cancelar" }));

      expect(
        screen.queryByRole("dialog", { name: "Antecipar Parcelas" }),
      ).not.toBeInTheDocument();
    });
  });
});
