import React from "react";
import { fireEvent, render, screen, waitFor, within } from "@/helpers/test/test-helper";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { toast } from "@/components/toast";
import ApiError from "@/types/application-error";
import { catalogoErros } from "@/helpers/erros-helper";
import { Conta } from "@/types/contas";
import { TipoConta } from "@/types/enum/tipo-conta";
import { Status } from "@/types/enum/status";

import ContaForm from "../conta-form";

// ── mocks ──────────────────────────────────────────────────────────────────

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
        <option value={TipoConta.CONTA_CORRENTE}>Conta Corrente</option>
        <option value={TipoConta.POUPANCA}>Poupança</option>
        <option value={TipoConta.DINHEIRO}>Dinheiro</option>
        <option value={TipoConta.INVESTIMENTO}>Investimento</option>
      </select>
      {error?.message && <span>{error.message}</span>}
    </>
  ),
}));

jest.mock("@/services/contas-service", () => ({
  contasService: {
    cadastrar: jest.fn(),
    alterar: jest.fn(),
  },
}));

// ── helpers ────────────────────────────────────────────────────────────────

const { contasService } = jest.requireMock("@/services/contas-service");

const createWrapper = () => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
};

const contaMock: Conta = {
  uuid: "conta-1",
  nome: "Conta Principal",
  tipo: TipoConta.CONTA_CORRENTE,
  status: Status.ATIVO,
  icon: "",
  saldo: 1000,
};

async function abrirModal(triggerLabel = "Abrir formulário") {
  const user = userEvent.setup();
  render(
    <ContaForm>
      <button>{triggerLabel}</button>
    </ContaForm>,
    { wrapper: createWrapper() },
  );
  await user.click(screen.getByRole("button", { name: triggerLabel }));
}

async function preencherESubmeter(triggerLabel = "Abrir formulário") {
  const user = userEvent.setup();
  render(
    <ContaForm>
      <button>{triggerLabel}</button>
    </ContaForm>,
    { wrapper: createWrapper() },
  );
  await user.click(screen.getByRole("button", { name: triggerLabel }));

  const dialog = screen.getByRole("dialog");
  await user.type(within(dialog).getByLabelText("Nome"), "Nubank");
  fireEvent.change(within(dialog).getByLabelText("Tipo"), {
    target: { value: TipoConta.CONTA_CORRENTE },
  });
  await user.click(within(dialog).getByRole("button", { name: "Salvar" }));
}

// ── setup ──────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
});

// ── testes ─────────────────────────────────────────────────────────────────

describe("ContaForm", () => {
  describe("abertura e fechamento do modal", () => {
    it("não deve mostrar o modal antes de clicar no trigger", () => {
      render(
        <ContaForm>
          <button>Abrir</button>
        </ContaForm>,
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
    it("deve exibir título 'Adicionar conta'", async () => {
      await abrirModal();

      expect(
        screen.getByRole("dialog", { name: "Adicionar conta" }),
      ).toBeVisible();
    });

    it("deve renderizar os campos do formulário", async () => {
      await abrirModal();

      const dialog = screen.getByRole("dialog");
      expect(within(dialog).getByLabelText("Nome")).toBeVisible();
      expect(within(dialog).getByLabelText("Tipo")).toBeVisible();
    });

    it("deve exibir erro de validação ao submeter sem nome", async () => {
      const user = userEvent.setup();
      await abrirModal();

      const dialog = screen.getByRole("dialog");
      fireEvent.change(within(dialog).getByLabelText("Tipo"), {
        target: { value: TipoConta.CONTA_CORRENTE },
      });
      await user.click(within(dialog).getByRole("button", { name: "Salvar" }));

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
      await user.type(within(dialog).getByLabelText("Nome"), "Nubank");
      await user.click(within(dialog).getByRole("button", { name: "Salvar" }));

      await waitFor(() => {
        expect(screen.getByText("O campo tipo é obrigatório")).toBeVisible();
      });
    });

    it("deve chamar cadastrar e exibir toast de sucesso", async () => {
      contasService.cadastrar.mockResolvedValueOnce({
        message: { codigo: 0, descricao: "Sucesso" },
      });

      await preencherESubmeter();

      await waitFor(() => {
        expect(contasService.cadastrar).toHaveBeenCalledWith(
          expect.objectContaining({
            nome: "Nubank",
            tipo: TipoConta.CONTA_CORRENTE,
          }),
        );
        expect(toast.success).toHaveBeenCalledWith("Conta cadastrada com sucesso!");
      });
    });

    it("deve fechar o modal após submit bem-sucedido", async () => {
      contasService.cadastrar.mockResolvedValueOnce({
        message: { codigo: 0, descricao: "Sucesso" },
      });

      await preencherESubmeter();

      await waitFor(() => {
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      });
    });

    it("deve exibir toast de erro genérico em falha inesperada", async () => {
      contasService.cadastrar.mockRejectedValueOnce(new Error("network error"));

      await preencherESubmeter();

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(expect.stringMatching(/.+/));
      });
    });

    it("deve exibir toast de erro da API e manter modal aberto", async () => {
      contasService.cadastrar.mockRejectedValueOnce(
        new ApiError({ codigo: 500, descricao: "Erro interno do servidor" }, 500),
      );

      await preencherESubmeter();

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Erro interno do servidor");
        expect(screen.getByRole("dialog")).toBeVisible();
      });
    });

    it("deve exibir erros de campo retornados pela API", async () => {
      contasService.cadastrar.mockRejectedValueOnce(
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
    it("deve exibir título 'Editar conta'", async () => {
      const user = userEvent.setup();
      render(
        <ContaForm conta={contaMock}>
          <button>Editar</button>
        </ContaForm>,
        { wrapper: createWrapper() },
      );
      await user.click(screen.getByRole("button", { name: "Editar" }));

      expect(
        screen.getByRole("dialog", { name: "Editar conta" }),
      ).toBeVisible();
    });

    it("deve pré-preencher os campos com os dados da conta", async () => {
      const user = userEvent.setup();
      render(
        <ContaForm conta={contaMock}>
          <button>Editar</button>
        </ContaForm>,
        { wrapper: createWrapper() },
      );
      await user.click(screen.getByRole("button", { name: "Editar" }));

      const dialog = screen.getByRole("dialog");
      expect(within(dialog).getByLabelText("Nome")).toHaveValue("Conta Principal");
      expect(within(dialog).getByLabelText("Tipo")).toHaveValue(TipoConta.CONTA_CORRENTE);
    });

    it("deve chamar alterar e exibir toast de sucesso", async () => {
      contasService.alterar.mockResolvedValueOnce({
        message: { codigo: 0, descricao: "Sucesso" },
      });
      const user = userEvent.setup();
      render(
        <ContaForm conta={contaMock}>
          <button>Editar</button>
        </ContaForm>,
        { wrapper: createWrapper() },
      );
      await user.click(screen.getByRole("button", { name: "Editar" }));
      await user.click(screen.getByRole("button", { name: "Salvar" }));

      await waitFor(() => {
        expect(contasService.alterar).toHaveBeenCalledWith(
          "conta-1",
          expect.objectContaining({ nome: "Conta Principal" }),
        );
        expect(toast.success).toHaveBeenCalledWith("Conta alterada com sucesso!");
      });
    });
  });
});
