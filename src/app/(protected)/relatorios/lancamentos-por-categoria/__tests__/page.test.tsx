import React from "react";
import { render, screen, waitFor, within } from "@/helpers/test/test-helper";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import LancamentosPorCategoriaPage from "../page";

jest.mock("next/navigation", () => ({
  useParams: () => ({}),
}));

jest.mock("@/hooks/use-configuracao-inicial", () => ({
  useConfiguracaoInicial: () => ({ data: { faturas: [] } }),
}));

jest.mock("@/hooks/use-contas", () => ({
  useContas: () => ({ contas: [] }),
}));

jest.mock("@/hooks/use-tags", () => ({
  useTags: () => ({ tagsOptions: [{ value: "tag-1", label: "tag-1" }] }),
}));

jest.mock("@/hooks/use-date-filter", () => ({
  useDateFilter: () => ({
    dateRange: undefined,
    stringDateUS: { from: "2026-11-01", to: "2026-11-30" },
    handleChangeDateFilter: jest.fn(),
    handleOnClickFilter: jest.fn(),
  }),
}));

jest.mock("@/components/filtro-por-periodo", () => ({
  __esModule: true,
  default: () => <div>Período</div>,
}));

jest.mock("@/components/header/responsive-page-title", () => ({
  __esModule: true,
  default: ({ title }: { title: string }) => <h1>{title}</h1>,
}));

jest.mock("@/components/primitives/select", () => {
  const MockSelect = ({
    options,
    value,
    onChange,
    isMulti,
    placeholder,
  }: any) => {
    const flat = options.flatMap((option: any) => option.options ?? [option]);

    if (isMulti) {
      return (
        <select
          aria-label={placeholder}
          multiple
          value={Array.isArray(value) ? value : []}
          onChange={(event) =>
            onChange?.(
              Array.from(
                event.target.selectedOptions,
                (option) => option.value,
              ),
            )
          }
        >
          {flat.map((option: any) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }

    return (
      <select
        aria-label={placeholder}
        value={typeof value === "string" ? value : ""}
        onChange={(event) => onChange?.(event.target.value)}
      >
        {flat.map((option: any) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  };

  return { Select: MockSelect };
});

const createReportResponse = (overrides: Record<string, unknown> = {}) => ({
  message: { codigo: 0, descricao: "Sucesso" },
  data: {
    entrada: [
      {
        idCategoria: "cat-1",
        nomeCategoria: "Salário",
        quantidade: 1,
        total: 1000,
      },
    ],
    saida: [
      {
        idCategoria: "cat-2",
        nomeCategoria: "Alimentação",
        quantidade: 2,
        total: 200,
      },
    ],
    totalEntradas: 1000,
    totalSaidas: 200,
    ...overrides,
  },
});

const fetchMock = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  fetchMock.mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => createReportResponse(),
  });
  global.fetch = fetchMock as unknown as typeof fetch;
});

function renderPage() {
  const client = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );

  return render(<LancamentosPorCategoriaPage />, { wrapper });
}

function fetchedUrls() {
  return fetchMock.mock.calls.map(([url]) => String(url));
}

async function waitForUrl(fragment: string) {
  await waitFor(() => {
    expect(fetchedUrls().some((url) => url.includes(fragment))).toBe(true);
  });
}

function getTotalFooter() {
  const label = screen.getByText("Total", { selector: "tfoot td" });

  return {
    label,
    row: label.closest("tr") as HTMLElement,
    tfoot: label.closest("tfoot") as HTMLElement,
  };
}

describe("LancamentosPorCategoriaPage - filtro de categorias", () => {
  it("deve iniciar o switch Apenas categorias dos relatórios ligado", async () => {
    renderPage();

    expect(
      screen.getByRole("switch", {
        name: "Apenas categorias dos relatórios",
      }),
    ).toBeChecked();

    await waitForUrl("apenasCategoriasExibidasEmRelatorios=true");
  });

  it("deve enviar apenasCategoriasExibidasEmRelatorios=true ao abrir", async () => {
    renderPage();

    await waitForUrl("apenasCategoriasExibidasEmRelatorios=true");
  });

  it("deve enviar apenasCategoriasExibidasEmRelatorios=false ao desligar o switch", async () => {
    const user = userEvent.setup();
    renderPage();
    await waitForUrl("apenasCategoriasExibidasEmRelatorios=true");

    await user.click(
      screen.getByRole("switch", {
        name: "Apenas categorias dos relatórios",
      }),
    );

    await waitForUrl("apenasCategoriasExibidasEmRelatorios=false");
  });

  it("deve enviar apenasCategoriasExibidasEmRelatorios=true ao ligar o switch novamente", async () => {
    const user = userEvent.setup();
    renderPage();
    await waitForUrl("apenasCategoriasExibidasEmRelatorios=true");

    const switchElement = screen.getByRole("switch", {
      name: "Apenas categorias dos relatórios",
    });

    await user.click(switchElement);
    await waitForUrl("apenasCategoriasExibidasEmRelatorios=false");

    await user.click(switchElement);

    await waitFor(() => {
      expect(
        fetchedUrls().filter((url) =>
          url.includes("apenasCategoriasExibidasEmRelatorios=true"),
        ).length,
      ).toBeGreaterThan(1);
    });
  });

  it("deve manter o filtro ao alterar o tipo do relatório", async () => {
    const user = userEvent.setup();
    renderPage();
    await waitForUrl("apenasCategoriasExibidasEmRelatorios=true");

    await user.click(
      screen.getByRole("switch", {
        name: "Apenas categorias dos relatórios",
      }),
    );
    await waitForUrl("apenasCategoriasExibidasEmRelatorios=false");

    await user.selectOptions(screen.getByDisplayValue("Todos"), "CONTA");

    await waitFor(() => {
      expect(
        fetchedUrls().some(
          (url) =>
            url.includes("tipo=CONTA") &&
            url.includes("apenasCategoriasExibidasEmRelatorios=false"),
        ),
      ).toBe(true);
    });
  });
});

describe("LancamentosPorCategoriaPage - totais por aba", () => {
  it("deve exibir totalEntradas no rodapé da aba Entrada", async () => {
    renderPage();
    await screen.findByText("Salário");

    const { row } = getTotalFooter();

    expect(within(row).getByText(/1\.000,00/)).toBeVisible();
  });

  it("deve exibir totalSaidas no rodapé da aba Saída", async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText("Salário");

    await user.click(screen.getByRole("button", { name: /Saída/ }));

    const { row } = getTotalFooter();

    expect(within(row).getByText(/200,00/)).toBeVisible();
  });

  it("deve renderizar o rodapé de total com destaque visual", async () => {
    renderPage();
    await screen.findByText("Salário");

    const { label, row, tfoot } = getTotalFooter();

    expect(tfoot).toHaveClass("bg-surface-muted", "border-t-2");
    expect(row).toHaveClass("font-bold");
    expect(label).toHaveClass("uppercase");
  });

  it("não deve renderizar rodapé quando a aba está vazia", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => createReportResponse({ entrada: [] }),
    });

    renderPage();

    await screen.findByText("Nenhum item encontrado.");
    expect(
      screen.queryByText("Total", { selector: "tfoot td" }),
    ).not.toBeInTheDocument();
  });

  it("deve exibir R$ 0,00 quando o total vier ausente", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => createReportResponse({ totalEntradas: undefined }),
    });

    renderPage();
    await screen.findByText("Salário");

    const { row } = getTotalFooter();

    expect(within(row).getByText(/0,00/)).toBeVisible();
  });
});
