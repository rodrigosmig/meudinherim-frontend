import React from "react";
import { fireEvent, render, screen, waitFor, within } from "@/helpers/test/test-helper";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { toast } from "@/components/toast";
import ApiError from "@/types/application-error";
import { catalogoErros } from "@/helpers/erros-helper";
import { Cartao } from "@/types/cartao";
import { Status } from "@/types/enum/status";

import CartaoForm from "../cartao-form";

// ── mocks ──────────────────────────────────────────────────────────────────

jest.mock("@/components/toast", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

jest.mock("@/components/primitives/input-money", () => ({
  InputMoney: ({ label, value, onChange }: any) => (
    <input
      aria-label={label ?? "Valor"}
      type="number"
      value={value ?? ""}
      onChange={(e) => onChange?.(e.target.value ? parseFloat(e.target.value) : undefined)}
    />
  ),
}));

jest.mock("@/services/cartoes-service", () => ({
  cartoesService: {
    cadastrar: jest.fn(),
    alterar: jest.fn(),
  },
}));

// ── helpers ────────────────────────────────────────────────────────────────

const { cartoesService } = jest.requireMock("@/services/cartoes-service");

const createWrapper = () => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
};

const cartaoMock: Cartao = {
  uuid: "cartao-1",
  nome: "Nubank",
  diaVencimento: 10,
  diaFechamento: 3,
  limiteCredito: 5000,
  saldo: 2500,
  status: Status.ATIVO,
};

async function abrirModal(triggerLabel = "Abrir formulário") {
  const user = userEvent.setup();
  render(
    <CartaoForm>
      <button>{triggerLabel}</button>
    </CartaoForm>,
    { wrapper: createWrapper() },
  );
  await user.click(screen.getByRole("button", { name: triggerLabel }));
}

async function preencherESubmeter(triggerLabel = "Abrir formulário") {
  const user = userEvent.setup();
  render(
    <CartaoForm>
      <button>{triggerLabel}</button>
    </CartaoForm>,
    { wrapper: createWrapper() },
  );
  await user.click(screen.getByRole("button", { name: triggerLabel }));

  const dialog = screen.getByRole("dialog");
  await user.type(within(dialog).getByLabelText("Nome"), "Inter");
  fireEvent.change(within(dialog).getByLabelText("Dia de vencimento"), {
    target: { value: "10", valueAsNumber: 10 },
  });
  fireEvent.change(within(dialog).getByLabelText("Dia de fechamento"), {
    target: { value: "3", valueAsNumber: 3 },
  });
  fireEvent.change(within(dialog).getByLabelText("Limite de crédito"), {
    target: { value: "3000" },
  });
  await user.click(within(dialog).getByRole("button", { name: "Salvar" }));
}

// ── setup ──────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
});

// ── testes ─────────────────────────────────────────────────────────────────

describe("CartaoForm", () => {
  describe("abertura e fechamento do modal", () => {
    it("não deve mostrar o modal antes de clicar no trigger", () => {
      render(
        <CartaoForm>
          <button>Abrir</button>
        </CartaoForm>,
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
    it("deve exibir título 'Adicionar cartão'", async () => {
      await abrirModal();
      expect(screen.getByRole("dialog", { name: "Adicionar cartão" })).toBeVisible();
    });

    it("deve renderizar os campos do formulário", async () => {
      await abrirModal();
      const dialog = screen.getByRole("dialog");
      expect(within(dialog).getByLabelText("Nome")).toBeVisible();
      expect(within(dialog).getByLabelText("Dia de vencimento")).toBeVisible();
      expect(within(dialog).getByLabelText("Dia de fechamento")).toBeVisible();
      expect(within(dialog).getByLabelText("Limite de crédito")).toBeVisible();
    });

    it("deve exibir erro de validação ao submeter sem nome", async () => {
      const user = userEvent.setup();
      await abrirModal();
      await user.click(screen.getByRole("button", { name: "Salvar" }));
      await waitFor(() => {
        expect(screen.getByText("O campo nome é obrigatório")).toBeVisible();
      });
    });

    it("deve chamar cadastrar e exibir toast de sucesso", async () => {
      cartoesService.cadastrar.mockResolvedValueOnce({
        message: { codigo: 0, descricao: "Sucesso" },
      });

      await preencherESubmeter();

      await waitFor(() => {
        expect(cartoesService.cadastrar).toHaveBeenCalledWith(
          expect.objectContaining({ nome: "Inter", limiteCredito: 3000 }),
        );
        expect(toast.success).toHaveBeenCalledWith("Cartão cadastrado com sucesso!");
      });
    });

    it("deve fechar o modal após submit bem-sucedido", async () => {
      cartoesService.cadastrar.mockResolvedValueOnce({
        message: { codigo: 0, descricao: "Sucesso" },
      });
      await preencherESubmeter();
      await waitFor(() => {
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      });
    });

    it("deve exibir toast de erro genérico em falha inesperada", async () => {
      cartoesService.cadastrar.mockRejectedValueOnce(new Error("network error"));
      await preencherESubmeter();
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(expect.stringMatching(/.+/));
      });
    });

    it("deve exibir toast de erro da API e manter modal aberto", async () => {
      cartoesService.cadastrar.mockRejectedValueOnce(
        new ApiError({ codigo: 500, descricao: "Erro interno do servidor" }, 500),
      );
      await preencherESubmeter();
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Erro interno do servidor");
        expect(screen.getByRole("dialog")).toBeVisible();
      });
    });

    it("deve exibir erros de campo retornados pela API", async () => {
      cartoesService.cadastrar.mockRejectedValueOnce(
        new ApiError(
          { codigo: catalogoErros.CAMPO_INVALIDO_OU_OBRIGATORIO, descricao: "Campo inválido" },
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
    it("deve exibir título 'Editar cartão'", async () => {
      const user = userEvent.setup();
      render(
        <CartaoForm cartao={cartaoMock}>
          <button>Editar</button>
        </CartaoForm>,
        { wrapper: createWrapper() },
      );
      await user.click(screen.getByRole("button", { name: "Editar" }));
      expect(screen.getByRole("dialog", { name: "Editar cartão" })).toBeVisible();
    });

    it("deve pré-preencher os campos com os dados do cartão", async () => {
      const user = userEvent.setup();
      render(
        <CartaoForm cartao={cartaoMock}>
          <button>Editar</button>
        </CartaoForm>,
        { wrapper: createWrapper() },
      );
      await user.click(screen.getByRole("button", { name: "Editar" }));
      const dialog = screen.getByRole("dialog");
      expect(within(dialog).getByLabelText("Nome")).toHaveValue("Nubank");
      expect(within(dialog).getByLabelText("Dia de vencimento")).toHaveValue(10);
      expect(within(dialog).getByLabelText("Dia de fechamento")).toHaveValue(3);
    });

    it("deve chamar alterar e exibir toast de sucesso", async () => {
      cartoesService.alterar.mockResolvedValueOnce({
        message: { codigo: 0, descricao: "Sucesso" },
      });
      const user = userEvent.setup();
      render(
        <CartaoForm cartao={cartaoMock}>
          <button>Editar</button>
        </CartaoForm>,
        { wrapper: createWrapper() },
      );
      await user.click(screen.getByRole("button", { name: "Editar" }));
      await user.click(screen.getByRole("button", { name: "Salvar" }));
      await waitFor(() => {
        expect(cartoesService.alterar).toHaveBeenCalledWith(
          "cartao-1",
          expect.objectContaining({ nome: "Nubank" }),
        );
        expect(toast.success).toHaveBeenCalledWith("Cartão alterado com sucesso!");
      });
    });
  });
});
