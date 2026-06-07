import React from "react";
import { render, screen, waitFor, within } from "@/helpers/test/test-helper";
import userEvent from "@testing-library/user-event";

import type { CobrancaEmitida } from "@/types/cobranca";
import { StatusCobranca } from "@/types/enum/status-cobranca";
import { toast } from "@/components/toast";
import ApiError from "@/types/application-error";
import { DEFAULT_ERROR_MESSAGE } from "@/helpers/route-helpers";

import CobrancasEmitidasTab from "../cobrancas-emitidas-tab";

// ── mocks ──────────────────────────────────────────────────────────────────

jest.mock("@/components/toast", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

const mockUseCobrancasEmitidas = jest.fn();
jest.mock("@/hooks/use-cobrancas-emitidas", () => ({
  useCobrancasEmitidas: () => mockUseCobrancasEmitidas(),
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

jest.mock("@/services/cobrancas-service", () => ({
  cobrancasService: {
    cancelar: jest.fn(),
  },
}));

// ── helpers ────────────────────────────────────────────────────────────────

const { cobrancasService } = jest.requireMock("@/services/cobrancas-service");

const cobrancaAberta: CobrancaEmitida = {
  uuid: "cob-1",
  devedor: { id: "user-1", nome: "João Silva", email: "joao@email.com" },
  descricao: "Pagamento de dívida",
  valor: 1500,
  status: StatusCobranca.ABERTO,
  criadoEm: "2025-01-15T10:30:00",
};

const cobrancaPaga: CobrancaEmitida = {
  uuid: "cob-2",
  devedor: { id: "user-2", nome: "Maria Santos", email: "maria@email.com" },
  descricao: "Assinatura mensal",
  valor: 350,
  status: StatusCobranca.PAGO,
  criadoEm: "2025-01-10T08:00:00",
  pagoEm: "2025-01-11T14:00:00",
};

const cobrancaCancelada: CobrancaEmitida = {
  uuid: "cob-3",
  devedor: { id: "user-3", nome: "Pedro Costa", email: "pedro@email.com" },
  descricao: "Serviço prestado",
  valor: 800,
  status: StatusCobranca.CANCELADA,
  criadoEm: "2025-01-05T09:00:00",
};

function mockQueryReturn(data: CobrancaEmitida[], overrides: Record<string, unknown> = {}) {
  mockUseCobrancasEmitidas.mockReturnValue({
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

describe("CobrancasEmitidasTab", () => {
  describe("estado de carregamento", () => {
    it("deve exibir estado de carregamento", () => {
      mockQueryReturn([], { isLoading: true });

      render(<CobrancasEmitidasTab />);

      expect(screen.getByTestId("query-list-loading")).toBeVisible();
    });
  });

  describe("estado de erro", () => {
    it("deve exibir estado de erro", () => {
      const refetch = jest.fn();
      mockQueryReturn([], { isError: true, refetch });

      render(<CobrancasEmitidasTab />);

      expect(screen.getByTestId("query-list-error")).toBeVisible();
    });

    it("deve chamar refetch ao clicar em tentar novamente", async () => {
      const user = userEvent.setup();
      const refetch = jest.fn();
      mockQueryReturn([], { isError: true, refetch });

      render(<CobrancasEmitidasTab />);

      await user.click(screen.getByTestId("retry-button"));
      expect(refetch).toHaveBeenCalled();
    });
  });

  describe("estado vazio", () => {
    it("deve exibir mensagem de estado vazio", () => {
      mockQueryReturn([]);

      render(<CobrancasEmitidasTab />);

      expect(screen.getByTestId("query-list-empty")).toBeVisible();
      expect(screen.getByText("Nenhuma cobrança emitida")).toBeVisible();
    });
  });

  describe("renderização de dados", () => {
    it("deve renderizar a lista de cobranças emitidas", () => {
      mockQueryReturn([cobrancaAberta, cobrancaPaga]);

      render(<CobrancasEmitidasTab />);

      expect(screen.getByTestId("query-list-content")).toBeVisible();
      expect(screen.getByText("João Silva")).toBeVisible();
      expect(screen.getByText("Maria Santos")).toBeVisible();
      expect(screen.getByText("Pagamento de dívida")).toBeVisible();
    });

    it("deve exibir o valor formatado", () => {
      mockQueryReturn([cobrancaAberta]);

      render(<CobrancasEmitidasTab />);

      expect(screen.getByText(/1\.500,00/)).toBeVisible();
    });

    it("deve exibir o badge de status para cobrança aberta", () => {
      mockQueryReturn([cobrancaAberta]);

      render(<CobrancasEmitidasTab />);

      expect(screen.getByText("Aberto")).toBeVisible();
    });

    it("deve exibir o badge de status para cobrança paga", () => {
      mockQueryReturn([cobrancaPaga]);

      render(<CobrancasEmitidasTab />);

      expect(screen.getByText("Pago")).toBeVisible();
    });

    it("deve exibir data de pagamento para cobrança paga", () => {
      mockQueryReturn([cobrancaPaga]);

      render(<CobrancasEmitidasTab />);

      expect(screen.getByText(/Pago em 11\/01\/2025/)).toBeVisible();
    });

    it("não deve exibir data de pagamento para cobrança aberta", () => {
      mockQueryReturn([cobrancaAberta]);

      render(<CobrancasEmitidasTab />);

      expect(screen.queryByText(/Pago em/)).not.toBeInTheDocument();
    });

    it("deve exibir o botão Cancelar apenas para cobranças abertas", () => {
      mockQueryReturn([cobrancaAberta, cobrancaPaga]);

      render(<CobrancasEmitidasTab />);

      const buttons = screen.getAllByRole("button", { name: "Cancelar" });
      expect(buttons).toHaveLength(1);
    });

    it("não deve exibir botão Cancelar para cobranças canceladas", () => {
      mockQueryReturn([cobrancaCancelada]);

      render(<CobrancasEmitidasTab />);

      expect(screen.queryByRole("button", { name: "Cancelar" })).not.toBeInTheDocument();
    });
  });

  describe("modal de cancelamento", () => {
    it("deve abrir modal de cancelamento ao clicar em Cancelar", async () => {
      const user = userEvent.setup();
      mockQueryReturn([cobrancaAberta]);

      render(<CobrancasEmitidasTab />);

      await user.click(screen.getByRole("button", { name: "Cancelar" }));

      expect(screen.getByRole("dialog", { name: "Cancelar Cobrança" })).toBeVisible();
      expect(
        screen.getByText(/Tem certeza que deseja cancelar a cobrança para João Silva\?/),
      ).toBeVisible();
    });

    it("deve fechar modal ao clicar no botão Cancelar do modal", async () => {
      const user = userEvent.setup();
      mockQueryReturn([cobrancaAberta]);

      render(<CobrancasEmitidasTab />);

      await user.click(screen.getByRole("button", { name: "Cancelar" }));

      const dialog = screen.getByRole("dialog", { name: "Cancelar Cobrança" });
      await user.click(within(dialog).getByRole("button", { name: "Cancelar" }));

      await waitFor(() => {
        expect(
          screen.queryByRole("dialog", { name: "Cancelar Cobrança" }),
        ).not.toBeInTheDocument();
      });
    });

    it("deve chamar cancelar e exibir toast de sucesso ao confirmar", async () => {
      cobrancasService.cancelar.mockResolvedValueOnce(undefined);
      const user = userEvent.setup();
      mockQueryReturn([cobrancaAberta]);

      render(<CobrancasEmitidasTab />);

      await user.click(screen.getByRole("button", { name: "Cancelar" }));
      await user.click(screen.getByRole("button", { name: "Confirmar" }));

      await waitFor(() => {
        expect(cobrancasService.cancelar).toHaveBeenCalledWith("cob-1");
        expect(toast.success).toHaveBeenCalledWith("Cobrança cancelada");
      });
    });

    it("deve exibir toast de erro quando a mutação falha com ApiError", async () => {
      const apiError = new ApiError({ codigo: 400, descricao: "Erro de validação" }, 400);
      cobrancasService.cancelar.mockRejectedValueOnce(apiError);
      const user = userEvent.setup();
      mockQueryReturn([cobrancaAberta]);

      render(<CobrancasEmitidasTab />);

      await user.click(screen.getByRole("button", { name: "Cancelar" }));
      await user.click(screen.getByRole("button", { name: "Confirmar" }));

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Erro de validação");
      });
    });

    it("deve exibir mensagem de erro padrão quando a mutação falha com erro genérico", async () => {
      cobrancasService.cancelar.mockRejectedValueOnce(new Error("Erro genérico"));
      const user = userEvent.setup();
      mockQueryReturn([cobrancaAberta]);

      render(<CobrancasEmitidasTab />);

      await user.click(screen.getByRole("button", { name: "Cancelar" }));
      await user.click(screen.getByRole("button", { name: "Confirmar" }));

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(DEFAULT_ERROR_MESSAGE);
      });
    });
  });
});
