import React from "react";
import { render, screen } from "@/helpers/test/test-helper";
import userEvent from "@testing-library/user-event";

import ConexoesPage from "../page";

// ── mocks ──────────────────────────────────────────────────────────────────

jest.mock("@/components/header/responsive-page-title", () => ({
  __esModule: true,
  default: ({ title }: { title: string }) => <h1>{title}</h1>,
}));

const mockUseConexoesPendentes = jest.fn();
jest.mock("@/hooks/use-conexoes-pendentes", () => ({
  useConexoesPendentes: () => mockUseConexoesPendentes(),
}));

jest.mock("../conexoes-tab", () => ({
  __esModule: true,
  default: ({ onBuscarContatos }: { onBuscarContatos: () => void }) => (
    <div data-testid="conexoes-tab">
      <button onClick={onBuscarContatos}>Buscar contatos</button>
    </div>
  ),
}));

jest.mock("../solicitacoes-pendentes-tab", () => ({
  __esModule: true,
  default: () => <div data-testid="solicitacoes-pendentes-tab">Solicitacoes Pendentes Tab</div>,
}));

jest.mock("../buscar-e-conectar-modal", () => ({
  __esModule: true,
  default: ({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) =>
    open ? (
      <div data-testid="buscar-e-conectar-modal">
        <button onClick={() => onOpenChange(false)}>Fechar modal</button>
      </div>
    ) : null,
}));

// ── helpers ────────────────────────────────────────────────────────────────

function mockPendentes(data: unknown[] = [], overrides: Record<string, unknown> = {}) {
  mockUseConexoesPendentes.mockReturnValue({
    data,
    isLoading: false,
    isError: false,
    refetch: jest.fn(),
    ...overrides,
  });
}

// ── setup ──────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
  mockPendentes();
});

// ── testes ─────────────────────────────────────────────────────────────────

describe("ConexoesPage", () => {
  it("deve renderizar o título 'Conexões'", () => {
    render(<ConexoesPage />);

    expect(screen.getByRole("heading", { name: "Conexões" })).toBeVisible();
  });

  it("deve renderizar a tab Minhas Conexões por padrão", () => {
    render(<ConexoesPage />);

    expect(screen.getByTestId("conexoes-tab")).toBeVisible();
    expect(screen.queryByTestId("solicitacoes-pendentes-tab")).not.toBeInTheDocument();
  });

  it("deve renderizar os botões Minhas Conexões e Solicitações", () => {
    render(<ConexoesPage />);

    expect(screen.getByText("Minhas Conexões")).toBeVisible();
    expect(screen.getByText("Solicitações")).toBeVisible();
  });

  it("deve alternar para a tab Solicitações ao clicar", async () => {
    const user = userEvent.setup();
    render(<ConexoesPage />);

    await user.click(screen.getByText("Solicitações"));

    expect(screen.getByTestId("solicitacoes-pendentes-tab")).toBeVisible();
    expect(screen.queryByTestId("conexoes-tab")).not.toBeInTheDocument();
  });

  it("deve voltar para a tab Minhas Conexões ao clicar novamente", async () => {
    const user = userEvent.setup();
    render(<ConexoesPage />);

    await user.click(screen.getByText("Solicitações"));
    await user.click(screen.getByText("Minhas Conexões"));

    expect(screen.getByTestId("conexoes-tab")).toBeVisible();
    expect(screen.queryByTestId("solicitacoes-pendentes-tab")).not.toBeInTheDocument();
  });

  it("deve exibir o contador de pendentes quando há solicitações", () => {
    mockPendentes([{ uuid: "conn-1" }, { uuid: "conn-2" }, { uuid: "conn-3" }]);

    render(<ConexoesPage />);

    expect(screen.getByText("3")).toBeVisible();
  });

  it("não deve exibir o contador quando não há pendentes", () => {
    mockPendentes([]);

    render(<ConexoesPage />);

    expect(screen.queryByText("0")).not.toBeInTheDocument();
  });

  it("deve abrir o modal de buscar ao clicar em Buscar contatos da tab conexoes", async () => {
    const user = userEvent.setup();
    render(<ConexoesPage />);

    await user.click(screen.getByRole("button", { name: "Buscar contatos" }));

    expect(screen.getByTestId("buscar-e-conectar-modal")).toBeVisible();
  });
});
