import { toast } from "@/components/toast";
import { catalogoErros } from "@/helpers/erros-helper";
import { fireEvent, render, screen, waitFor, within } from "@/helpers/test/test-helper";
import ApiError from "@/types/application-error";
import { TipoCategoria } from "@/types/enum/tipo-categoria";
import { LancamentoConta } from "@/types/lancamento-conta";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import userEvent from "@testing-library/user-event";
import React from "react";

import LancamentoContaForm from "../lancamento-conta-form";

// ── mocks ──────────────────────────────────────────────────────────────────

jest.mock("next/navigation", () => ({
  useParams: () => ({ idConta: "conta-123" }),
}));

jest.mock("@/components/toast", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

const mockedUseContas = jest.fn();
jest.mock("@/hooks/use-contas", () => ({
  useContas: () => mockedUseContas(),
}));

const mockedUseCategorias = jest.fn();
jest.mock("@/hooks/use-categorias", () => ({
  useCategorias: () => mockedUseCategorias(),
}));

const mockedUseTags = jest.fn();
jest.mock("@/hooks/use-tags", () => ({
  useTags: () => mockedUseTags(),
}));

jest.mock("@/services/lancamento-conta-service", () => ({
  lancamentoContaService: {
    cadastrar: jest.fn(),
    alterar: jest.fn(),
  },
}));

// Primitivas complexas substituídas por elementos nativos para permitir
// interação direta via fireEvent sem depender da implementação interna.
jest.mock("@/components/primitives/select", () => ({
  Select: ({ label, name, value, onChange, isMulti, error }: any) => (
    <>
      <select
        aria-label={label}
        name={name}
        value={isMulti ? (Array.isArray(value) ? value : []) : (value ?? "")}
        multiple={isMulti}
        onChange={(e) => {
          if (isMulti) {
            const selected = Array.from(
              (e.target as HTMLSelectElement).selectedOptions,
            ).map((o) => o.value);
            onChange?.(selected);
          } else {
            onChange?.(e.target.value);
          }
        }}
      >
        <option value="">Selecione</option>
        <option value="conta-123">Conta Principal</option>
        <option value="cat-1">Alimentacao</option>
      </select>
      {error?.message && <span>{error.message}</span>}
    </>
  ),
}));

jest.mock("@/components/primitives/input-date", () => ({
  __esModule: true,
  default: ({ label, onChange }: any) => (
    <input
      aria-label={label ?? "Data"}
      type="date"
      defaultValue={new Date().toISOString().split("T")[0]}
      onChange={(e) =>
        onChange?.(
          e.target.value ? new Date(`${e.target.value}T00:00:00`) : undefined,
        )
      }
    />
  ),
}));

jest.mock("@/components/primitives/input-money", () => ({
  InputMoney: ({ label, onChange }: any) => (
    <input
      aria-label={label ?? "Valor"}
      type="number"
      onChange={(e) =>
        onChange?.(e.target.value ? parseFloat(e.target.value) : undefined)
      }
    />
  ),
}));

// ── helpers ────────────────────────────────────────────────────────────────

const { lancamentoContaService } = jest.requireMock(
  "@/services/lancamento-conta-service",
);

const createWrapper = () => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
};

const lancamentoMock: LancamentoConta = {
  uuid: "lanc-edit-1",
  data: "2026-03-20",
  descricao: "Salário",
  valor: 3500,
  categoria: { uuid: "cat-1", descricao: "Alimentacao", tipo: TipoCategoria.SAIDA },
  conta: { uuid: "conta-123", descricao: "Conta Principal" },
  tags: [],
  parcela: null,
  contaAgendada: null,
};

async function abrirModal(triggerLabel = "Abrir formulário") {
  const user = userEvent.setup();
  render(
    <LancamentoContaForm>
      <button>{triggerLabel}</button>
    </LancamentoContaForm>,
    { wrapper: createWrapper() },
  );
  await user.click(screen.getByRole("button", { name: triggerLabel }));
}

async function preencherESubmeter(triggerLabel = "Abrir formulário") {
  const user = userEvent.setup();
  render(
    <LancamentoContaForm>
      <button>{triggerLabel}</button>
    </LancamentoContaForm>,
    { wrapper: createWrapper() },
  );
  await user.click(screen.getByRole("button", { name: triggerLabel }));

  const dialog = screen.getByRole("dialog");
  fireEvent.change(within(dialog).getByLabelText("Categoria"), {
    target: { value: "cat-1" },
  });
  fireEvent.change(within(dialog).getByLabelText("Descrição"), {
    target: { value: "Supermercado" },
  });
  fireEvent.change(within(dialog).getByLabelText("Valor"), {
    target: { value: "150" },
  });
  await user.click(within(dialog).getByRole("button", { name: "Cadastrar" }));
}

// ── setup ──────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
  mockedUseContas.mockReturnValue({
    contasOptions: [{ value: "conta-123", label: "Conta Principal" }],
    isLoading: false,
  });
  mockedUseCategorias.mockReturnValue({
    categoriasOptions: [
      { label: "Saída", options: [{ value: "cat-1", label: "Alimentacao" }] },
    ],
    isLoading: false,
  });
  mockedUseTags.mockReturnValue({ tagsOptions: [], isLoading: false });
});

// ── testes ─────────────────────────────────────────────────────────────────

describe("LancamentoContaForm", () => {
  describe("abertura e fechamento do modal", () => {
    it("não deve mostrar o modal antes de clicar no trigger", () => {
      render(
        <LancamentoContaForm>
          <button>Abrir</button>
        </LancamentoContaForm>,
        { wrapper: createWrapper() },
      );

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("deve abrir o modal ao clicar no trigger", async () => {
      await abrirModal();

      expect(screen.getByRole("dialog")).toBeVisible();
    });

    it("deve fechar o modal ao clicar em Cancelar", async () => {
      const user = userEvent.setup();
      await abrirModal();

      await user.click(screen.getByRole("button", { name: "Cancelar" }));

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  describe("modo criação", () => {
    it("deve exibir título 'Adicionar lançamento'", async () => {
      await abrirModal();

      expect(
        screen.getByRole("dialog", { name: "Adicionar lançamento" }),
      ).toBeVisible();
    });

    it("deve renderizar os campos do formulário", async () => {
      await abrirModal();

      const dialog = screen.getByRole("dialog");
      expect(within(dialog).getByLabelText("Conta")).toBeVisible();
      expect(within(dialog).getByLabelText("Categoria")).toBeVisible();
      expect(within(dialog).getByLabelText("Descrição")).toBeVisible();
      expect(within(dialog).getByLabelText("Valor")).toBeVisible();
    });

    it("deve exibir erro de validação ao submeter sem categoria", async () => {
      const user = userEvent.setup();
      await abrirModal();

      await user.click(screen.getByRole("button", { name: "Cadastrar" }));

      await waitFor(() => {
        expect(
          screen.getByText("O campo categoria é obrigatório"),
        ).toBeVisible();
      });
    });

    it("deve exibir erro de validação ao submeter sem descrição", async () => {
      const user = userEvent.setup();
      await abrirModal();

      const dialog = screen.getByRole("dialog");
      fireEvent.change(within(dialog).getByLabelText("Categoria"), {
        target: { value: "cat-1" },
      });
      await user.click(within(dialog).getByRole("button", { name: "Cadastrar" }));

      await waitFor(() => {
        expect(
          screen.getByText("O campo descrição é obrigatório"),
        ).toBeVisible();
      });
    });

    it("deve chamar cadastrar e exibir toast de sucesso", async () => {
      lancamentoContaService.cadastrar.mockResolvedValueOnce({
        message: { codigo: 0, descricao: "Sucesso" },
      });

      await preencherESubmeter();

      await waitFor(() => {
        expect(lancamentoContaService.cadastrar).toHaveBeenCalledWith(
          expect.objectContaining({
            idConta: "conta-123",
            idCategoria: "cat-1",
            descricao: "Supermercado",
            valor: 150,
          }),
        );
        expect(toast.success).toHaveBeenCalledWith(
          "Lançamento cadastrado com sucesso!",
        );
      });
    });

    it("deve fechar o modal após submit bem-sucedido", async () => {
      lancamentoContaService.cadastrar.mockResolvedValueOnce({
        message: { codigo: 0, descricao: "Sucesso" },
      });

      await preencherESubmeter();

      await waitFor(() => {
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      });
    });

    it("deve exibir toast de erro genérico em falha inesperada", async () => {
      lancamentoContaService.cadastrar.mockRejectedValueOnce(
        new Error("network error"),
      );

      await preencherESubmeter();

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          expect.stringMatching(/.+/),
        );
      });
    });

    it("deve exibir toast de erro da API e manter modal aberto", async () => {
      lancamentoContaService.cadastrar.mockRejectedValueOnce(
        new ApiError(
          { codigo: 500, descricao: "Erro interno do servidor" },
          500,
        ),
      );

      await preencherESubmeter();

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Erro interno do servidor");
        expect(screen.getByRole("dialog")).toBeVisible();
      });
    });

    it("deve exibir erros de campo retornados pela API", async () => {
      lancamentoContaService.cadastrar.mockRejectedValueOnce(
        new ApiError(
          {
            codigo: catalogoErros.CAMPO_INVALIDO_OU_OBRIGATORIO,
            descricao: "Campo inválido",
          },
          422,
          { fields: [{ field: "descricao", message: "Descrição já cadastrada" }] },
        ),
      );

      await preencherESubmeter();

      await waitFor(() => {
        expect(screen.getByText("Descrição já cadastrada")).toBeVisible();
        expect(toast.error).toHaveBeenCalledWith("Campo inválido");
      });
    });
  });

  describe("modo edição", () => {
    it("deve exibir título 'Editar lançamento'", async () => {
      const user = userEvent.setup();
      render(
        <LancamentoContaForm lancamentoConta={lancamentoMock}>
          <button>Editar</button>
        </LancamentoContaForm>,
        { wrapper: createWrapper() },
      );
      await user.click(screen.getByRole("button", { name: "Editar" }));

      expect(
        screen.getByRole("dialog", { name: "Editar lançamento" }),
      ).toBeVisible();
    });

    it("deve pré-preencher os campos com os dados do lançamento", async () => {
      const user = userEvent.setup();
      render(
        <LancamentoContaForm lancamentoConta={lancamentoMock}>
          <button>Editar</button>
        </LancamentoContaForm>,
        { wrapper: createWrapper() },
      );
      await user.click(screen.getByRole("button", { name: "Editar" }));

      const dialog = screen.getByRole("dialog");
      expect(within(dialog).getByLabelText("Descrição")).toHaveValue("Salário");
    });

    it("deve chamar alterar e exibir toast de sucesso", async () => {
      lancamentoContaService.alterar.mockResolvedValueOnce({
        message: { codigo: 0, descricao: "Sucesso" },
      });
      const user = userEvent.setup();
      render(
        <LancamentoContaForm lancamentoConta={lancamentoMock}>
          <button>Editar</button>
        </LancamentoContaForm>,
        { wrapper: createWrapper() },
      );
      await user.click(screen.getByRole("button", { name: "Editar" }));
      await user.click(screen.getByRole("button", { name: "Cadastrar" }));

      await waitFor(() => {
        expect(lancamentoContaService.alterar).toHaveBeenCalledWith(
          "lanc-edit-1",
          expect.objectContaining({
            descricao: "Salário",
            valor: 3500,
          }),
        );
        expect(toast.success).toHaveBeenCalledWith(
          "Lançamento alterado com sucesso!",
        );
      });
    });
  });

  describe("estado de carregamento", () => {
    it("deve desabilitar Salvar enquanto dependências estão carregando", async () => {
      mockedUseContas.mockReturnValue({
        contasOptions: [],
        isLoading: true,
      });
      await abrirModal();

      expect(screen.getByRole("button", { name: "Cadastrar" })).toBeDisabled();
    });
  });
});
