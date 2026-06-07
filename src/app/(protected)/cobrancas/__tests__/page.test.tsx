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

jest.mock("../cobrancas-recebidas-tab", () => ({
  __esModule: true,
  default: () => <div data-testid="recebidas-tab">Recebidas Tab</div>,
}));

jest.mock("../cobrancas-emitidas-tab", () => ({
  __esModule: true,
  default: () => <div data-testid="emitidas-tab">Emitidas Tab</div>,
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
  it("deve renderizar o título 'Cobranças'", () => {
    render(<CobrancasPage />, { wrapper: createWrapper() });

    expect(screen.getByRole("heading", { name: "Cobranças" })).toBeVisible();
  });

  it("deve renderizar a tab recebidas por padrão", () => {
    render(<CobrancasPage />, { wrapper: createWrapper() });

    expect(screen.getByTestId("recebidas-tab")).toBeVisible();
    expect(screen.queryByTestId("emitidas-tab")).not.toBeInTheDocument();
  });

  it("deve renderizar os botões das tabs Recebidas e Emitidas", () => {
    render(<CobrancasPage />, { wrapper: createWrapper() });

    expect(screen.getByRole("button", { name: "Recebidas" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Emitidas" })).toBeVisible();
  });

  it("deve alternar para a tab emitidas ao clicar no botão Emitidas", async () => {
    const user = userEvent.setup();
    render(<CobrancasPage />, { wrapper: createWrapper() });

    await user.click(screen.getByRole("button", { name: "Emitidas" }));

    expect(screen.getByTestId("emitidas-tab")).toBeVisible();
    expect(screen.queryByTestId("recebidas-tab")).not.toBeInTheDocument();
  });

  it("deve voltar para a tab recebidas ao clicar novamente", async () => {
    const user = userEvent.setup();
    render(<CobrancasPage />, { wrapper: createWrapper() });

    await user.click(screen.getByRole("button", { name: "Emitidas" }));
    await user.click(screen.getByRole("button", { name: "Recebidas" }));

    expect(screen.getByTestId("recebidas-tab")).toBeVisible();
    expect(screen.queryByTestId("emitidas-tab")).not.toBeInTheDocument();
  });
});
