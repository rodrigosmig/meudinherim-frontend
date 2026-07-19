import React from "react";
import { render, screen } from "@/helpers/test/test-helper";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ContaAReceberForm from "../conta-a-receber-form";

// ── mocks ──────────────────────────────────────────────────────────────────

jest.mock("@/components/toast", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

jest.mock("@/hooks/use-categorias", () => ({
  useCategorias: () => ({
    categoriasEntrada: [
      { uuid: "cat-1", nome: "Salário" },
    ],
    isLoading: false,
  }),
}));

jest.mock("@/hooks/use-tags", () => ({
  useTags: () => ({ tagsOptions: [], isLoading: false }),
}));

jest.mock("@/hooks/use-conexoes", () => ({
  useConexoes: () => ({ data: [] }),
}));

jest.mock("@/components/primitives/select", () => ({
  Select: ({ label, options, onChange, value, disabled, isMulti }: any) =>
    isMulti ? null : (
      <select
        aria-label={label}
        value={value ?? ""}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Selecione</option>
        {options?.map((o: any) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    ),
}));

jest.mock("@/components/primitives/input-money", () => ({
  InputMoney: ({ label, value, onChange }: any) => (
    <input
      aria-label={label}
      type="number"
      value={value ?? ""}
      onChange={(e) => onChange(parseFloat(e.target.value) || null)}
    />
  ),
}));

jest.mock("@/components/primitives/input-date", () => ({
  __esModule: true,
  default: ({ label, onChange }: any) => (
    <input
      aria-label={label}
      type="date"
      defaultValue="2026-05-01"
      onChange={(e) => onChange(new Date(e.target.value + "T00:00:00"))}
    />
  ),
}));

jest.mock("@/services/contas-a-receber-service", () => ({
  contasAReceberService: { cadastrar: jest.fn(), alterar: jest.fn() },
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

describe("ContaAReceberForm - valor da parcela", () => {
  it("não deve exibir label de valor da parcela quando parcelado está desativado", async () => {
    const user = userEvent.setup();
    render(
      <ContaAReceberForm>
        <button type="button">Adicionar</button>
      </ContaAReceberForm>,
      { wrapper: createWrapper() },
    );

    await user.click(screen.getByRole("button", { name: "Adicionar" }));
    await user.type(screen.getByRole("spinbutton", { name: "Valor" }), "1000");

    expect(
      screen.queryByText(/Valor de cada parcela/),
    ).not.toBeInTheDocument();
  });

  it("deve exibir R$ 0,00 quando parcelado está ativo sem quantidade de parcelas", async () => {
    const user = userEvent.setup();
    render(
      <ContaAReceberForm>
        <button type="button">Adicionar</button>
      </ContaAReceberForm>,
      { wrapper: createWrapper() },
    );

    await user.click(screen.getByRole("button", { name: "Adicionar" }));
    await user.type(screen.getByRole("spinbutton", { name: "Valor" }), "1000");
    await user.click(screen.getByText("Parcelado"));

    expect(
      screen.getByText("Valor de cada parcela: R$ 0,00"),
    ).toBeVisible();
  });

  it("deve exibir o valor correto da parcela quando valor e quantidade são preenchidos", async () => {
    const user = userEvent.setup();
    render(
      <ContaAReceberForm>
        <button type="button">Adicionar</button>
      </ContaAReceberForm>,
      { wrapper: createWrapper() },
    );

    await user.click(screen.getByRole("button", { name: "Adicionar" }));
    await user.type(screen.getByRole("spinbutton", { name: "Valor" }), "1000");
    await user.click(screen.getByText("Parcelado"));

    const parcelasInput = screen.getByPlaceholderText("Informe o número de parcelas");
    await user.type(parcelasInput, "5");

    expect(
      screen.getByText("Valor de cada parcela: R$ 200,00"),
    ).toBeVisible();
  });
});
