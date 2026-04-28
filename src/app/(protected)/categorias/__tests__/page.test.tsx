import React from "react";
import { render, screen } from "@/helpers/test/test-helper";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Categoria } from "@/types/categoria";
import { TipoCategoria } from "@/types/enum/tipo-categoria";
import { Status } from "@/types/enum/status";

import CategoriasPage from "../page";

// ── mocks ──────────────────────────────────────────────────────────────────

jest.mock("next/navigation", () => ({
  useParams: () => ({}),
}));

jest.mock("@/components/toast", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

const mockedUseCategoriasPaginacao = jest.fn();
jest.mock("@/hooks/use-categorias-paginacao", () => ({
  useCategoriasPaginacao: (...args: unknown[]) =>
    mockedUseCategoriasPaginacao(...args),
}));

jest.mock("@/components/primitives/select", () => ({
  Select: ({ placeholder, value, onChange }: any) => (
    <select
      aria-label={placeholder}
      value={value ?? ""}
      onChange={(e) => onChange?.(e.target.value)}
    >
      <option value="">Todos</option>
      <option value="ENTRADA">Entrada</option>
      <option value="SAIDA">Saída</option>
      <option value="ATIVO">Ativas</option>
      <option value="INATIVO">Inativas</option>
    </select>
  ),
}));

jest.mock("@/components/filtro-por-pagina", () => ({
  __esModule: true,
  default: ({
    value,
    onChange,
  }: {
    value: number;
    onChange: (v: number) => void;
  }) => (
    <select
      aria-label="Itens por página"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
    >
      <option value={10}>10</option>
      <option value={25}>25</option>
      <option value={50}>50</option>
    </select>
  ),
}));

jest.mock("@/components/header/responsive-page-title", () => ({
  __esModule: true,
  default: ({ title }: { title: string }) => <h1>{title}</h1>,
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
    if (isLoading) return <div data-testid="query-list-loading">Carregando...</div>;
    if (isError) return <div data-testid="query-list-error">Erro ao carregar</div>;
    if (isEmpty) return <div data-testid="query-list-empty">Nenhum registro</div>;
    return <div data-testid="query-list-content">{children}</div>;
  },
}));

jest.mock("../tabela-categorias", () => ({
  __esModule: true,
  default: ({ categorias }: { categorias: Categoria[] }) => (
    <div data-testid="tabela-categorias">
      {categorias.map((c) => (
        <span key={c.uuid} data-testid={`categoria-${c.uuid}`}>
          {c.nome}
        </span>
      ))}
    </div>
  ),
}));

jest.mock("../categoria-form", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock("@/components/pagination", () => ({
  __esModule: true,
  default: () => <div data-testid="pagination" />,
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

const paginacaoDefault = {
  paginaAtual: 1,
  ultimaPagina: 1,
  tamanhoPagina: 10,
  totalElementos: 1,
  doElemento: 1,
  paraElemento: 1,
};

const defaultCategoriasReturn = (
  conteudo: Categoria[] = [],
  extra: Partial<{
    data:
      | { pagina: { conteudo: Categoria[]; paginacao: typeof paginacaoDefault } }
      | undefined;
    error: unknown;
    isError: boolean;
    isFetching: boolean;
    isLoading: boolean;
    refetch: jest.Mock;
  }> = {},
) => ({
  data: { pagina: { conteudo, paginacao: paginacaoDefault } },
  error: null,
  isError: false,
  isLoading: false,
  isFetching: false,
  refetch: jest.fn(),
  ...extra,
});

const categoriaAlimentacao: Categoria = {
  uuid: "cat-1",
  nome: "Alimentação",
  tipo: TipoCategoria.SAIDA,
  status: Status.ATIVO,
  exibirNaDashboard: true,
};

const categoriaSalario: Categoria = {
  uuid: "cat-2",
  nome: "Salário",
  tipo: TipoCategoria.ENTRADA,
  status: Status.ATIVO,
  exibirNaDashboard: false,
};

// ── setup ──────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();

  mockedUseCategoriasPaginacao.mockReturnValue(
    defaultCategoriasReturn([categoriaAlimentacao]),
  );
});

// ── testes ─────────────────────────────────────────────────────────────────

describe("CategoriasPage", () => {
  describe("estado de carregamento", () => {
    it("deve exibir skeletons e não renderizar a tabela quando isLoading é true", () => {
      mockedUseCategoriasPaginacao.mockReturnValue(
        defaultCategoriasReturn([], { isLoading: true }),
      );

      render(<CategoriasPage />, { wrapper: createWrapper() });

      expect(screen.getAllByTestId("skeleton").length).toBeGreaterThan(0);
      expect(screen.queryByTestId("tabela-categorias")).not.toBeInTheDocument();
    });
  });

  describe("estado carregado", () => {
    it("deve exibir o título 'Categorias'", () => {
      render(<CategoriasPage />, { wrapper: createWrapper() });

      expect(
        screen.getByRole("heading", { name: "Categorias" }),
      ).toBeVisible();
    });

    it("deve renderizar categorias na tabela", () => {
      mockedUseCategoriasPaginacao.mockReturnValue(
        defaultCategoriasReturn([categoriaAlimentacao, categoriaSalario]),
      );

      render(<CategoriasPage />, { wrapper: createWrapper() });

      expect(screen.getByTestId("categoria-cat-1")).toBeVisible();
      expect(screen.getByTestId("categoria-cat-2")).toBeVisible();
    });

    it("deve renderizar os filtros de Tipo e Status", () => {
      render(<CategoriasPage />, { wrapper: createWrapper() });

      expect(screen.getByRole("combobox", { name: "Tipo" })).toBeVisible();
      expect(screen.getByRole("combobox", { name: "Status" })).toBeVisible();
    });

    it("deve renderizar o filtro de itens por página", () => {
      render(<CategoriasPage />, { wrapper: createWrapper() });

      expect(
        screen.getByRole("combobox", { name: "Itens por página" }),
      ).toBeVisible();
    });
  });

  describe("busca por nome", () => {
    beforeEach(() => {
      mockedUseCategoriasPaginacao.mockReturnValue(
        defaultCategoriasReturn([categoriaAlimentacao, categoriaSalario]),
      );
    });

    it("deve filtrar categorias pelo termo de busca", async () => {
      const user = userEvent.setup();
      render(<CategoriasPage />, { wrapper: createWrapper() });

      await user.type(screen.getByPlaceholderText("Pesquisar"), "Alim");

      expect(screen.getByTestId("categoria-cat-1")).toBeVisible();
      expect(screen.queryByTestId("categoria-cat-2")).not.toBeInTheDocument();
    });

    it("não deve mostrar categorias que não correspondem ao termo de busca", async () => {
      const user = userEvent.setup();
      render(<CategoriasPage />, { wrapper: createWrapper() });

      await user.type(screen.getByPlaceholderText("Pesquisar"), "Salário");

      expect(screen.queryByTestId("categoria-cat-1")).not.toBeInTheDocument();
      expect(screen.getByTestId("categoria-cat-2")).toBeVisible();
    });

    it("deve exibir estado vazio quando a busca não encontra resultados", async () => {
      const user = userEvent.setup();
      render(<CategoriasPage />, { wrapper: createWrapper() });

      await user.type(screen.getByPlaceholderText("Pesquisar"), "xyzxyzxyz");

      expect(screen.getByTestId("query-list-empty")).toBeVisible();
      expect(screen.queryByTestId("tabela-categorias")).not.toBeInTheDocument();
    });
  });

  describe("estado vazio", () => {
    it("deve exibir estado vazio quando não há categorias", () => {
      mockedUseCategoriasPaginacao.mockReturnValue(defaultCategoriasReturn([]));

      render(<CategoriasPage />, { wrapper: createWrapper() });

      expect(screen.getByTestId("query-list-empty")).toBeVisible();
    });
  });

  describe("estado de erro", () => {
    it("deve exibir estado de erro quando a query falha", () => {
      const refetch = jest.fn();

      mockedUseCategoriasPaginacao.mockReturnValue(
        defaultCategoriasReturn([], {
          data: undefined,
          error: new Error("Falha ao buscar categorias"),
          isError: true,
          refetch,
        }),
      );

      render(<CategoriasPage />, { wrapper: createWrapper() });

      expect(screen.getByTestId("query-list-error")).toBeVisible();
      expect(screen.queryByTestId("tabela-categorias")).not.toBeInTheDocument();
    });
  });
});
