import React from "react";
import { render, screen, waitFor } from "@/helpers/test/test-helper";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toast } from "@/components/toast";
import type { LancamentoCartao } from "@/types/lancamento-cartao";
import { TipoCategoria } from "@/types/enum/tipo-categoria";
import { StatusParcela } from "@/types/enum/status-parcela";
import LancamentoCartaoForm from "../lancamento-cartao-form";

// ── mocks ──────────────────────────────────────────────────────────────────

jest.mock("@/components/toast", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

jest.mock("next/navigation", () => ({
  useParams: () => ({}),
}));

jest.mock("@/hooks/use-configuracao-inicial", () => ({
  useConfiguracaoInicial: () => ({
    data: {
      faturas: [
        { uuid: "fatura-1", cartao: { uuid: "cartao-1", descricao: "Nubank" } },
        { uuid: "fatura-2", cartao: { uuid: "cartao-2", descricao: "Itaú" } },
      ],
    },
  }),
}));

jest.mock("@/hooks/use-categorias", () => ({
  useCategorias: () => ({
    categoriasOptions: [
      { value: "cat-1", label: "Alimentação" },
      { value: "cat-2", label: "Transporte" },
    ],
    isLoading: false,
  }),
}));

jest.mock("@/hooks/use-tags", () => ({
  useTags: () => ({ tagsOptions: [], isLoading: false }),
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

jest.mock("@/services/lancamento-cartao-service", () => ({
  lancamentoCartaoService: { cadastrar: jest.fn(), alterar: jest.fn() },
}));

// ── helpers ────────────────────────────────────────────────────────────────

const { lancamentoCartaoService } = jest.requireMock("@/services/lancamento-cartao-service");

const createWrapper = () => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
};

const lancamentoMock: LancamentoCartao = {
  uuid: "lanc-1",
  data: "2026-05-01",
  descricao: "Supermercado",
  valor: 250,
  categoria: { uuid: "cat-1", descricao: "Alimentação", tipo: TipoCategoria.SAIDA },
  isParcelado: false,
  parcelas: [
    {
      data: "2026-05-01",
      descricao: "Supermercado",
      numeroDaParcela: 1,
      totalDeParcelas: 1,
      valorDaParcela: 250,
      valorLancamento: 250,
      idParcela: "lanc-1",
      idLancamento: "lanc-1",
      idContaAgendada: null,
      idFatura: "fatura-1",
      status: StatusParcela.PAGO,
    },
  ],
  idFatura: "fatura-1",
  tags: [],
};

// ── setup ──────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
});

// ── testes ─────────────────────────────────────────────────────────────────

describe("LancamentoCartaoForm", () => {
  describe("modo adicionar (sem route param)", () => {
    it("deve renderizar o formulário ao clicar no trigger", async () => {
      const user = userEvent.setup();
      render(
        <LancamentoCartaoForm>
          <button type="button">Adicionar</button>
        </LancamentoCartaoForm>,
        { wrapper: createWrapper() },
      );

      await user.click(screen.getByRole("button", { name: "Adicionar" }));

      expect(screen.getByRole("dialog", { name: "Adicionar lançamento" })).toBeVisible();
    });

    it("deve exibir dropdown de cartão habilitado no modo adicionar", async () => {
      const user = userEvent.setup();
      render(
        <LancamentoCartaoForm>
          <button type="button">Adicionar</button>
        </LancamentoCartaoForm>,
        { wrapper: createWrapper() },
      );

      await user.click(screen.getByRole("button", { name: "Adicionar" }));

      const cartaoSelect = screen.getByRole("combobox", { name: "Cartão" });
      expect(cartaoSelect).not.toBeDisabled();
      expect(cartaoSelect).toBeVisible();
    });

    it("deve exibir os cartões disponíveis no dropdown", async () => {
      const user = userEvent.setup();
      render(
        <LancamentoCartaoForm>
          <button type="button">Adicionar</button>
        </LancamentoCartaoForm>,
        { wrapper: createWrapper() },
      );

      await user.click(screen.getByRole("button", { name: "Adicionar" }));

      const cartaoSelect = screen.getByRole("combobox", { name: "Cartão" });
      expect(cartaoSelect).toContainElement(screen.getByText("Nubank"));
      expect(cartaoSelect).toContainElement(screen.getByText("Itaú"));
    });

    it("deve fechar ao clicar em Cancelar", async () => {
      const user = userEvent.setup();
      render(
        <LancamentoCartaoForm>
          <button type="button">Adicionar</button>
        </LancamentoCartaoForm>,
        { wrapper: createWrapper() },
      );

      await user.click(screen.getByRole("button", { name: "Adicionar" }));
      await user.click(screen.getByRole("button", { name: "Cancelar" }));

      expect(
        screen.queryByRole("dialog", { name: "Adicionar lançamento" }),
      ).not.toBeInTheDocument();
    });

    it("deve chamar cadastrar e exibir toast ao submeter dados válidos", async () => {
      lancamentoCartaoService.cadastrar.mockResolvedValueOnce(undefined);
      const user = userEvent.setup();
      render(
        <LancamentoCartaoForm>
          <button type="button">Adicionar</button>
        </LancamentoCartaoForm>,
        { wrapper: createWrapper() },
      );

      await user.click(screen.getByRole("button", { name: "Adicionar" }));
      await user.selectOptions(screen.getByRole("combobox", { name: "Cartão" }), "cartao-1");
      await user.selectOptions(screen.getByRole("combobox", { name: "Categoria" }), "cat-1");
      await user.type(screen.getByRole("textbox", { name: "Descrição" }), "Supermercado");
      await user.type(screen.getByRole("spinbutton", { name: "Valor" }), "350");
      await user.click(screen.getByRole("button", { name: "Salvar" }));

      await waitFor(() => {
        expect(lancamentoCartaoService.cadastrar).toHaveBeenCalled();
        expect(toast.success).toHaveBeenCalledWith("Lançamento cadastrado com sucesso!");
      });
    });
  });

  describe("modo editar", () => {
    it("deve exibir título de edição", async () => {
      const user = userEvent.setup();
      render(
        <LancamentoCartaoForm lancamentoCartao={lancamentoMock}>
          <button type="button">Editar</button>
        </LancamentoCartaoForm>,
        { wrapper: createWrapper() },
      );

      await user.click(screen.getByRole("button", { name: "Editar" }));

      expect(screen.getByRole("dialog", { name: "Editar lançamento" })).toBeVisible();
    });

    it("deve exibir dropdown de cartão desabilitado no modo editar", async () => {
      const user = userEvent.setup();
      render(
        <LancamentoCartaoForm lancamentoCartao={lancamentoMock}>
          <button type="button">Editar</button>
        </LancamentoCartaoForm>,
        { wrapper: createWrapper() },
      );

      await user.click(screen.getByRole("button", { name: "Editar" }));

      expect(screen.getByRole("combobox", { name: "Cartão" })).toBeDisabled();
    });

    it("deve pré-preencher descrição e valor no modo editar", async () => {
      const user = userEvent.setup();
      render(
        <LancamentoCartaoForm lancamentoCartao={lancamentoMock}>
          <button type="button">Editar</button>
        </LancamentoCartaoForm>,
        { wrapper: createWrapper() },
      );

      await user.click(screen.getByRole("button", { name: "Editar" }));

      expect(screen.getByRole("textbox", { name: "Descrição" })).toHaveValue("Supermercado");
      expect(screen.getByRole("spinbutton", { name: "Valor" })).toHaveValue(250);
    });
  });

  describe("modo controlado (open/onOpenChange)", () => {
    it("deve abrir quando open=true sem trigger", () => {
      render(<LancamentoCartaoForm open={true} onOpenChange={jest.fn()} />, {
        wrapper: createWrapper(),
      });

      expect(screen.getByRole("dialog", { name: "Adicionar lançamento" })).toBeVisible();
    });

    it("não deve exibir dialog quando open=false", () => {
      render(<LancamentoCartaoForm open={false} onOpenChange={jest.fn()} />, {
        wrapper: createWrapper(),
      });

      expect(
        screen.queryByRole("dialog", { name: "Adicionar lançamento" }),
      ).not.toBeInTheDocument();
    });
  });
});
