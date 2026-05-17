import React from "react";
import { render, screen, waitFor } from "@/helpers/test/test-helper";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toast } from "@/components/toast";
import type { Orcamento } from "@/types/orcamento";
import OrcamentoForm from "../orcamento-form";

// ── mocks ──────────────────────────────────────────────────────────────────

jest.mock("@/components/toast", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

jest.mock("@/hooks/use-categorias", () => ({
  useCategorias: () => ({
    categoriasSaida: [
      { uuid: "cat-1", nome: "Alimentação" },
      { uuid: "cat-2", nome: "Transporte" },
    ],
    isLoading: false,
  }),
}));

jest.mock("@/components/primitives/select", () => ({
  Select: ({ label, options, onChange, value, disabled }: any) => (
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

jest.mock("@/services/orcamentos-service", () => ({
  orcamentoService: { cadastrar: jest.fn(), alterar: jest.fn() },
}));

// ── helpers ────────────────────────────────────────────────────────────────

const { orcamentoService } = jest.requireMock("@/services/orcamentos-service");

const createWrapper = () => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
};

const orcamentoMock: Orcamento = {
  uuid: "orc-1",
  valor: 2000,
  categoria: { uuid: "cat-1", descricao: "Alimentação" },
};

// ── setup ──────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
});

// ── testes ─────────────────────────────────────────────────────────────────

describe("OrcamentoForm", () => {
  describe("modo adicionar", () => {
    it("deve renderizar o formulário ao clicar no trigger", async () => {
      const user = userEvent.setup();
      render(
        <OrcamentoForm>
          <button type="button">Adicionar</button>
        </OrcamentoForm>,
        { wrapper: createWrapper() },
      );

      await user.click(screen.getByRole("button", { name: "Adicionar" }));

      expect(screen.getByRole("dialog", { name: "Adicionar orçamento" })).toBeVisible();
      expect(screen.getByRole("combobox", { name: "Categoria" })).toBeVisible();
      expect(screen.getByRole("spinbutton", { name: "Valor" })).toBeVisible();
    });

    it("deve fechar ao clicar em Cancelar", async () => {
      const user = userEvent.setup();
      render(
        <OrcamentoForm>
          <button type="button">Adicionar</button>
        </OrcamentoForm>,
        { wrapper: createWrapper() },
      );

      await user.click(screen.getByRole("button", { name: "Adicionar" }));
      await user.click(screen.getByRole("button", { name: "Cancelar" }));

      expect(
        screen.queryByRole("dialog", { name: "Adicionar orçamento" }),
      ).not.toBeInTheDocument();
    });

    it("deve chamar cadastrar e exibir toast de sucesso ao submeter", async () => {
      orcamentoService.cadastrar.mockResolvedValueOnce(undefined);
      const user = userEvent.setup();
      render(
        <OrcamentoForm>
          <button type="button">Adicionar</button>
        </OrcamentoForm>,
        { wrapper: createWrapper() },
      );

      await user.click(screen.getByRole("button", { name: "Adicionar" }));
      await user.selectOptions(screen.getByRole("combobox", { name: "Categoria" }), "cat-1");
      await user.type(screen.getByRole("spinbutton", { name: "Valor" }), "1500");
      await user.click(screen.getByRole("button", { name: "Salvar" }));

      await waitFor(() => {
        expect(orcamentoService.cadastrar).toHaveBeenCalledWith({
          idCategoria: "cat-1",
          valor: 1500,
        });
        expect(toast.success).toHaveBeenCalledWith("Orçamento cadastrado com sucesso!");
      });
    });
  });

  describe("modo editar", () => {
    it("deve renderizar o título de edição", async () => {
      const user = userEvent.setup();
      render(
        <OrcamentoForm orcamento={orcamentoMock}>
          <button type="button">Editar</button>
        </OrcamentoForm>,
        { wrapper: createWrapper() },
      );

      await user.click(screen.getByRole("button", { name: "Editar" }));

      expect(screen.getByRole("dialog", { name: "Editar orçamento" })).toBeVisible();
    });

    it("deve pré-preencher o valor no modo edição", async () => {
      const user = userEvent.setup();
      render(
        <OrcamentoForm orcamento={orcamentoMock}>
          <button type="button">Editar</button>
        </OrcamentoForm>,
        { wrapper: createWrapper() },
      );

      await user.click(screen.getByRole("button", { name: "Editar" }));

      expect(screen.getByRole("spinbutton", { name: "Valor" })).toHaveValue(2000);
    });

    it("deve chamar alterar e exibir toast de sucesso ao submeter", async () => {
      orcamentoService.alterar.mockResolvedValueOnce(undefined);
      const user = userEvent.setup();
      render(
        <OrcamentoForm orcamento={orcamentoMock}>
          <button type="button">Editar</button>
        </OrcamentoForm>,
        { wrapper: createWrapper() },
      );

      await user.click(screen.getByRole("button", { name: "Editar" }));
      await user.click(screen.getByRole("button", { name: "Salvar" }));

      await waitFor(() => {
        expect(orcamentoService.alterar).toHaveBeenCalledWith("orc-1", {
          idCategoria: "cat-1",
          valor: 2000,
        });
        expect(toast.success).toHaveBeenCalledWith("Orçamento alterado com sucesso!");
      });
    });
  });

  describe("modo controlado (open/onOpenChange)", () => {
    it("deve abrir ao receber open=true", () => {
      const onOpenChange = jest.fn();
      render(<OrcamentoForm open={true} onOpenChange={onOpenChange} />, {
        wrapper: createWrapper(),
      });

      expect(screen.getByRole("dialog", { name: "Adicionar orçamento" })).toBeVisible();
    });

    it("não deve exibir dialog quando open=false", () => {
      render(<OrcamentoForm open={false} onOpenChange={jest.fn()} />, {
        wrapper: createWrapper(),
      });

      expect(
        screen.queryByRole("dialog", { name: "Adicionar orçamento" }),
      ).not.toBeInTheDocument();
    });
  });
});
