import React from "react";
import { render, screen, waitFor } from "@/helpers/test/test-helper";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Conta } from "@/types/contas";
import { Status } from "@/types/enum/status";
import { TipoConta } from "@/types/enum/tipo-conta";

import ContasPage from "../page";

// ── mocks ──────────────────────────────────────────────────────────────────

jest.mock("@/components/toast", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

const mockedUseContasPaginacao = jest.fn();
jest.mock("@/hooks/use-contas-paginacao", () => ({
  useContasPaginacao: (...args: unknown[]) => mockedUseContasPaginacao(...args),
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
  default: ({ title, metricValue }: { title: string; metricValue?: string }) => (
    <div>
      <h1>{title}</h1>
      {metricValue && <span>{metricValue}</span>}
    </div>
  ),
}));

jest.mock("../tabela-contas", () => ({
  __esModule: true,
  default: ({ contas }: { contas: Conta[] }) => (
    <div data-testid="tabela-contas">
      {contas.map((c) => (
        <span key={c.uuid} data-testid={`conta-${c.uuid}`}>
          {c.nome}
        </span>
      ))}
    </div>
  ),
}));

jest.mock("../conta-form", () => ({
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

const makeContasReturn = (
  conteudo: Conta[] = [],
  extra: Partial<{
    isLoading: boolean;
    isError: boolean;
    isFetching: boolean;
    error: unknown;
    data: any;
    refetch: jest.Mock;
  }> = {},
) => ({
  data: { pagina: { conteudo, paginacao: { paginaAtual: 1, ultimaPagina: 1, tamanhoPagina: 10, totalElementos: conteudo.length, doElemento: 1, paraElemento: conteudo.length } } },
  error: null,
  isError: false,
  isLoading: false,
  isFetching: false,
  refetch: jest.fn(),
  ...extra,
});

const makeConta = (overrides: Partial<Conta> & { uuid: string }): Conta => ({
  nome: "Conta Teste",
  tipo: TipoConta.CONTA_CORRENTE,
  status: Status.ATIVO,
  icon: "",
  saldo: 0,
  ...overrides,
});

// ── setup ──────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
  mockedUseContasPaginacao.mockReturnValue(
    makeContasReturn([makeConta({ uuid: "conta-1", nome: "Conta Principal", saldo: 1500 })]),
  );
});

// ── testes ─────────────────────────────────────────────────────────────────

describe("ContasPage", () => {
  describe("estado de carregamento", () => {
    it("deve exibir skeletons e não renderizar a tabela quando isLoading é true", () => {
      mockedUseContasPaginacao.mockReturnValue(
        makeContasReturn([], { isLoading: true }),
      );

      render(<ContasPage />, { wrapper: createWrapper() });

      expect(screen.getAllByTestId("skeleton").length).toBeGreaterThan(0);
      expect(screen.queryByTestId("tabela-contas")).not.toBeInTheDocument();
    });
  });

  describe("estado carregado", () => {
    it("deve exibir o título 'Contas Bancárias'", () => {
      render(<ContasPage />, { wrapper: createWrapper() });

      expect(screen.getByRole("heading", { name: "Contas Bancárias" })).toBeVisible();
    });

    it("deve exibir o saldo total das contas", () => {
      mockedUseContasPaginacao.mockReturnValue(
        makeContasReturn([
          makeConta({ uuid: "conta-1", saldo: 1000 }),
          makeConta({ uuid: "conta-2", saldo: 500 }),
        ]),
      );

      render(<ContasPage />, { wrapper: createWrapper() });

      expect(screen.getByText(/1\.500,00/)).toBeVisible();
    });

    it("deve renderizar a tabela com as contas", () => {
      render(<ContasPage />, { wrapper: createWrapper() });

      expect(screen.getByTestId("tabela-contas")).toBeVisible();
      expect(screen.getByTestId("conta-conta-1")).toBeVisible();
    });

    it("deve renderizar o botão Adicionar", () => {
      render(<ContasPage />, { wrapper: createWrapper() });

      expect(screen.getByRole("button", { name: /adicionar/i })).toBeVisible();
    });

    it("deve exibir estado vazio quando não há contas", () => {
      mockedUseContasPaginacao.mockReturnValue(makeContasReturn([]));

      render(<ContasPage />, { wrapper: createWrapper() });

      expect(screen.getByTestId("query-list-empty")).toBeVisible();
    });

    it("deve exibir estado de erro quando a query falha", () => {
      mockedUseContasPaginacao.mockReturnValue(
        makeContasReturn([], {
          data: undefined,
          isError: true,
          error: new Error("falha"),
        }),
      );

      render(<ContasPage />, { wrapper: createWrapper() });

      expect(screen.getByTestId("query-list-error")).toBeVisible();
      expect(screen.queryByTestId("tabela-contas")).not.toBeInTheDocument();
    });
  });

  describe("busca e filtragem", () => {
    beforeEach(() => {
      mockedUseContasPaginacao.mockReturnValue(
        makeContasReturn([
          makeConta({ uuid: "conta-1", nome: "Conta Corrente Inter" }),
          makeConta({ uuid: "conta-2", nome: "Poupança Nubank" }),
        ]),
      );
    });

    it("deve filtrar contas por nome", async () => {
      const user = userEvent.setup();
      render(<ContasPage />, { wrapper: createWrapper() });

      await user.type(screen.getByPlaceholderText("Pesquisar"), "inter");

      expect(screen.getByTestId("conta-conta-1")).toBeVisible();
      expect(screen.queryByTestId("conta-conta-2")).not.toBeInTheDocument();
    });

    it("deve exibir todas as contas ao limpar a busca", async () => {
      const user = userEvent.setup();
      render(<ContasPage />, { wrapper: createWrapper() });

      const input = screen.getByPlaceholderText("Pesquisar");
      await user.type(input, "inter");
      await user.clear(input);

      expect(screen.getByTestId("conta-conta-1")).toBeVisible();
      expect(screen.getByTestId("conta-conta-2")).toBeVisible();
    });

    it("deve exibir estado vazio quando busca não encontra resultados", async () => {
      const user = userEvent.setup();
      render(<ContasPage />, { wrapper: createWrapper() });

      await user.type(screen.getByPlaceholderText("Pesquisar"), "xyzxyzxyz");

      expect(screen.getByTestId("query-list-empty")).toBeVisible();
    });
  });

  describe("paginação", () => {
    it("deve reiniciar para a página 1 ao mudar perPage", async () => {
      const user = userEvent.setup();
      render(<ContasPage />, { wrapper: createWrapper() });

      await user.selectOptions(
        screen.getByRole("combobox", { name: "Itens por página" }),
        "25",
      );

      await waitFor(() => {
        expect(mockedUseContasPaginacao).toHaveBeenCalledWith(
          1,
          25,
          Status.ATIVO,
        );
      });
    });

    it("deve filtrar por status ao mudar o Select de status", async () => {
      const user = userEvent.setup();
      render(<ContasPage />, { wrapper: createWrapper() });

      await user.selectOptions(
        screen.getByRole("combobox", { name: "Status" }),
        Status.INATIVO,
      );

      await waitFor(() => {
        expect(mockedUseContasPaginacao).toHaveBeenCalledWith(
          1,
          expect.any(Number),
          Status.INATIVO,
        );
      });
    });
  });
});
