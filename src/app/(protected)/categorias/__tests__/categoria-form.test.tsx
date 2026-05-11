import React from "react";
import { fireEvent, render, screen, waitFor, within } from "@/helpers/test/test-helper";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { toast } from "@/components/toast";
import ApiError from "@/types/application-error";
import { catalogoErros } from "@/helpers/erros-helper";

import CategoriaForm from "../categoria-form";
import type { Categoria } from "@/types/categorias";
import { TipoCategoria } from "@/types/enum/tipo-categoria";
import { Status } from "@/types/enum/status";

// ── mocks ──────────────────────────────────────────────────────────────────

jest.mock("next/navigation", () => ({
  useParams: () => ({}),
}));

jest.mock("@/components/toast", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

jest.mock("@/components/primitives/select", () => ({
  Select: ({ label, value, onChange, error }: any) => (
    <>
      <select
        aria-label={label}
        value={value ?? ""}
        onChange={(e) => onChange?.(e.target.value)}
      >
        <option value="">Selecione</option>
        <option value="ENTRADA">ENTRADA</option>
        <option value="SAIDA">SAIDA</option>
      </select>
      {error?.message && <span>{error.message}</span>}
    </>
  ),
}));

jest.mock("@/components/primitives/switch", () => ({
  __esModule: true,
  default: ({ label, checked, onCheckedChange }: any) => (
    <input
      type="checkbox"
      aria-label={label}
      checked={checked ?? false}
      onChange={(e) => onCheckedChange?.(e.target.checked)}
    />
  ),
}));

jest.mock("@/services/categorias-service", () => ({
  categoriasService: {
    cadastrar: jest.fn(),
    alterar: jest.fn(),
  },
}));

// ── helpers ────────────────────────────────────────────────────────────────

const { categoriasService } = jest.requireMock("@/services/categorias-service");

const createWrapper = () => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
};

const categoriaMock: Categoria = {
  uuid: "cat-1",
  nome: "Salário",
  tipo: TipoCategoria.ENTRADA,
  status: Status.ATIVO,
  exibirNaDashboard: true,
};

async function abrirModal(triggerLabel = "Adicionar") {
  const user = userEvent.setup();
  render(
    <CategoriaForm>
      <button>{triggerLabel}</button>
    </CategoriaForm>,
    { wrapper: createWrapper() },
  );
  await user.click(screen.getByRole("button", { name: triggerLabel }));
}

async function preencherESubmeter(triggerLabel = "Adicionar") {
  const user = userEvent.setup();
  render(
    <CategoriaForm>
      <button>{triggerLabel}</button>
    </CategoriaForm>,
    { wrapper: createWrapper() },
  );
  await user.click(screen.getByRole("button", { name: triggerLabel }));

  const dialog = screen.getByRole("dialog");
  await user.type(within(dialog).getByLabelText("Nome"), "Alimentação");
  fireEvent.change(within(dialog).getByLabelText("Tipo"), {
    target: { value: "SAIDA" },
  });
  await user.click(within(dialog).getByRole("button", { name: "Salvar" }));
}

// ── setup ──────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
});

// ── testes ─────────────────────────────────────────────────────────────────

describe("CategoriaForm", () => {
  describe("abertura e fechamento do modal", () => {
    it("não deve mostrar o modal antes de clicar no trigger", () => {
      render(
        <CategoriaForm>
          <button>Adicionar</button>
        </CategoriaForm>,
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
    it("deve exibir título 'Adicionar categoria'", async () => {
      await abrirModal();

      expect(
        screen.getByRole("dialog", { name: "Adicionar categoria" }),
      ).toBeVisible();
    });

    it("deve exibir erro de validação ao submeter sem nome", async () => {
      const user = userEvent.setup();
      await abrirModal();

      await user.click(screen.getByRole("button", { name: "Salvar" }));

      await waitFor(() => {
        expect(
          screen.getByText("O campo nome é obrigatório"),
        ).toBeVisible();
      });
    });

    it("deve exibir erro de validação ao submeter sem tipo", async () => {
      const user = userEvent.setup();
      await abrirModal();

      const dialog = screen.getByRole("dialog");
      await user.type(within(dialog).getByLabelText("Nome"), "Alimentação");
      await user.click(within(dialog).getByRole("button", { name: "Salvar" }));

      await waitFor(() => {
        expect(
          screen.getByText("O campo tipo é obrigatório"),
        ).toBeVisible();
      });
    });

    it("deve chamar cadastrar e exibir toast de sucesso", async () => {
      categoriasService.cadastrar.mockResolvedValueOnce({
        message: { codigo: 0, descricao: "Sucesso" },
      });

      await preencherESubmeter();

      await waitFor(() => {
        expect(categoriasService.cadastrar).toHaveBeenCalledWith(
          expect.objectContaining({
            nome: "Alimentação",
            tipo: "SAIDA",
          }),
        );
        expect(toast.success).toHaveBeenCalledWith(
          "Categoria cadastrada com sucesso!",
        );
      });
    });

    it("deve fechar o modal após submit bem-sucedido", async () => {
      categoriasService.cadastrar.mockResolvedValueOnce({
        message: { codigo: 0, descricao: "Sucesso" },
      });

      await preencherESubmeter();

      await waitFor(() => {
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      });
    });

    it("deve exibir toast de erro genérico em falha inesperada", async () => {
      categoriasService.cadastrar.mockRejectedValueOnce(
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
      categoriasService.cadastrar.mockRejectedValueOnce(
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
      categoriasService.cadastrar.mockRejectedValueOnce(
        new ApiError(
          {
            codigo: catalogoErros.CAMPO_INVALIDO_OU_OBRIGATORIO,
            descricao: "Campo inválido",
          },
          422,
          { fields: [{ field: "nome", message: "Nome já cadastrado" }] },
        ),
      );

      await preencherESubmeter();

      await waitFor(() => {
        expect(screen.getByText("Nome já cadastrado")).toBeVisible();
        expect(toast.error).toHaveBeenCalledWith("Campo inválido");
      });
    });
  });

  describe("modo edição", () => {
    it("deve exibir título 'Editar categoria'", async () => {
      const user = userEvent.setup();
      render(
        <CategoriaForm categoria={categoriaMock}>
          <button>Editar</button>
        </CategoriaForm>,
        { wrapper: createWrapper() },
      );
      await user.click(screen.getByRole("button", { name: "Editar" }));

      expect(
        screen.getByRole("dialog", { name: "Editar categoria" }),
      ).toBeVisible();
    });

    it("deve pré-preencher os campos com os dados da categoria", async () => {
      const user = userEvent.setup();
      render(
        <CategoriaForm categoria={categoriaMock}>
          <button>Editar</button>
        </CategoriaForm>,
        { wrapper: createWrapper() },
      );
      await user.click(screen.getByRole("button", { name: "Editar" }));

      const dialog = screen.getByRole("dialog");
      expect(within(dialog).getByLabelText("Nome")).toHaveValue("Salário");
    });

    it("deve chamar alterar e exibir toast de sucesso", async () => {
      categoriasService.alterar.mockResolvedValueOnce({
        message: { codigo: 0, descricao: "Sucesso" },
      });
      const user = userEvent.setup();
      render(
        <CategoriaForm categoria={categoriaMock}>
          <button>Editar</button>
        </CategoriaForm>,
        { wrapper: createWrapper() },
      );
      await user.click(screen.getByRole("button", { name: "Editar" }));
      await user.click(screen.getByRole("button", { name: "Salvar" }));

      await waitFor(() => {
        expect(categoriasService.alterar).toHaveBeenCalledWith(
          "cat-1",
          expect.objectContaining({
            nome: "Salário",
          }),
        );
        expect(toast.success).toHaveBeenCalledWith(
          "Categoria alterada com sucesso!",
        );
      });
    });
  });
});
