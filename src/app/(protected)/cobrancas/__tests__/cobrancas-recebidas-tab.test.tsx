import React from "react";
import { render, screen, waitFor } from "@/helpers/test/test-helper";
import userEvent from "@testing-library/user-event";

import type { CobrancaRecebida } from "@/types/cobranca";
import { StatusCobranca } from "@/types/enum/status-cobranca";
import { toast } from "@/components/toast";
import ApiError from "@/types/application-error";
import { DEFAULT_ERROR_MESSAGE } from "@/helpers/route-helpers";

import CobrancasRecebidasTab from "../cobrancas-recebidas-tab";

// ── mocks ──────────────────────────────────────────────────────────────────

jest.mock("@/components/toast", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

const mockUseCobrancasRecebidas = jest.fn();
jest.mock("@/hooks/use-cobrancas-recebidas", () => ({
  useCobrancasRecebidas: () => mockUseCobrancasRecebidas(),
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

jest.mock("../gerar-conta-pagar-modal", () => ({
  __esModule: true,
  default: ({ open, onOpenChange, cobrancaUuid }: {
    cobrancaUuid: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
  }) =>
    open ? (
      <div data-testid="gerar-conta-pagar-modal">
        Modal para {cobrancaUuid}
        <button onClick={() => onOpenChange(false)}>Fechar modal</button>
      </div>
    ) : null,
}));

jest.mock("@/services/cobrancas-service", () => ({
  cobrancasService: {
    marcarComoPaga: jest.fn(),
  },
}));

const { cobrancasService } = jest.requireMock("@/services/cobrancas-service");

// ── helpers ────────────────────────────────────────────────────────────────

const cobrancaAberta: CobrancaRecebida = {
  uuid: "cob-rec-1",
  cobrador: { id: "user-1", nome: "Carlos Oliveira", email: "carlos@email.com" },
  descricao: "Mensalidade escolar",
  valor: 2500,
  status: StatusCobranca.ABERTO,
  criadoEm: "2025-02-01T10:00:00",
  gerouContaAPagar: false,
};

const cobrancaComContaGerada: CobrancaRecebida = {
  uuid: "cob-rec-2",
  cobrador: { id: "user-2", nome: "Ana Pereira", email: "ana@email.com" },
  descricao: "Taxa de condomínio",
  valor: 450,
  status: StatusCobranca.ABERTO,
  criadoEm: "2025-01-20T08:30:00",
  gerouContaAPagar: true,
};

const cobrancaPaga: CobrancaRecebida = {
  uuid: "cob-rec-3",
  cobrador: { id: "user-3", nome: "Roberto Lima", email: "roberto@email.com" },
  descricao: "Serviço de consultoria",
  valor: 1200,
  status: StatusCobranca.PAGO,
  criadoEm: "2025-01-05T09:00:00",
  pagoEm: "2025-01-06T14:00:00",
  gerouContaAPagar: true,
};

const cobrancaCancelada: CobrancaRecebida = {
  uuid: "cob-rec-4",
  cobrador: { id: "user-4", nome: "Fernanda Costa", email: "fernanda@email.com" },
  descricao: "Projeto de design",
  valor: 3000,
  status: StatusCobranca.CANCELADA,
  criadoEm: "2025-03-10T11:00:00",
  gerouContaAPagar: false,
};

function mockQueryReturn(data: CobrancaRecebida[], overrides: Record<string, unknown> = {}) {
  mockUseCobrancasRecebidas.mockReturnValue({
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

describe("CobrancasRecebidasTab", () => {
  describe("estado de carregamento", () => {
    it("deve exibir estado de carregamento", () => {
      mockQueryReturn([], { isLoading: true });

      render(<CobrancasRecebidasTab />);

      expect(screen.getByTestId("query-list-loading")).toBeVisible();
    });
  });

  describe("estado de erro", () => {
    it("deve exibir estado de erro", () => {
      mockQueryReturn([], { isError: true });

      render(<CobrancasRecebidasTab />);

      expect(screen.getByTestId("query-list-error")).toBeVisible();
    });

    it("deve chamar refetch ao clicar em tentar novamente", async () => {
      const user = userEvent.setup();
      const refetch = jest.fn();
      mockQueryReturn([], { isError: true, refetch });

      render(<CobrancasRecebidasTab />);

      await user.click(screen.getByTestId("retry-button"));
      expect(refetch).toHaveBeenCalled();
    });
  });

  describe("estado vazio", () => {
    it("deve exibir mensagem de estado vazio", () => {
      mockQueryReturn([]);

      render(<CobrancasRecebidasTab />);

      expect(screen.getByTestId("query-list-empty")).toBeVisible();
      expect(screen.getByText("Nenhuma cobrança recebida")).toBeVisible();
    });
  });

  describe("renderização de dados", () => {
    it("deve renderizar a lista de cobranças recebidas", () => {
      mockQueryReturn([cobrancaAberta, cobrancaPaga]);

      render(<CobrancasRecebidasTab />);

      expect(screen.getByTestId("query-list-content")).toBeVisible();
      expect(screen.getByText("Carlos Oliveira")).toBeVisible();
      expect(screen.getByText("Roberto Lima")).toBeVisible();
      expect(screen.getByText("Mensalidade escolar")).toBeVisible();
    });

    it("deve exibir o valor formatado", () => {
      mockQueryReturn([cobrancaAberta]);

      render(<CobrancasRecebidasTab />);

      expect(screen.getByText(/2\.500,00/)).toBeVisible();
    });

    it("deve exibir o badge de status para cobrança aberta", () => {
      mockQueryReturn([cobrancaAberta]);

      render(<CobrancasRecebidasTab />);

      expect(screen.getByText("Aberto")).toBeVisible();
    });

    it("deve exibir 'Pago em' para cobrança paga", () => {
      mockQueryReturn([cobrancaPaga]);

      render(<CobrancasRecebidasTab />);

      expect(screen.getByText(/Pago em 06\/01\/2025/)).toBeVisible();
    });

    it("não deve exibir 'Pago em' para cobrança aberta", () => {
      mockQueryReturn([cobrancaAberta]);

      render(<CobrancasRecebidasTab />);

      expect(screen.queryByText(/Pago em/)).not.toBeInTheDocument();
    });

    it("deve exibir botão 'Gerar conta a pagar' para cobrança aberta sem conta gerada", () => {
      mockQueryReturn([cobrancaAberta]);

      render(<CobrancasRecebidasTab />);

      expect(screen.getByRole("button", { name: "Gerar conta a pagar" })).toBeVisible();
    });

    it("deve exibir botão 'Conta gerada' desabilitado quando gerouContaAPagar é true", () => {
      mockQueryReturn([cobrancaComContaGerada]);

      render(<CobrancasRecebidasTab />);

      const btn = screen.getByRole("button", { name: "Conta gerada" });
      expect(btn).toBeVisible();
      expect(btn).toBeDisabled();
    });

    it("não deve exibir botão de ação para cobrança paga", () => {
      mockQueryReturn([cobrancaPaga]);

      render(<CobrancasRecebidasTab />);

      expect(screen.queryByRole("button", { name: "Gerar conta a pagar" })).not.toBeInTheDocument();
      expect(screen.queryByRole("button", { name: "Conta gerada" })).not.toBeInTheDocument();
    });
  });

  describe("modal gerar conta a pagar", () => {
    it("deve abrir o modal ao clicar em 'Gerar conta a pagar'", async () => {
      const user = userEvent.setup();
      mockQueryReturn([cobrancaAberta]);

      render(<CobrancasRecebidasTab />);

      await user.click(screen.getByRole("button", { name: "Gerar conta a pagar" }));

      expect(screen.getByTestId("gerar-conta-pagar-modal")).toBeVisible();
    });

    it("deve fechar o modal ao chamar onOpenChange com false", async () => {
      const user = userEvent.setup();
      mockQueryReturn([cobrancaAberta]);

      render(<CobrancasRecebidasTab />);

      await user.click(screen.getByRole("button", { name: "Gerar conta a pagar" }));
      await user.click(screen.getByRole("button", { name: "Fechar modal" }));

      await waitFor(() => {
        expect(screen.queryByTestId("gerar-conta-pagar-modal")).not.toBeInTheDocument();
      });
    });
  });

  describe("botao marcar como pago", () => {
    it("deve exibir botão Marcar como pago para cobrança aberta", () => {
      mockQueryReturn([cobrancaAberta]);

      render(<CobrancasRecebidasTab />);

      expect(screen.getByRole("button", { name: "Marcar como pago" })).toBeVisible();
    });

    it("não deve exibir botão Marcar como pago para cobrança paga", () => {
      mockQueryReturn([cobrancaPaga]);

      render(<CobrancasRecebidasTab />);

      expect(screen.queryByRole("button", { name: "Marcar como pago" })).not.toBeInTheDocument();
    });

    it("não deve exibir botão Marcar como pago para cobrança cancelada", () => {
      mockQueryReturn([cobrancaCancelada]);

      render(<CobrancasRecebidasTab />);

      expect(screen.queryByRole("button", { name: "Marcar como pago" })).not.toBeInTheDocument();
    });

    it("deve exibir botão Marcar como pago mesmo quando gerouContaAPagar é true", () => {
      mockQueryReturn([cobrancaComContaGerada]);

      render(<CobrancasRecebidasTab />);

      expect(screen.getByRole("button", { name: "Marcar como pago" })).toBeVisible();
    });

    it("deve abrir modal de confirmação ao clicar em Marcar como pago", async () => {
      const user = userEvent.setup();
      mockQueryReturn([cobrancaAberta]);

      render(<CobrancasRecebidasTab />);

      await user.click(screen.getByRole("button", { name: "Marcar como pago" }));

      expect(screen.getByRole("dialog", { name: "Marcar como paga" })).toBeVisible();
      expect(
        screen.getByText("Tem certeza que deseja marcar como paga a cobrança de Carlos Oliveira?"),
      ).toBeVisible();
    });

    it("deve chamar marcarComoPaga e exibir toast de sucesso ao confirmar", async () => {
      cobrancasService.marcarComoPaga.mockResolvedValueOnce(undefined);
      const user = userEvent.setup();
      mockQueryReturn([cobrancaAberta]);

      render(<CobrancasRecebidasTab />);

      await user.click(screen.getByRole("button", { name: "Marcar como pago" }));
      await user.click(screen.getByRole("button", { name: "Confirmar" }));

      await waitFor(() => {
        expect(cobrancasService.marcarComoPaga).toHaveBeenCalledWith("cob-rec-1");
        expect(toast.success).toHaveBeenCalledWith("Cobrança marcada como paga");
      });
    });

    it("deve exibir toast de erro quando API retorna ApiError", async () => {
      const apiError = new ApiError({ codigo: 400, descricao: "Erro de validação" }, 400);
      cobrancasService.marcarComoPaga.mockRejectedValueOnce(apiError);
      const user = userEvent.setup();
      mockQueryReturn([cobrancaAberta]);

      render(<CobrancasRecebidasTab />);

      await user.click(screen.getByRole("button", { name: "Marcar como pago" }));
      await user.click(screen.getByRole("button", { name: "Confirmar" }));

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Erro de validação");
      });
    });

    it("deve exibir mensagem de erro padrão para erro genérico", async () => {
      cobrancasService.marcarComoPaga.mockRejectedValueOnce(new Error("Erro genérico"));
      const user = userEvent.setup();
      mockQueryReturn([cobrancaAberta]);

      render(<CobrancasRecebidasTab />);

      await user.click(screen.getByRole("button", { name: "Marcar como pago" }));
      await user.click(screen.getByRole("button", { name: "Confirmar" }));

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(DEFAULT_ERROR_MESSAGE);
      });
    });
  });
});
