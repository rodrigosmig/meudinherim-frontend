import React from "react";
import { render, screen, waitFor } from "@/helpers/test/test-helper";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { StatusCobranca } from "@/types/enum/status-cobranca";
import { toast } from "@/components/toast";
import ApiError from "@/types/application-error";
import { DEFAULT_ERROR_MESSAGE } from "@/helpers/route-helpers";

import CobrancasEmitidasTab from "../cobrancas-emitidas-tab";

// ── mocks ──────────────────────────────────────────────────────────────────

jest.mock("@/components/toast", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

const mockUseCobrancasEmitidasPaginacao = jest.fn();
jest.mock("@/hooks/use-cobrancas-emitidas-paginacao", () => ({
  useCobrancasEmitidasPaginacao: (...args: unknown[]) =>
    mockUseCobrancasEmitidasPaginacao(...args),
}));

jest.mock("../tabela-cobrancas-emitidas", () => ({
  __esModule: true,
  default: ({
    cobrancas,
    onMarcarComoPaga,
    onCancelar,
    isMutating,
  }: {
    cobrancas: unknown[];
    onMarcarComoPaga: (c: unknown) => void;
    onCancelar: (c: unknown) => void;
    isMutating: boolean;
  }) => (
    <div data-testid="tabela-cobrancas-emitidas">
      {cobrancas.map((c: any) => (
        <div key={c.uuid} data-testid={`row-${c.uuid}`}>
          <span>{c.devedor.nome}</span>
          <button
            data-testid={`marcar-paga-${c.uuid}`}
            onClick={() =>
              onMarcarComoPaga({ uuid: c.uuid, nomeDevedor: c.devedor.nome })
            }
            disabled={isMutating}
          >
            Marcar como pago
          </button>
          <button
            data-testid={`cancelar-${c.uuid}`}
            onClick={() =>
              onCancelar({ uuid: c.uuid, nomeDevedor: c.devedor.nome })
            }
            disabled={isMutating}
          >
            Cancelar
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
    cancelar: jest.fn(),
    marcarComoPaga: jest.fn(),
  },
}));

const { cobrancasService } = jest.requireMock("@/services/cobrancas-service");

// ── helpers ────────────────────────────────────────────────────────────────

const cobrancaAberta = {
  uuid: "cob-1",
  devedor: { id: "user-1", nome: "João Silva", email: "joao@email.com" },
  descricao: "Pagamento de dívida",
  valor: 1500,
  status: StatusCobranca.ABERTO,
  criadoEm: "2025-01-15T10:30:00",
  data: "2025-01-15",
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
  mockUseCobrancasEmitidasPaginacao.mockReturnValue({
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

describe("CobrancasEmitidasTab", () => {
  describe("estado de carregamento", () => {
    it("deve exibir estado de carregamento", () => {
      mockQueryReturn({ isLoading: true });

      render(<CobrancasEmitidasTab {...defaultProps} />, {
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

      render(<CobrancasEmitidasTab {...defaultProps} />, {
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

      render(<CobrancasEmitidasTab {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      expect(screen.getByTestId("query-list-empty")).toHaveTextContent(
        "Nenhuma cobrança emitida",
      );
    });
  });

  describe("com dados", () => {
    it("deve renderizar a tabela com dados", () => {
      render(<CobrancasEmitidasTab {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      expect(screen.getByTestId("tabela-cobrancas-emitidas")).toBeVisible();
    });

    it("deve passar filtros para o hook paginado", () => {
      render(
        <CobrancasEmitidasTab
          inicio="2025-01-01"
          fim="2025-01-31"
          status={StatusCobranca.PAGO}
          perPage={25}
        />,
        { wrapper: createWrapper() },
      );

      expect(mockUseCobrancasEmitidasPaginacao).toHaveBeenCalledWith(
        1,
        25,
        "2025-01-01",
        "2025-01-31",
        StatusCobranca.PAGO,
      );
    });

    it("deve navegar entre páginas", async () => {
      const user = userEvent.setup();

      render(<CobrancasEmitidasTab {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      await user.click(screen.getByTestId("pagination-next"));

      expect(mockUseCobrancasEmitidasPaginacao).toHaveBeenCalledWith(
        2,
        10,
        undefined,
        undefined,
        StatusCobranca.ABERTO,
      );
    });
  });

  describe("cancelar", () => {
    it("deve abrir modal de confirmação ao clicar em Cancelar", async () => {
      const user = userEvent.setup();

      render(<CobrancasEmitidasTab {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      await user.click(screen.getByTestId("cancelar-cob-1"));

      await waitFor(() => {
        expect(
          screen.getByText(/Tem certeza que deseja cancelar a cobrança para João Silva\?/),
        ).toBeVisible();
      });
    });

    it("deve chamar serviço ao confirmar cancelamento", async () => {
      cobrancasService.cancelar.mockResolvedValueOnce(undefined);
      const user = userEvent.setup();

      render(<CobrancasEmitidasTab {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      await user.click(screen.getByTestId("cancelar-cob-1"));

      const confirmarBtn = screen.getByRole("button", { name: "Confirmar" });
      await user.click(confirmarBtn);

      await waitFor(() => {
        expect(cobrancasService.cancelar).toHaveBeenCalledWith("cob-1");
      });
    });

    it("deve exibir toast de erro quando API retorna ApiError", async () => {
      const apiError = new ApiError({ codigo: 400, descricao: "Erro de validação" }, 400);
      cobrancasService.cancelar.mockRejectedValueOnce(apiError);
      const user = userEvent.setup();

      render(<CobrancasEmitidasTab {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      await user.click(screen.getByTestId("cancelar-cob-1"));

      const confirmarBtn = screen.getByRole("button", { name: "Confirmar" });
      await user.click(confirmarBtn);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Erro de validação");
      });
    });

    it("deve exibir mensagem de erro padrão para erro genérico", async () => {
      cobrancasService.cancelar.mockRejectedValueOnce(new Error("Erro genérico"));
      const user = userEvent.setup();

      render(<CobrancasEmitidasTab {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      await user.click(screen.getByTestId("cancelar-cob-1"));

      const confirmarBtn = screen.getByRole("button", { name: "Confirmar" });
      await user.click(confirmarBtn);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(DEFAULT_ERROR_MESSAGE);
      });
    });
  });

  describe("marcar como paga", () => {
    it("deve chamar serviço ao confirmar", async () => {
      cobrancasService.marcarComoPaga.mockResolvedValueOnce(undefined);
      const user = userEvent.setup();

      render(<CobrancasEmitidasTab {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      await user.click(screen.getByTestId("marcar-paga-cob-1"));

      const confirmarBtn = screen.getByRole("button", { name: "Confirmar" });
      await user.click(confirmarBtn);

      await waitFor(() => {
        expect(cobrancasService.marcarComoPaga).toHaveBeenCalledWith("cob-1");
      });
    });

    it("deve exibir toast de erro quando API retorna ApiError", async () => {
      const apiError = new ApiError({ codigo: 400, descricao: "Erro de validação" }, 400);
      cobrancasService.marcarComoPaga.mockRejectedValueOnce(apiError);
      const user = userEvent.setup();

      render(<CobrancasEmitidasTab {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      await user.click(screen.getByTestId("marcar-paga-cob-1"));

      const confirmarBtn = screen.getByRole("button", { name: "Confirmar" });
      await user.click(confirmarBtn);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Erro de validação");
      });
    });

    it("deve exibir mensagem de erro padrão para erro genérico", async () => {
      cobrancasService.marcarComoPaga.mockRejectedValueOnce(new Error("Erro genérico"));
      const user = userEvent.setup();

      render(<CobrancasEmitidasTab {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      await user.click(screen.getByTestId("marcar-paga-cob-1"));

      const confirmarBtn = screen.getByRole("button", { name: "Confirmar" });
      await user.click(confirmarBtn);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(DEFAULT_ERROR_MESSAGE);
      });
    });
  });
});
