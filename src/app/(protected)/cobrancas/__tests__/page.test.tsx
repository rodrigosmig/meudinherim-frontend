import React from "react";
import { render, screen } from "@/helpers/test/test-helper";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import CobrancasPage from "../page";

// ── mocks ──────────────────────────────────────────────────────────────────

jest.mock("@/components/header/responsive-page-title", () => ({
  __esModule: true,
  default: ({ title }: { title: string }) => <h1>{title}</h1>,
}));

jest.mock("@/hooks/use-date-filter", () => ({
  useDateFilter: () => ({
    dateRange: undefined,
    stringDateUS: { from: undefined, to: undefined },
    stringDateBR: { from: "", to: "" },
    handleChangeDateFilter: jest.fn(),
    handleOnClickFilter: jest.fn(),
  }),
}));

jest.mock("@/components/filtro-por-periodo", () => ({
  __esModule: true,
  default: () => <div data-testid="filtro-por-periodo">FiltroPeríodo</div>,
}));

jest.mock("@/components/filtro-por-pagina", () => ({
  __esModule: true,
  default: ({ value, onChange }: { value: number; onChange: (v: number) => void }) => (
    <select
      data-testid="filtro-por-pagina"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
    >
      <option value="10">10</option>
      <option value="25">25</option>
    </select>
  ),
}));

jest.mock("@/components/primitives/select", () => ({
  Select: ({
    options,
    value,
    onChange,
    placeholder,
  }: {
    options: { value: string; label: string }[];
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
  }) => (
    <select
      data-testid="status-select"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={placeholder}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  ),
}));

jest.mock("../cobrancas-recebidas-tab", () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => (
    <div data-testid="recebidas-tab" data-props={JSON.stringify(props)}>
      Recebidas Tab
    </div>
  ),
}));

jest.mock("../cobrancas-emitidas-tab", () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => (
    <div data-testid="emitidas-tab" data-props={JSON.stringify(props)}>
      Emitidas Tab
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

// ── setup ──────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
});

// ── testes ─────────────────────────────────────────────────────────────────

describe("CobrancasPage", () => {
  describe("renderização", () => {
    it("deve renderizar o título 'Cobranças'", () => {
      render(<CobrancasPage />, { wrapper: createWrapper() });

      expect(screen.getByRole("heading", { name: "Cobranças" })).toBeVisible();
    });

    it("deve renderizar a tab recebidas por padrão", () => {
      render(<CobrancasPage />, { wrapper: createWrapper() });

      expect(screen.getByTestId("recebidas-tab")).toBeVisible();
      expect(screen.queryByTestId("emitidas-tab")).not.toBeInTheDocument();
    });

    it("deve renderizar os botões das tabs", () => {
      render(<CobrancasPage />, { wrapper: createWrapper() });

      expect(screen.getByRole("button", { name: "Recebidas" })).toBeVisible();
      expect(screen.getByRole("button", { name: "Emitidas" })).toBeVisible();
    });

    it("deve renderizar os filtros", () => {
      render(<CobrancasPage />, { wrapper: createWrapper() });

      expect(screen.getByTestId("filtro-por-periodo")).toBeVisible();
      expect(screen.getByTestId("status-select")).toBeVisible();
      expect(screen.getByTestId("filtro-por-pagina")).toBeVisible();
    });
  });

  describe("navegação entre tabs", () => {
    it("deve alternar para a tab emitidas", async () => {
      const user = userEvent.setup();
      render(<CobrancasPage />, { wrapper: createWrapper() });

      await user.click(screen.getByRole("button", { name: "Emitidas" }));

      expect(screen.getByTestId("emitidas-tab")).toBeVisible();
      expect(screen.queryByTestId("recebidas-tab")).not.toBeInTheDocument();
    });

    it("deve voltar para a tab recebidas", async () => {
      const user = userEvent.setup();
      render(<CobrancasPage />, { wrapper: createWrapper() });

      await user.click(screen.getByRole("button", { name: "Emitidas" }));
      await user.click(screen.getByRole("button", { name: "Recebidas" }));

      expect(screen.getByTestId("recebidas-tab")).toBeVisible();
      expect(screen.queryByTestId("emitidas-tab")).not.toBeInTheDocument();
    });
  });

  describe("filtro de status", () => {
    it("deve ter ABERTO como valor padrão do filtro de status", () => {
      render(<CobrancasPage />, { wrapper: createWrapper() });

      const select = screen.getByTestId("status-select") as HTMLSelectElement;
      expect(select.value).toBe("ABERTO");
    });

    it("deve ter opções ABERTO, PAGO e CANCELADA", () => {
      render(<CobrancasPage />, { wrapper: createWrapper() });

      expect(screen.getByText("Abertas")).toBeVisible();
      expect(screen.getByText("Pagas")).toBeVisible();
      expect(screen.getByText("Canceladas")).toBeVisible();
    });
  });
});
