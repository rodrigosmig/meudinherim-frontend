import { render, screen, waitFor } from "@/helpers/test/test-helper";
import { TipoCategoria } from "@/types/enum/tipo-categoria";
import { LancamentoConta } from "@/types/lancamento-conta";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import userEvent from "@testing-library/user-event";
import React from "react";

import LancamentosPage from "../page";

// ── mocks ──────────────────────────────────────────────────────────────────

jest.mock("next/navigation", () => ({
  useParams: () => ({ idConta: "conta-123" }),
  usePathname: () => "/contas-bancarias/conta-123/lancamentos",
  useSearchParams: () => ({ get: () => null, toString: () => "" }),
}));

jest.mock("@/components/toast", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

const mockedUseContas = jest.fn();
jest.mock("@/hooks/use-contas", () => ({
  useContas: () => mockedUseContas(),
}));

const mockedUseLancamentos = jest.fn();
jest.mock("@/hooks/use-lancamentos-conta-paginacao", () => ({
  useLancamentosContaPaginacao: (...args: unknown[]) =>
    mockedUseLancamentos(...args),
}));

const mockedUseDateFilter = jest.fn();
jest.mock("@/hooks/use-date-filter", () => ({
  useDateFilter: () => mockedUseDateFilter(),
}));

jest.mock("@/services/lancamento-conta-service", () => ({
  lancamentoContaService: { deletar: jest.fn() },
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
    if (isError)
      return <div data-testid="query-list-error">Erro ao carregar</div>;
    if (isEmpty)
      return <div data-testid="query-list-empty">Nenhum registro</div>;
    return <div data-testid="query-list-content">{children}</div>;
  },
}));

jest.mock(
  "@/app/(protected)/contas-bancarias/[idConta]/lancamentos/tabela-lancamentos-conta",
  () => ({
    __esModule: true,
    default: ({ lancamentos }: { lancamentos: LancamentoConta[] }) => (
      <div data-testid="tabela-lancamentos">
        {lancamentos.map((l) => (
          <span key={l.uuid} data-testid={`lancamento-${l.uuid}`}>
            {l.descricao}
          </span>
        ))}
      </div>
    ),
  }),
);

jest.mock(
  "@/app/(protected)/contas-bancarias/[idConta]/lancamentos/lancamento-conta-form",
  () => ({
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  }),
);

jest.mock("@/components/filtro-por-periodo", () => ({
  __esModule: true,
  default: ({ onClickFilter }: { onClickFilter: () => void }) => (
    <button onClick={onClickFilter}>Filtrar</button>
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

jest.mock("@/components/pagination", () => ({
  __esModule: true,
  default: () => <div data-testid="pagination" />,
}));

jest.mock("@/components/header/responsive-page-title", () => ({
  __esModule: true,
  default: ({
    title,
    metricValue,
  }: {
    title: string;
    metricValue: string;
  }) => (
    <div>
      <h1>{title}</h1>
      <span>{metricValue}</span>
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

const makeLancamento = (
  overrides: Partial<LancamentoConta> & { uuid: string },
): LancamentoConta => ({
  data: "2026-03-20",
  descricao: "Despesa",
  valor: 100,
  categoria: {
    uuid: "cat-1",
    descricao: "Alimentacao",
    tipo: TipoCategoria.SAIDA,
  },
  conta: { uuid: "conta-123", descricao: "Conta Principal" },
  tags: [],
  parcela: null as any,
  contaAgendada: null as any,
  ...overrides,
});

const paginacaoDefault = {
  paginaAtual: 1,
  ultimaPagina: 1,
  tamanhoPagina: 10,
  totalElementos: 1,
  doElemento: 1,
  paraElemento: 1,
};

const defaultLancamentosReturn = (
  conteudo: LancamentoConta[] = [],
  extra: Partial<{
    data: { pagina: { conteudo: LancamentoConta[]; paginacao: typeof paginacaoDefault } } | undefined;
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

// ── setup ──────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();

  mockedUseContas.mockReturnValue({
    contas: [{ uuid: "conta-123", nome: "Conta Principal", saldo: 2500 }],
    contasOptions: [{ value: "conta-123", label: "Conta Principal" }],
    isLoading: false,
    isFetching: false,
  });

  mockedUseDateFilter.mockReturnValue({
    dateRange: undefined,
    stringDateUS: { from: "2026-03-01", to: "2026-03-31" },
    handleChangeDateFilter: jest.fn(),
    handleOnClickFilter: jest.fn(),
  });

  mockedUseLancamentos.mockReturnValue(
    defaultLancamentosReturn([
      makeLancamento({ uuid: "lanc-1", descricao: "Supermercado" }),
    ]),
  );
});

// ── testes ─────────────────────────────────────────────────────────────────

describe("LancamentosPage", () => {
  describe("estado de carregamento", () => {
    it("deve exibir skeletons e não renderizar a tabela quando isLoading é true", () => {
      mockedUseContas.mockReturnValue({
        contas: [],
        contasOptions: [],
        isLoading: true,
        isFetching: true,
      });
      mockedUseLancamentos.mockReturnValue(
        defaultLancamentosReturn([], { isLoading: true }),
      );

      render(<LancamentosPage />, { wrapper: createWrapper() });

      expect(screen.getAllByTestId("skeleton").length).toBeGreaterThan(0);
      expect(screen.queryByTestId("tabela-lancamentos")).not.toBeInTheDocument();
    });
  });

  describe("estado carregado", () => {
    it("deve exibir o nome e saldo da conta", () => {
      render(<LancamentosPage />, { wrapper: createWrapper() });

      expect(
        screen.getByRole("heading", { name: "Conta Principal" }),
      ).toBeVisible();
      expect(screen.getByText(/R\$\s*2\.500,00/)).toBeVisible();
    });

    it("deve renderizar todos os lançamentos na tabela", () => {
      mockedUseLancamentos.mockReturnValue(
        defaultLancamentosReturn([
          makeLancamento({ uuid: "lanc-1", descricao: "Supermercado" }),
          makeLancamento({ uuid: "lanc-2", descricao: "Farmácia" }),
        ]),
      );

      render(<LancamentosPage />, { wrapper: createWrapper() });

      expect(screen.getByTestId("lancamento-lanc-1")).toBeVisible();
      expect(screen.getByTestId("lancamento-lanc-2")).toBeVisible();
    });

    it("deve renderizar estado vazio quando não há lançamentos", () => {
      mockedUseLancamentos.mockReturnValue(defaultLancamentosReturn([]));

      render(<LancamentosPage />, { wrapper: createWrapper() });

      expect(screen.getByTestId("query-list-empty")).toBeVisible();
    });

    it("deve renderizar estado de erro quando a query falha", () => {
      const refetch = jest.fn();

      mockedUseLancamentos.mockReturnValue(
        defaultLancamentosReturn([], {
          data: undefined,
          error: new Error("Falha ao buscar lançamentos"),
          isError: true,
          refetch,
        }),
      );

      render(<LancamentosPage />, { wrapper: createWrapper() });

      expect(screen.getByTestId("query-list-error")).toBeVisible();
      expect(screen.queryByTestId("tabela-lancamentos")).not.toBeInTheDocument();
      expect(screen.queryByTestId("pagination")).not.toBeInTheDocument();
    });
  });

  describe("busca e filtragem", () => {
    const lancamentos = [
      makeLancamento({ uuid: "lanc-1", descricao: "Supermercado" }),
      makeLancamento({ uuid: "lanc-2", descricao: "Farmácia" }),
      makeLancamento({
        uuid: "lanc-3",
        descricao: "Salário",
        categoria: {
          uuid: "cat-2",
          descricao: "Receita",
          tipo: TipoCategoria.ENTRADA,
        },
      }),
    ];

    beforeEach(() => {
      mockedUseLancamentos.mockReturnValue(defaultLancamentosReturn(lancamentos));
    });

    it("deve filtrar lançamentos por descrição", async () => {
      const user = userEvent.setup();
      render(<LancamentosPage />, { wrapper: createWrapper() });

      await user.type(screen.getByPlaceholderText("Pesquisar"), "super");

      expect(screen.getByTestId("lancamento-lanc-1")).toBeVisible();
      expect(screen.queryByTestId("lancamento-lanc-2")).not.toBeInTheDocument();
      expect(screen.queryByTestId("lancamento-lanc-3")).not.toBeInTheDocument();
    });

    it("deve filtrar lançamentos por categoria", async () => {
      const user = userEvent.setup();
      render(<LancamentosPage />, { wrapper: createWrapper() });

      await user.type(screen.getByPlaceholderText("Pesquisar"), "receita");

      expect(screen.getByTestId("lancamento-lanc-3")).toBeVisible();
      expect(screen.queryByTestId("lancamento-lanc-1")).not.toBeInTheDocument();
    });

    it("deve exibir todos os lançamentos ao limpar a busca", async () => {
      const user = userEvent.setup();
      render(<LancamentosPage />, { wrapper: createWrapper() });

      const input = screen.getByPlaceholderText("Pesquisar");
      await user.type(input, "super");
      await user.clear(input);

      expect(screen.getByTestId("lancamento-lanc-1")).toBeVisible();
      expect(screen.getByTestId("lancamento-lanc-2")).toBeVisible();
      expect(screen.getByTestId("lancamento-lanc-3")).toBeVisible();
    });

    it("deve exibir tabela vazia quando busca não encontra resultados", async () => {
      const user = userEvent.setup();
      render(<LancamentosPage />, { wrapper: createWrapper() });

      await user.type(screen.getByPlaceholderText("Pesquisar"), "xyzxyzxyz");

      expect(screen.getByTestId("query-list-empty")).toBeVisible();
    });
  });

  describe("paginação", () => {
    it("deve reiniciar para a página 1 e atualizar perPage ao mudar FiltroPorPagina", async () => {
      const user = userEvent.setup();
      render(<LancamentosPage />, { wrapper: createWrapper() });

      await user.selectOptions(
        screen.getByRole("combobox", { name: "Itens por página" }),
        "25",
      );

      await waitFor(() => {
        expect(mockedUseLancamentos).toHaveBeenCalledWith(
          "conta-123",
          1,
          25,
          "2026-03-01",
          "2026-03-31",
        );
      });
    });
  });
});
