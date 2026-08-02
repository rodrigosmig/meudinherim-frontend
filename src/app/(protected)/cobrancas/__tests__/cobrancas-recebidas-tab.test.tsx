import React from "react";
import { render, screen, waitFor } from "@/helpers/test/test-helper";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { StatusCobranca } from "@/types/enum/status-cobranca";
import { toast } from "@/components/toast";
import ApiError from "@/types/application-error";
import { DEFAULT_ERROR_MESSAGE } from "@/helpers/route-helpers";

import CobrancasRecebidasTab from "../cobrancas-recebidas-tab";

// ── mocks ──────────────────────────────────────────────────────────────────

jest.mock("@/components/toast", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

const mockUseCobrancasRecebidasPaginacao = jest.fn();
jest.mock("@/hooks/use-cobrancas-recebidas-paginacao", () => ({
  useCobrancasRecebidasPaginacao: (...args: unknown[]) =>
    mockUseCobrancasRecebidasPaginacao(...args),
}));

jest.mock("../gerar-conta-pagar-modal", () => ({
  __esModule: true,
  default: ({
    open,
    onOpenChange,
    cobrancaUuid,
  }: {
    cobrancaUuid: string;
    valorCobranca: number;
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

jest.mock("../tabela-cobrancas-recebidas", () => ({
  __esModule: true,
  default: ({
    cobrancas,
    onGerarContaAPagar,
    onMarcarComoPaga,
    isMutating,
  }: {
    cobrancas: unknown[];
    onGerarContaAPagar: (uuid: string) => void;
    onMarcarComoPaga: (c: unknown) => void;
    isMutating: boolean;
  }) => (
    <div data-testid="tabela-cobrancas-recebidas">
      {cobrancas.map((c: any) => (
        <div key={c.uuid} data-testid={`row-${c.uuid}`}>
          <span>{c.cobrador.nome}</span>
          <button
            data-testid={`gerar-conta-${c.uuid}`}
            onClick={() => onGerarContaAPagar(c.uuid)}
            disabled={c.gerouContaAPagar || isMutating}
          >
            Gerar conta a pagar
          </button>
          <button
            data-testid={`marcar-paga-${c.uuid}`}
            onClick={() =>
              onMarcarComoPaga({ uuid: c.uuid, nomeCobrador: c.cobrador.nome })
            }
            disabled={isMutating}
          >
            Marcar como pago
          </button>
        </div>
      ))}
    </div>
  ),
}));

jest.mock("@/components/primitives/query-list-state", () => ({
  __esModule: true,
  default: ({
    isLoading,
    isError,
    isEmpty,
    emptyMessage,
    errorMessage,
    onRetry,
    children,
  }: {
    isLoading: boolean;
    isError: boolean;
    isEmpty: boolean;
    emptyMessage: string;
    errorMessage?: string;
    onRetry?: () => void;
    isRetrying?: boolean;
    containerClassName?: string;
    children: React.ReactNode;
  }) => {
    if (isLoading) return <div data-testid="query-list-loading">Carregando...</div>;
    if (isError)
      return (
        <div data-testid="query-list-error">
          {errorMessage}
          {onRetry && (
            <button onClick={onRetry} data-testid="retry-button">
              Tentar novamente
            </button>
          )}
        </div>
      );
    if (isEmpty) return <div data-testid="query-list-empty">{emptyMessage}</div>;
    return <div data-testid="query-list-content">{children}</div>;
  },
}));

jest.mock("@/components/pagination", () => ({
  __esModule: true,
  default: ({ onPageChange }: { paginacao: unknown; onPageChange: (p: number) => void }) => (
    <button data-testid="pagination-next" onClick={() => onPageChange(2)}>
      Próxima
    </button>
  ),
}));

jest.mock("@/services/cobrancas-service", () => ({
  cobrancasService: {
    marcarComoPaga: jest.fn(),
  },
}));

const { cobrancasService } = jest.requireMock("@/services/cobrancas-service");

// ── helpers ────────────────────────────────────────────────────────────────

const cobrancaAberta = {
  uuid: "cob-rec-1",
  cobrador: { id: "user-1", nome: "Carlos Oliveira", email: "carlos@email.com" },
  descricao: "Mensalidade escolar",
  valor: 2500,
  status: StatusCobranca.ABERTO,
  criadoEm: "2025-02-01T10:00:00",
  gerouContaAPagar: false,
  data: "2025-02-01",
  isParcelado: false,
};

const defaultProps = {
  inicio: undefined,
  fim: undefined,
  status: StatusCobranca.ABERTO,
  perPage: 10,
};

const createWrapper = () => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
};

function mockQueryReturn(overrides: Record<string, unknown> = {}) {
  mockUseCobrancasRecebidasPaginacao.mockReturnValue({
    data: {
      pagina: {
        conteudo: [cobrancaAberta],
        paginacao: {
          paginaAtual: 1,
          ultimaPagina: 1,
          tamanhoPagina: 10,
          totalElementos: 1,
          doElemento: 1,
          paraElemento: 1,
        },
      },
    },
    isLoading: false,
    isError: false,
    isFetching: false,
    refetch: jest.fn(),
    ...overrides,
  });
}

// ── setup ──────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
  mockQueryReturn();
});

// ── testes ─────────────────────────────────────────────────────────────────

describe("CobrancasRecebidasTab", () => {
  describe("estado de carregamento", () => {
    it("deve exibir estado de carregamento", () => {
      mockQueryReturn({ isLoading: true });

      render(<CobrancasRecebidasTab {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      expect(screen.getByTestId("query-list-loading")).toBeVisible();
    });
  });

  describe("estado de erro", () => {
    it("deve exibir estado de erro com botão de retry", async () => {
      const refetch = jest.fn();
      mockQueryReturn({ isError: true, data: undefined, refetch });
      const user = userEvent.setup();

      render(<CobrancasRecebidasTab {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      expect(screen.getByTestId("query-list-error")).toBeVisible();
      await user.click(screen.getByTestId("retry-button"));
      expect(refetch).toHaveBeenCalled();
    });
  });

  describe("estado vazio", () => {
    it("deve exibir mensagem de lista vazia", () => {
      mockQueryReturn({
        data: {
          pagina: { conteudo: [], paginacao: { paginaAtual: 1, ultimaPagina: 0, tamanhoPagina: 10, totalElementos: 0, doElemento: 0, paraElemento: 0 } },
        },
      });

      render(<CobrancasRecebidasTab {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      expect(screen.getByTestId("query-list-empty")).toHaveTextContent(
        "Nenhuma cobrança recebida",
      );
    });
  });

  describe("com dados", () => {
    it("deve renderizar a tabela com dados", () => {
      render(<CobrancasRecebidasTab {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      expect(screen.getByTestId("tabela-cobrancas-recebidas")).toBeVisible();
    });

    it("deve passar filtros para o hook paginado", () => {
      render(
        <CobrancasRecebidasTab
          inicio="2025-01-01"
          fim="2025-01-31"
          status={StatusCobranca.PAGO}
          perPage={25}
        />,
        { wrapper: createWrapper() },
      );

      expect(mockUseCobrancasRecebidasPaginacao).toHaveBeenCalledWith(
        1,
        25,
        "2025-01-01",
        "2025-01-31",
        StatusCobranca.PAGO,
      );
    });

    it("deve navegar entre páginas", async () => {
      const user = userEvent.setup();

      render(<CobrancasRecebidasTab {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      await user.click(screen.getByTestId("pagination-next"));

      expect(mockUseCobrancasRecebidasPaginacao).toHaveBeenCalledWith(
        2,
        10,
        undefined,
        undefined,
        StatusCobranca.ABERTO,
      );
    });
  });

  describe("modal GerarContaAPagar", () => {
    it("deve abrir o modal ao clicar em Gerar conta a pagar", async () => {
      const user = userEvent.setup();

      render(<CobrancasRecebidasTab {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      await user.click(screen.getByTestId("gerar-conta-cob-rec-1"));

      expect(screen.getByTestId("gerar-conta-pagar-modal")).toBeVisible();
    });
  });

  describe("marcar como paga", () => {
    it("deve abrir modal de confirmação ao clicar em Marcar como pago", async () => {
      const user = userEvent.setup();

      render(<CobrancasRecebidasTab {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      await user.click(screen.getByTestId("marcar-paga-cob-rec-1"));

      await waitFor(() => {
        expect(
          screen.getByText(/Tem certeza que deseja marcar como paga a cobrança de Carlos Oliveira\?/),
        ).toBeVisible();
      });
    });

    it("deve chamar serviço ao confirmar", async () => {
      cobrancasService.marcarComoPaga.mockResolvedValueOnce(undefined);
      const user = userEvent.setup();

      render(<CobrancasRecebidasTab {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      await user.click(screen.getByTestId("marcar-paga-cob-rec-1"));

      const confirmarBtn = screen.getByRole("button", { name: "Confirmar" });
      await user.click(confirmarBtn);

      await waitFor(() => {
        expect(cobrancasService.marcarComoPaga).toHaveBeenCalledWith("cob-rec-1");
      });
    });

    it("deve exibir toast de erro quando API retorna ApiError", async () => {
      const apiError = new ApiError({ codigo: 400, descricao: "Erro de validação" }, 400);
      cobrancasService.marcarComoPaga.mockRejectedValueOnce(apiError);
      const user = userEvent.setup();

      render(<CobrancasRecebidasTab {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      await user.click(screen.getByTestId("marcar-paga-cob-rec-1"));

      const confirmarBtn = screen.getByRole("button", { name: "Confirmar" });
      await user.click(confirmarBtn);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Erro de validação");
      });
    });

    it("deve exibir mensagem de erro padrão para erro genérico", async () => {
      cobrancasService.marcarComoPaga.mockRejectedValueOnce(new Error("Erro genérico"));
      const user = userEvent.setup();

      render(<CobrancasRecebidasTab {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      await user.click(screen.getByTestId("marcar-paga-cob-rec-1"));

      const confirmarBtn = screen.getByRole("button", { name: "Confirmar" });
      await user.click(confirmarBtn);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(DEFAULT_ERROR_MESSAGE);
      });
    });
  });
});
