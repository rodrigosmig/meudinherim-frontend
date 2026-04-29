import React from "react";
import { render, screen, waitFor } from "@/helpers/test/test-helper";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Fatura } from "@/types/faturas";
import { StatusPagamento } from "@/types/enum/status-pagamento";

import CartaoFaturasPage from "../page";

// ── mocks ──────────────────────────────────────────────────────────────────

jest.mock("next/navigation", () => ({
  useParams: () => ({ idCartao: "cartao-123" }),
}));

jest.mock("@/components/toast", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

const mockedUseFaturasPaginacao = jest.fn();
jest.mock("@/hooks/use-faturas-paginacao", () => ({
  useFaturasPaginacao: (...args: unknown[]) => mockedUseFaturasPaginacao(...args),
}));

jest.mock("@/components/header/header", () => ({
  Header: {
    Title: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="header-title">{children}</div>
    ),
  },
}));

jest.mock("@/components/primitives/skeleton", () => ({
  __esModule: true,
  default: () => <div data-testid="skeleton" />,
}));

jest.mock("@/components/primitives/query-list-state", () => ({
  __esModule: true,
  default: ({
    isLoading,
    isError,
    isEmpty,
    children,
  }: {
    isLoading: boolean;
    isError: boolean;
    isEmpty: boolean;
    children: React.ReactNode;
  }) => {
    if (isLoading) return <div data-testid="query-list-loading" />;
    if (isError) return <div data-testid="query-list-error">Erro ao carregar</div>;
    if (isEmpty) return <div data-testid="query-list-empty">Nenhum registro</div>;
    return <div data-testid="query-list-content">{children}</div>;
  },
}));

jest.mock("@/components/primitives/select", () => ({
  Select: ({ placeholder, value, onChange, options }: any) => (
    <select
      aria-label={placeholder}
      value={value ?? ""}
      onChange={(e) => onChange?.(e.target.value)}
    >
      {options?.map((opt: any) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  ),
}));

jest.mock("@/components/filtro-por-pagina", () => ({
  __esModule: true,
  default: ({ value, onChange }: { value: number; onChange: (v: number) => void }) => (
    <select
      aria-label="Itens por página"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
    >
      <option value={10}>10</option>
      <option value={25}>25</option>
    </select>
  ),
}));

jest.mock("@/components/pagination", () => ({
  __esModule: true,
  default: () => <div data-testid="pagination" />,
}));

jest.mock("@/components/header/responsive-page-title", () => ({
  __esModule: true,
  default: ({ title }: { title: string }) => <h1>{title}</h1>,
}));

jest.mock("../tabela-faturas", () => ({
  __esModule: true,
  default: ({ faturas }: { faturas: Fatura[] }) => (
    <div data-testid="tabela-faturas">
      {faturas.map((f) => (
        <span key={f.uuid} data-testid={`fatura-${f.uuid}`}>
          {f.dataVencimento}
        </span>
      ))}
    </div>
  ),
}));

// ── helpers ────────────────────────────────────────────────────────────────

const createWrapper = () => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
};

const makeFaturasReturn = (
  conteudo: Fatura[] = [],
  extra: Partial<{
    isLoading: boolean;
    isError: boolean;
    isFetching: boolean;
    error: unknown;
    data: any;
    refetch: jest.Mock;
  }> = {},
) => ({
  data: {
    pagina: {
      conteudo,
      paginacao: {
        paginaAtual: 1,
        ultimaPagina: 1,
        tamanhoPagina: 10,
        totalElementos: conteudo.length,
        doElemento: 1,
        paraElemento: conteudo.length,
      },
    },
  },
  error: null,
  isError: false,
  isLoading: false,
  isFetching: false,
  refetch: jest.fn(),
  ...extra,
});

const makeFatura = (overrides: Partial<Fatura> & { uuid: string }): Fatura => ({
  dataVencimento: "2026-05-10",
  dataFechamento: "2026-05-03",
  valorTotal: 1500,
  status: StatusPagamento.ABERTO,
  isFechada: false,
  cartao: { uuid: "cartao-123", descricao: "Nubank" },
  ...overrides,
});

// ── setup ──────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
  mockedUseFaturasPaginacao.mockReturnValue(
    makeFaturasReturn([makeFatura({ uuid: "fatura-1" })]),
  );
});

// ── testes ─────────────────────────────────────────────────────────────────

describe("CartaoFaturasPage", () => {
  describe("estado de carregamento", () => {
    it("deve exibir skeletons quando isLoading é true", () => {
      mockedUseFaturasPaginacao.mockReturnValue(
        makeFaturasReturn([], { isLoading: true }),
      );
      render(<CartaoFaturasPage />, { wrapper: createWrapper() });
      expect(screen.getAllByTestId("skeleton").length).toBeGreaterThan(0);
      expect(screen.queryByTestId("tabela-faturas")).not.toBeInTheDocument();
    });
  });

  describe("estado carregado", () => {
    it("deve exibir o nome do cartão como título", () => {
      render(<CartaoFaturasPage />, { wrapper: createWrapper() });
      expect(screen.getByRole("heading", { name: "Nubank" })).toBeVisible();
    });

    it("deve renderizar a tabela com as faturas", () => {
      render(<CartaoFaturasPage />, { wrapper: createWrapper() });
      expect(screen.getByTestId("tabela-faturas")).toBeVisible();
      expect(screen.getByTestId("fatura-fatura-1")).toBeVisible();
    });

    it("deve exibir título 'Faturas' quando não há dados ainda", () => {
      mockedUseFaturasPaginacao.mockReturnValue(makeFaturasReturn([]));
      render(<CartaoFaturasPage />, { wrapper: createWrapper() });
      expect(screen.getByRole("heading", { name: "Faturas" })).toBeVisible();
    });

    it("deve exibir estado vazio quando não há faturas", () => {
      mockedUseFaturasPaginacao.mockReturnValue(makeFaturasReturn([]));
      render(<CartaoFaturasPage />, { wrapper: createWrapper() });
      expect(screen.getByTestId("query-list-empty")).toBeVisible();
    });

    it("deve exibir estado de erro quando a query falha", () => {
      mockedUseFaturasPaginacao.mockReturnValue(
        makeFaturasReturn([], { data: undefined, isError: true, error: new Error("falha") }),
      );
      render(<CartaoFaturasPage />, { wrapper: createWrapper() });
      expect(screen.getByTestId("query-list-error")).toBeVisible();
    });
  });

  describe("busca e filtragem", () => {
    beforeEach(() => {
      mockedUseFaturasPaginacao.mockReturnValue(
        makeFaturasReturn([
          makeFatura({ uuid: "fatura-1", dataVencimento: "2026-05-10" }),
          makeFatura({ uuid: "fatura-2", dataVencimento: "2026-04-10" }),
        ]),
      );
    });

    it("deve filtrar faturas pela data de vencimento", async () => {
      const user = userEvent.setup();
      render(<CartaoFaturasPage />, { wrapper: createWrapper() });

      await user.type(screen.getByPlaceholderText("Pesquisar"), "2026-05");

      expect(screen.getByTestId("fatura-fatura-1")).toBeVisible();
      expect(screen.queryByTestId("fatura-fatura-2")).not.toBeInTheDocument();
    });

    it("deve exibir todas ao limpar a busca", async () => {
      const user = userEvent.setup();
      render(<CartaoFaturasPage />, { wrapper: createWrapper() });

      const input = screen.getByPlaceholderText("Pesquisar");
      await user.type(input, "2026-05");
      await user.clear(input);

      expect(screen.getByTestId("fatura-fatura-1")).toBeVisible();
      expect(screen.getByTestId("fatura-fatura-2")).toBeVisible();
    });
  });

  describe("filtro de status", () => {
    it("deve passar statusPagamento ao hook ao mudar o Select", async () => {
      const user = userEvent.setup();
      render(<CartaoFaturasPage />, { wrapper: createWrapper() });

      await user.selectOptions(
        screen.getByRole("combobox", { name: "Todas" }),
        StatusPagamento.ABERTO,
      );

      await waitFor(() => {
        expect(mockedUseFaturasPaginacao).toHaveBeenCalledWith(
          "cartao-123",
          1,
          expect.any(Number),
          StatusPagamento.ABERTO,
        );
      });
    });
  });
});
