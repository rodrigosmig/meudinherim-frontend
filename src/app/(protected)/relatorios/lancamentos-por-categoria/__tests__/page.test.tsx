import React from "react";
import { act, fireEvent, render, screen, waitFor, within } from "@/helpers/test/test-helper";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import LancamentosPorCategoriaPage from "../page";

jest.mock("next/navigation", () => ({
  useParams: () => ({}),
}));

jest.mock("@/hooks/use-configuracao-inicial", () => ({
  useConfiguracaoInicial: () => ({
    data: {
      faturas: [{ cartao: { uuid: "cartao-1", descricao: "Cartão" } }],
    },
  }),
}));

jest.mock("@/hooks/use-contas", () => ({
  useContas: () => ({
    contas: [{ uuid: "conta-1", nome: "Conta Corrente" }],
  }),
}));

jest.mock("@/hooks/use-tags", () => ({
  useTags: () => ({ tagsOptions: [{ value: "tag-1", label: "tag-1" }] }),
}));

jest.mock("@/hooks/use-date-filter", () => {
  const React = require("react");
  let updateDates: ((dates: { from: string; to: string }) => void) | null = null;

  return {
    useDateFilter: () => {
      const [stringDateUS, setStringDateUS] = React.useState({
        from: "2026-11-01",
        to: "2026-11-30",
      });
      updateDates = setStringDateUS;

      return {
        dateRange: undefined,
        stringDateUS,
        handleChangeDateFilter: jest.fn(),
        handleOnClickFilter: jest.fn(),
      };
    },
    __updateDates: (dates: { from: string; to: string }) => updateDates?.(dates),
  };
});

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

const { __updateDates } = jest.requireMock("@/hooks/use-date-filter");

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
    totalEntradas: 1750,
    totalSaidas: 2300,
    ...overrides,
  },
});

const createDetalhesResponse = () => ({
  message: { codigo: 0, descricao: "Sucesso" },
  data: { lancamentos: [] },
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

    await user.selectOptions(screen.getByDisplayValue("Todos"), "CONTA");

    await waitFor(() => {
      expect(
        fetchedUrls().some(
          (url) =>
            url.includes("tipo=CONTA") &&
            url.includes("apenasCategoriasExibidasEmRelatorios=true"),
        ),
      ).toBe(true);
    });
  });

  it("deve manter o filtro ao alterar a conta", async () => {
    const user = userEvent.setup();
    renderPage();
    await waitForUrl("apenasCategoriasExibidasEmRelatorios=true");

    await user.selectOptions(screen.getByDisplayValue("Todos"), "CONTA");
    await user.selectOptions(
      screen.getByDisplayValue("Todas as Contas"),
      "conta-1",
    );

    await waitFor(() => {
      expect(
        fetchedUrls().some(
          (url) =>
            url.includes("uuid=conta-1") &&
            url.includes("apenasCategoriasExibidasEmRelatorios=true"),
        ),
      ).toBe(true);
    });
  });

  it("deve manter o filtro ao alterar o cartão", async () => {
    const user = userEvent.setup();
    renderPage();
    await waitForUrl("apenasCategoriasExibidasEmRelatorios=true");

    await user.selectOptions(screen.getByDisplayValue("Todos"), "CARTAO");
    await user.selectOptions(
      screen.getByDisplayValue("Todos os Cartões"),
      "cartao-1",
    );

    await waitFor(() => {
      expect(
        fetchedUrls().some(
          (url) =>
            url.includes("uuid=cartao-1") &&
            url.includes("apenasCategoriasExibidasEmRelatorios=true"),
        ),
      ).toBe(true);
    });
  });

  it("deve manter o filtro ao alterar os tags", async () => {
    const user = userEvent.setup();
    renderPage();
    await waitForUrl("apenasCategoriasExibidasEmRelatorios=true");

    await user.selectOptions(screen.getByLabelText("Tags..."), "tag-1");

    await waitFor(() => {
      expect(
        fetchedUrls().some(
          (url) =>
            url.includes("tags=tag-1") &&
            url.includes("apenasCategoriasExibidasEmRelatorios=true"),
        ),
      ).toBe(true);
    });
  });

  it("deve manter o filtro ao alterar o período", async () => {
    renderPage();
    await waitForUrl("apenasCategoriasExibidasEmRelatorios=true");

    act(() => {
      __updateDates({ from: "2026-12-01", to: "2026-12-31" });
    });

    await waitFor(() => {
      expect(
        fetchedUrls().some(
          (url) =>
            url.includes("inicio=2026-12-01") &&
            url.includes("apenasCategoriasExibidasEmRelatorios=true"),
        ),
      ).toBe(true);
    });
  });

  it("deve manter o filtro desligado ao alterar o tipo do relatório", async () => {
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

    expect(within(row).getByText(/R\$\s*1\.750,00/)).toBeVisible();
  });

  it("deve exibir totalSaidas no rodapé da aba Saída", async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText("Salário");

    await user.click(screen.getByRole("button", { name: /Saída/ }));

    const { row } = getTotalFooter();

    expect(within(row).getByText(/R\$\s*2\.300,00/)).toBeVisible();
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

    expect(within(row).getByText(/R\$\s*0,00/)).toBeVisible();
  });
});

describe("LancamentosPorCategoriaPage - estados e detalhes", () => {
  it("deve exibir o skeleton e não renderizar rodapé durante o carregamento", () => {
    fetchMock.mockReturnValueOnce(new Promise(() => {}));

    renderPage();

    expect(document.querySelector(".animate-shimmer")).toBeInTheDocument();
    expect(
      screen.queryByText("Total", { selector: "tfoot td" }),
    ).not.toBeInTheDocument();
  });

  it("não deve renderizar rodapé quando o relatório falha", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({
        message: { codigo: 500, descricao: "Erro interno" },
      }),
    });

    renderPage();

    expect(
      await screen.findByText("Falha ao carregar o relatório. Tente novamente."),
    ).toBeVisible();
    expect(
      screen.queryByText("Total", { selector: "tfoot td" }),
    ).not.toBeInTheDocument();
  });

  it("não deve enviar o filtro na requisição de detalhes", async () => {
    const user = userEvent.setup();
    fetchMock.mockImplementation((url: string) => {
      if (String(url).includes("/detalhes")) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => createDetalhesResponse(),
        });
      }

      return Promise.resolve({
        ok: true,
        status: 200,
        json: async () => createReportResponse(),
      });
    });

    renderPage();
    await screen.findByText("Salário");

    await user.click(screen.getByRole("button", { name: "1" }));
    await waitFor(() => {
      expect(fetchedUrls().some((url) => url.includes("/detalhes"))).toBe(true);
    });

    fireEvent.click(
      screen.getByRole("switch", {
        name: "Apenas categorias dos relatórios",
        hidden: true,
      }),
    );
    await waitForUrl("apenasCategoriasExibidasEmRelatorios=false");

    const detalhesUrls = fetchedUrls().filter((url) =>
      url.includes("/detalhes"),
    );

    expect(detalhesUrls.length).toBeGreaterThan(0);
    detalhesUrls.forEach((url) => {
      expect(url).not.toContain("apenasCategoriasExibidasEmRelatorios");
    });
  });
});
