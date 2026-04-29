import React from "react";
import { render, screen, waitFor } from "@/helpers/test/test-helper";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Cartao } from "@/types/cartao";
import { Status } from "@/types/enum/status";

import CartoesDeCreditoPage from "../page";

// ── mocks ──────────────────────────────────────────────────────────────────

jest.mock("@/components/toast", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

const mockedUseCartoesPaginacao = jest.fn();
jest.mock("@/hooks/use-cartoes-paginacao", () => ({
  useCartoesPaginacao: (...args: unknown[]) => mockedUseCartoesPaginacao(...args),
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

jest.mock("../tabela-cartoes", () => ({
  __esModule: true,
  default: ({ cartoes }: { cartoes: Cartao[] }) => (
    <div data-testid="tabela-cartoes">
      {cartoes.map((c) => (
        <span key={c.uuid} data-testid={`cartao-${c.uuid}`}>
          {c.nome}
        </span>
      ))}
    </div>
  ),
}));

jest.mock("../cartao-form", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
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

const makeCartoesReturn = (
  conteudo: Cartao[] = [],
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

const makeCartao = (overrides: Partial<Cartao> & { uuid: string }): Cartao => ({
  nome: "Cartão Teste",
  diaVencimento: 10,
  diaFechamento: 3,
  limiteCredito: 5000,
  saldo: 0,
  status: Status.ATIVO,
  ...overrides,
});

// ── setup ──────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
  mockedUseCartoesPaginacao.mockReturnValue(
    makeCartoesReturn([makeCartao({ uuid: "cartao-1", nome: "Nubank" })]),
  );
});

// ── testes ─────────────────────────────────────────────────────────────────

describe("CartoesDeCreditoPage", () => {
  describe("estado de carregamento", () => {
    it("deve exibir skeletons quando isLoading é true", () => {
      mockedUseCartoesPaginacao.mockReturnValue(
        makeCartoesReturn([], { isLoading: true }),
      );
      render(<CartoesDeCreditoPage />, { wrapper: createWrapper() });
      expect(screen.getAllByTestId("skeleton").length).toBeGreaterThan(0);
      expect(screen.queryByTestId("tabela-cartoes")).not.toBeInTheDocument();
    });
  });

  describe("estado carregado", () => {
    it("deve exibir o título 'Cartões de Crédito'", () => {
      render(<CartoesDeCreditoPage />, { wrapper: createWrapper() });
      expect(screen.getByRole("heading", { name: "Cartões de Crédito" })).toBeVisible();
    });

    it("deve renderizar a tabela com os cartões", () => {
      render(<CartoesDeCreditoPage />, { wrapper: createWrapper() });
      expect(screen.getByTestId("tabela-cartoes")).toBeVisible();
      expect(screen.getByTestId("cartao-cartao-1")).toBeVisible();
    });

    it("deve renderizar o botão Adicionar", () => {
      render(<CartoesDeCreditoPage />, { wrapper: createWrapper() });
      expect(screen.getByRole("button", { name: /adicionar/i })).toBeVisible();
    });

    it("deve exibir estado vazio quando não há cartões", () => {
      mockedUseCartoesPaginacao.mockReturnValue(makeCartoesReturn([]));
      render(<CartoesDeCreditoPage />, { wrapper: createWrapper() });
      expect(screen.getByTestId("query-list-empty")).toBeVisible();
    });

    it("deve exibir estado de erro quando a query falha", () => {
      mockedUseCartoesPaginacao.mockReturnValue(
        makeCartoesReturn([], { data: undefined, isError: true, error: new Error("falha") }),
      );
      render(<CartoesDeCreditoPage />, { wrapper: createWrapper() });
      expect(screen.getByTestId("query-list-error")).toBeVisible();
    });
  });

  describe("busca e filtragem", () => {
    beforeEach(() => {
      mockedUseCartoesPaginacao.mockReturnValue(
        makeCartoesReturn([
          makeCartao({ uuid: "cartao-1", nome: "Nubank Gold" }),
          makeCartao({ uuid: "cartao-2", nome: "Inter Black" }),
        ]),
      );
    });

    it("deve filtrar cartões por nome", async () => {
      const user = userEvent.setup();
      render(<CartoesDeCreditoPage />, { wrapper: createWrapper() });

      await user.type(screen.getByPlaceholderText("Pesquisar"), "nubank");

      expect(screen.getByTestId("cartao-cartao-1")).toBeVisible();
      expect(screen.queryByTestId("cartao-cartao-2")).not.toBeInTheDocument();
    });

    it("deve exibir todos ao limpar a busca", async () => {
      const user = userEvent.setup();
      render(<CartoesDeCreditoPage />, { wrapper: createWrapper() });

      const input = screen.getByPlaceholderText("Pesquisar");
      await user.type(input, "nubank");
      await user.clear(input);

      expect(screen.getByTestId("cartao-cartao-1")).toBeVisible();
      expect(screen.getByTestId("cartao-cartao-2")).toBeVisible();
    });

    it("deve exibir estado vazio quando busca não encontra resultados", async () => {
      const user = userEvent.setup();
      render(<CartoesDeCreditoPage />, { wrapper: createWrapper() });

      await user.type(screen.getByPlaceholderText("Pesquisar"), "xyzxyz");

      expect(screen.getByTestId("query-list-empty")).toBeVisible();
    });
  });

  describe("paginação e filtros", () => {
    it("deve reiniciar para a página 1 ao mudar perPage", async () => {
      const user = userEvent.setup();
      render(<CartoesDeCreditoPage />, { wrapper: createWrapper() });

      await user.selectOptions(
        screen.getByRole("combobox", { name: "Itens por página" }),
        "25",
      );

      await waitFor(() => {
        expect(mockedUseCartoesPaginacao).toHaveBeenCalledWith(1, 25, Status.ATIVO);
      });
    });

    it("deve filtrar por status ao mudar o Select", async () => {
      const user = userEvent.setup();
      render(<CartoesDeCreditoPage />, { wrapper: createWrapper() });

      await user.selectOptions(
        screen.getByRole("combobox", { name: "Status" }),
        Status.INATIVO,
      );

      await waitFor(() => {
        expect(mockedUseCartoesPaginacao).toHaveBeenCalledWith(
          1,
          expect.any(Number),
          Status.INATIVO,
        );
      });
    });
  });
});
