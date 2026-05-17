import { render, screen, within, waitFor } from "@/helpers/test/test-helper";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

import { toast } from "@/components/toast";
import { toCurrency } from "@/helpers/string-helper";
import { TipoCategoria } from "@/types/enum/tipo-categoria";
import { TipoContaAgendada } from "@/types/enum/tipo-conta-agendada";
import { LancamentoConta } from "@/types/lancamento-conta";

import TabelaLancamentosConta from "../tabela-lancamentos-conta";

jest.mock("@/components/toast", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

jest.mock(
  "@/app/(protected)/contas-bancarias/[idConta]/lancamentos/lancamento-conta-form",
  () => ({
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  }),
);

jest.mock("@/services/lancamento-conta-service", () => ({
  lancamentoContaService: { deletar: jest.fn() },
}));

jest.mock("@/services/contas-a-pagar-service", () => ({
  contasAPagarService: { cancelarPagamento: jest.fn() },
}));

jest.mock("@/services/contas-a-receber-service", () => ({
  contasAReceberService: { cancelarRecebimento: jest.fn() },
}));

const { lancamentoContaService } = jest.requireMock(
  "@/services/lancamento-conta-service",
);
const { contasAPagarService } = jest.requireMock(
  "@/services/contas-a-pagar-service",
);
const { contasAReceberService } = jest.requireMock(
  "@/services/contas-a-receber-service",
);

const createWrapper = () => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
};

const lancamentoSimples: LancamentoConta = {
  uuid: "lanc-1",
  data: "2026-03-20",
  descricao: "Salario",
  valor: 3500,
  categoria: { uuid: "cat-1", descricao: "Receita", tipo: TipoCategoria.ENTRADA },
  conta: { uuid: "conta-1", descricao: "Conta Principal" },
  tags: [],
  parcela: null,
  contaAgendada: null,
};

const lancamentoSaida: LancamentoConta = {
  uuid: "lanc-2",
  data: "2026-03-21",
  descricao: "Supermercado",
  valor: 180.45,
  categoria: { uuid: "cat-2", descricao: "Alimentacao", tipo: TipoCategoria.SAIDA },
  conta: { uuid: "conta-1", descricao: "Conta Principal" },
  tags: [],
  parcela: null,
  contaAgendada: null,
};

const lancamentoContaAPagar: LancamentoConta = {
  uuid: "lanc-3",
  data: "2026-03-22",
  descricao: "Aluguel",
  valor: 1200,
  categoria: { uuid: "cat-3", descricao: "Moradia", tipo: TipoCategoria.SAIDA },
  conta: { uuid: "conta-1", descricao: "Conta Principal" },
  tags: [],
  parcela: null,
  contaAgendada: { uuid: "cta-pagar-1", tipo: TipoContaAgendada.CONTA_A_PAGAR },
};

const lancamentoParcelaAPagar: LancamentoConta = {
  uuid: "lanc-5",
  data: "2026-03-24",
  descricao: "Parcela Aluguel",
  valor: 400,
  categoria: { uuid: "cat-3", descricao: "Moradia", tipo: TipoCategoria.SAIDA },
  conta: { uuid: "conta-1", descricao: "Conta Principal" },
  tags: [],
  parcela: {
    idParcela: "parcela-abc",
    idContaAgendada: "cta-pagar-2",
    tipoContaAgendada: TipoContaAgendada.CONTA_A_PAGAR,
    numeroDaParcela: 2,
    totalDeParcelas: 6,
  },
  contaAgendada: null,
};

const lancamentoContaAReceber: LancamentoConta = {
  uuid: "lanc-4",
  data: "2026-03-23",
  descricao: "Freelance",
  valor: 800,
  categoria: { uuid: "cat-1", descricao: "Receita", tipo: TipoCategoria.ENTRADA },
  conta: { uuid: "conta-1", descricao: "Conta Principal" },
  tags: [],
  parcela: null,
  contaAgendada: { uuid: "cta-receber-1", tipo: TipoContaAgendada.CONTA_A_RECEBER },
};

const lancamentoParcelaAReceber: LancamentoConta = {
  uuid: "lanc-6",
  data: "2026-03-25",
  descricao: "Parcela Freelance",
  valor: 250,
  categoria: { uuid: "cat-1", descricao: "Receita", tipo: TipoCategoria.ENTRADA },
  conta: { uuid: "conta-1", descricao: "Conta Principal" },
  tags: [],
  parcela: {
    idParcela: "parcela-xyz",
    idContaAgendada: "cta-receber-2",
    tipoContaAgendada: TipoContaAgendada.CONTA_A_RECEBER,
    numeroDaParcela: 1,
    totalDeParcelas: 4,
  },
  contaAgendada: null,
};

const getByNormalizedText = (text: string) =>
  screen.getByText(
    (_, node) =>
      node?.textContent?.replace(/\s+/g, " ").trim() ===
      text.replace(/\s+/g, " ").trim(),
  );

describe("TabelaLancamentosConta", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("renderização", () => {
    it("deve renderizar colunas do cabeçalho", () => {
      render(<TabelaLancamentosConta lancamentos={[]} />, {
        wrapper: createWrapper(),
      });

      expect(screen.getByText("Data")).toBeVisible();
      expect(screen.getByText("Categoria")).toBeVisible();
      expect(screen.getByText("Descrição")).toBeVisible();
      expect(screen.getByText("Valor")).toBeVisible();
      expect(screen.getByText("Ações")).toBeVisible();
    });

    it("deve renderizar apenas o cabeçalho quando não houver lançamentos", () => {
      const { container } = render(
        <TabelaLancamentosConta lancamentos={[]} />,
        { wrapper: createWrapper() },
      );

      expect(container.querySelectorAll("tbody tr")).toHaveLength(0);
    });

    it("deve renderizar datas, categorias, descrições e valores formatados", () => {
      render(
        <TabelaLancamentosConta
          lancamentos={[lancamentoSimples, lancamentoSaida]}
        />,
        { wrapper: createWrapper() },
      );

      expect(screen.getByText("20/03/2026")).toBeVisible();
      expect(screen.getByText("21/03/2026")).toBeVisible();
      expect(screen.getByText("Receita")).toBeVisible();
      expect(screen.getByText("Alimentacao")).toBeVisible();
      expect(screen.getByText("Salario")).toBeVisible();
      expect(screen.getByText("Supermercado")).toBeVisible();
      expect(getByNormalizedText(toCurrency(3500))).toBeVisible();
      expect(getByNormalizedText(toCurrency(180.45))).toBeVisible();
    });

    it("deve aplicar text-positive para ENTRADA e text-negative para SAÍDA", () => {
      render(
        <TabelaLancamentosConta
          lancamentos={[lancamentoSimples, lancamentoSaida]}
        />,
        { wrapper: createWrapper() },
      );

      expect(getByNormalizedText(toCurrency(3500)).closest("td")).toHaveClass(
        "text-positive",
      );
      expect(getByNormalizedText(toCurrency(180.45)).closest("td")).toHaveClass(
        "text-negative",
      );
    });

    it("deve renderizar 3 botões de ação por linha", () => {
      render(
        <TabelaLancamentosConta
          lancamentos={[lancamentoSimples, lancamentoSaida]}
        />,
        { wrapper: createWrapper() },
      );

      const [, ...rows] = screen.getAllByRole("row");
      expect(rows).toHaveLength(2);

      rows.forEach((row) => {
        expect(within(row).getAllByRole("button")).toHaveLength(3);
      });
    });
  });

  describe("estado dos botões", () => {
    it("deve habilitar Editar, Excluir e desabilitar Cancelar para lançamentos simples", () => {
      render(<TabelaLancamentosConta lancamentos={[lancamentoSimples]} />, {
        wrapper: createWrapper(),
      });

      const [, row] = screen.getAllByRole("row");
      const [pencil, trash, banknote] = within(row).getAllByRole("button");

      expect(pencil).toBeEnabled();
      expect(trash).toBeEnabled();
      expect(banknote).toBeDisabled();
    });

    it("deve desabilitar Editar, Excluir e habilitar Cancelar para lançamentos de conta agendada", () => {
      render(
        <TabelaLancamentosConta lancamentos={[lancamentoContaAPagar]} />,
        { wrapper: createWrapper() },
      );

      const [, row] = screen.getAllByRole("row");
      const [pencil, trash, banknote] = within(row).getAllByRole("button");

      expect(pencil).toBeDisabled();
      expect(trash).toBeDisabled();
      expect(banknote).toBeEnabled();
    });
  });

  describe("modal de exclusão", () => {
    it("deve abrir o modal de excluir ao clicar no botão Excluir", async () => {
      const user = userEvent.setup();
      render(<TabelaLancamentosConta lancamentos={[lancamentoSimples]} />, {
        wrapper: createWrapper(),
      });

      const [, row] = screen.getAllByRole("row");
      const [, trash] = within(row).getAllByRole("button");
      await user.click(trash);

      const dialog = screen.getByRole("dialog", { name: "Excluir Lançamento" });
      expect(dialog).toBeVisible();
      expect(
        within(dialog).getByText("Tem certeza que deseja excluir este lançamento?"),
      ).toBeVisible();
      expect(within(dialog).getByText(/Salario/)).toBeVisible();
    });

    it("deve fechar o modal ao clicar em Cancelar", async () => {
      const user = userEvent.setup();
      render(<TabelaLancamentosConta lancamentos={[lancamentoSimples]} />, {
        wrapper: createWrapper(),
      });

      const [, row] = screen.getAllByRole("row");
      const [, trash] = within(row).getAllByRole("button");
      await user.click(trash);

      await user.click(screen.getByRole("button", { name: "Cancelar" }));

      expect(
        screen.queryByRole("dialog", { name: "Excluir Lançamento" }),
      ).not.toBeInTheDocument();
    });

    it("deve chamar o serviço de exclusão e exibir toast de sucesso ao confirmar", async () => {
      lancamentoContaService.deletar.mockResolvedValueOnce(undefined);
      const user = userEvent.setup();
      render(<TabelaLancamentosConta lancamentos={[lancamentoSimples]} />, {
        wrapper: createWrapper(),
      });

      const [, row] = screen.getAllByRole("row");
      const [, trash] = within(row).getAllByRole("button");
      await user.click(trash);
      await user.click(screen.getByRole("button", { name: "Confirmar" }));

      await waitFor(() => {
        expect(lancamentoContaService.deletar).toHaveBeenCalledWith("lanc-1");
        expect(toast.success).toHaveBeenCalledWith(
          "Lançamento excluído com sucesso!",
        );
      });
    });

    it("deve fechar o modal após excluir com sucesso", async () => {
      lancamentoContaService.deletar.mockResolvedValueOnce(undefined);
      const user = userEvent.setup();
      render(<TabelaLancamentosConta lancamentos={[lancamentoSimples]} />, {
        wrapper: createWrapper(),
      });

      const [, row] = screen.getAllByRole("row");
      const [, trash] = within(row).getAllByRole("button");
      await user.click(trash);
      await user.click(screen.getByRole("button", { name: "Confirmar" }));

      await waitFor(() => {
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      });
    });

    it("deve exibir toast de erro da API ao falhar exclusão", async () => {
      const ApiError = (await import("@/types/application-error")).default;
      lancamentoContaService.deletar.mockRejectedValueOnce(
        new ApiError({ codigo: 500, descricao: "Erro ao excluir" }, 500),
      );
      const user = userEvent.setup();
      render(<TabelaLancamentosConta lancamentos={[lancamentoSimples]} />, {
        wrapper: createWrapper(),
      });

      const [, row] = screen.getAllByRole("row");
      const [, trash] = within(row).getAllByRole("button");
      await user.click(trash);
      await user.click(screen.getByRole("button", { name: "Confirmar" }));

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Erro ao excluir");
      });
    });

    it("deve exibir toast de erro genérico ao falhar com erro inesperado", async () => {
      lancamentoContaService.deletar.mockRejectedValueOnce(new Error("network error"));
      const user = userEvent.setup();
      render(<TabelaLancamentosConta lancamentos={[lancamentoSimples]} />, {
        wrapper: createWrapper(),
      });

      const [, row] = screen.getAllByRole("row");
      const [, trash] = within(row).getAllByRole("button");
      await user.click(trash);
      await user.click(screen.getByRole("button", { name: "Confirmar" }));

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(expect.stringMatching(/.+/));
      });
    });
  });

  describe("modal de cancelamento — conta a pagar", () => {
    it("deve abrir modal com título 'Cancelar Pagamento' para conta a pagar", async () => {
      const user = userEvent.setup();
      render(
        <TabelaLancamentosConta lancamentos={[lancamentoContaAPagar]} />,
        { wrapper: createWrapper() },
      );

      const [, row] = screen.getAllByRole("row");
      const [, , banknote] = within(row).getAllByRole("button");
      await user.click(banknote);

      expect(
        screen.getByRole("dialog", { name: "Cancelar Pagamento" }),
      ).toBeVisible();
      expect(
        screen.getByText("Tem certeza que deseja cancelar este pagamento?"),
      ).toBeVisible();
    });

    it("deve chamar contasAPagarService e exibir toast ao confirmar cancelamento", async () => {
      contasAPagarService.cancelarPagamento.mockResolvedValueOnce(undefined);
      const user = userEvent.setup();
      render(
        <TabelaLancamentosConta lancamentos={[lancamentoContaAPagar]} />,
        { wrapper: createWrapper() },
      );

      const [, row] = screen.getAllByRole("row");
      const [, , banknote] = within(row).getAllByRole("button");
      await user.click(banknote);
      await user.click(screen.getByRole("button", { name: "Confirmar" }));

      await waitFor(() => {
        expect(contasAPagarService.cancelarPagamento).toHaveBeenCalledWith(
          "cta-pagar-1",
          "",
        );
        expect(toast.success).toHaveBeenCalledWith(
          "Pagamento cancelado com sucesso!",
        );
      });
    });

    it("deve chamar contasAPagarService com idContaAgendada e idParcela ao cancelar via parcela", async () => {
      contasAPagarService.cancelarPagamento.mockResolvedValueOnce(undefined);
      const user = userEvent.setup();
      render(
        <TabelaLancamentosConta lancamentos={[lancamentoParcelaAPagar]} />,
        { wrapper: createWrapper() },
      );

      const [, row] = screen.getAllByRole("row");
      const [, , banknote] = within(row).getAllByRole("button");
      await user.click(banknote);
      await user.click(screen.getByRole("button", { name: "Confirmar" }));

      await waitFor(() => {
        expect(contasAPagarService.cancelarPagamento).toHaveBeenCalledWith(
          "cta-pagar-2",
          "parcela-abc",
        );
      });
    });

    it("deve exibir toast de erro da API ao falhar cancelamento de pagamento", async () => {
      const ApiError = (await import("@/types/application-error")).default;
      contasAPagarService.cancelarPagamento.mockRejectedValueOnce(
        new ApiError({ codigo: 500, descricao: "Erro ao cancelar pagamento" }, 500),
      );
      const user = userEvent.setup();
      render(
        <TabelaLancamentosConta lancamentos={[lancamentoContaAPagar]} />,
        { wrapper: createWrapper() },
      );

      const [, row] = screen.getAllByRole("row");
      const [, , banknote] = within(row).getAllByRole("button");
      await user.click(banknote);
      await user.click(screen.getByRole("button", { name: "Confirmar" }));

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Erro ao cancelar pagamento");
      });
    });
  });

  describe("modal de cancelamento — conta a receber", () => {
    it("deve abrir modal com título 'Cancelar Recebimento' para conta a receber", async () => {
      const user = userEvent.setup();
      render(
        <TabelaLancamentosConta lancamentos={[lancamentoContaAReceber]} />,
        { wrapper: createWrapper() },
      );

      const [, row] = screen.getAllByRole("row");
      const [, , banknote] = within(row).getAllByRole("button");
      await user.click(banknote);

      expect(
        screen.getByRole("dialog", { name: "Cancelar Recebimento" }),
      ).toBeVisible();
      expect(
        screen.getByText("Tem certeza que deseja cancelar este recebimento?"),
      ).toBeVisible();
    });

    it("deve chamar contasAReceberService e exibir toast ao confirmar cancelamento", async () => {
      contasAReceberService.cancelarRecebimento.mockResolvedValueOnce(undefined);
      const user = userEvent.setup();
      render(
        <TabelaLancamentosConta lancamentos={[lancamentoContaAReceber]} />,
        { wrapper: createWrapper() },
      );

      const [, row] = screen.getAllByRole("row");
      const [, , banknote] = within(row).getAllByRole("button");
      await user.click(banknote);
      await user.click(screen.getByRole("button", { name: "Confirmar" }));

      await waitFor(() => {
        expect(contasAReceberService.cancelarRecebimento).toHaveBeenCalledWith(
          "cta-receber-1",
          "",
        );
        expect(toast.success).toHaveBeenCalledWith(
          "Recebimento cancelado com sucesso!",
        );
      });
    });

    it("deve chamar contasAReceberService com idContaAgendada e idParcela ao cancelar via parcela", async () => {
      contasAReceberService.cancelarRecebimento.mockResolvedValueOnce(undefined);
      const user = userEvent.setup();
      render(
        <TabelaLancamentosConta lancamentos={[lancamentoParcelaAReceber]} />,
        { wrapper: createWrapper() },
      );

      const [, row] = screen.getAllByRole("row");
      const [, , banknote] = within(row).getAllByRole("button");
      await user.click(banknote);
      await user.click(screen.getByRole("button", { name: "Confirmar" }));

      await waitFor(() => {
        expect(contasAReceberService.cancelarRecebimento).toHaveBeenCalledWith(
          "cta-receber-2",
          "parcela-xyz",
        );
      });
    });

    it("deve exibir toast de erro da API ao falhar cancelamento de recebimento", async () => {
      const ApiError = (await import("@/types/application-error")).default;
      contasAReceberService.cancelarRecebimento.mockRejectedValueOnce(
        new ApiError({ codigo: 500, descricao: "Erro ao cancelar recebimento" }, 500),
      );
      const user = userEvent.setup();
      render(
        <TabelaLancamentosConta lancamentos={[lancamentoContaAReceber]} />,
        { wrapper: createWrapper() },
      );

      const [, row] = screen.getAllByRole("row");
      const [, , banknote] = within(row).getAllByRole("button");
      await user.click(banknote);
      await user.click(screen.getByRole("button", { name: "Confirmar" }));

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Erro ao cancelar recebimento");
      });
    });
  });
});
