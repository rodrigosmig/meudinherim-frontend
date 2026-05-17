import React from "react";
import { render, screen, within, waitFor } from "@/helpers/test/test-helper";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { toast } from "@/components/toast";
import ApiError from "@/types/application-error";
import { Categoria } from "@/types/categorias";
import { TipoCategoria } from "@/types/enum/tipo-categoria";
import { Status } from "@/types/enum/status";

import TabelaCategorias from "../tabela-categorias";

// ── mocks ──────────────────────────────────────────────────────────────────

jest.mock("@/components/toast", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

jest.mock(
  "@/app/(protected)/categorias/categoria-form",
  () => ({
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  }),
);

jest.mock("@/services/categorias-service", () => ({
  categoriasService: {
    deletar: jest.fn(),
    ativar: jest.fn(),
    desativar: jest.fn(),
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

const categoriaAtiva: Categoria = {
  uuid: "cat-1",
  nome: "Alimentação",
  tipo: TipoCategoria.SAIDA,
  status: Status.ATIVO,
  exibirNaDashboard: true,
};

const categoriaInativa: Categoria = {
  uuid: "cat-2",
  nome: "Salário",
  tipo: TipoCategoria.ENTRADA,
  status: Status.INATIVO,
  exibirNaDashboard: false,
};

// ── setup ──────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
});

// ── testes ─────────────────────────────────────────────────────────────────

describe("TabelaCategorias", () => {
  describe("renderização", () => {
    it("deve renderizar colunas do cabeçalho", () => {
      render(<TabelaCategorias categorias={[]} />, {
        wrapper: createWrapper(),
      });

      expect(screen.getByText("Nome")).toBeVisible();
      expect(screen.getByText("Tipo")).toBeVisible();
      expect(screen.getByText("Exibir na Dashboard")).toBeVisible();
      expect(screen.getByText("Ações")).toBeVisible();
    });

    it("deve renderizar o nome da categoria", () => {
      render(<TabelaCategorias categorias={[categoriaAtiva]} />, {
        wrapper: createWrapper(),
      });

      expect(screen.getByText("Alimentação")).toBeVisible();
    });

    it("deve renderizar badge 'Saída' para tipo SAIDA", () => {
      render(<TabelaCategorias categorias={[categoriaAtiva]} />, {
        wrapper: createWrapper(),
      });

      expect(screen.getByText("Saída")).toBeVisible();
    });

    it("deve renderizar badge 'Entrada' para tipo ENTRADA", () => {
      render(<TabelaCategorias categorias={[categoriaInativa]} />, {
        wrapper: createWrapper(),
      });

      expect(screen.getByText("Entrada")).toBeVisible();
    });

    it("deve renderizar 'Sim' quando exibirNaDashboard é true", () => {
      render(<TabelaCategorias categorias={[categoriaAtiva]} />, {
        wrapper: createWrapper(),
      });

      expect(screen.getByText("Sim")).toBeVisible();
    });

    it("deve renderizar 'Não' quando exibirNaDashboard é false", () => {
      render(<TabelaCategorias categorias={[categoriaInativa]} />, {
        wrapper: createWrapper(),
      });

      expect(screen.getByText("Não")).toBeVisible();
    });
  });

  describe("modal de exclusão", () => {
    it("deve abrir o modal de exclusão com o nome da categoria ao clicar no botão Excluir", async () => {
      const user = userEvent.setup();
      render(<TabelaCategorias categorias={[categoriaAtiva]} />, {
        wrapper: createWrapper(),
      });

      const [, row] = screen.getAllByRole("row");
      const [, trash] = within(row).getAllByRole("button");
      await user.click(trash);

      const dialog = screen.getByRole("dialog", { name: "Excluir Categoria" });
      expect(dialog).toBeVisible();
      expect(within(dialog).getByText(/Alimentação/)).toBeVisible();
    });

    it("deve fechar o modal de exclusão ao clicar em Cancelar", async () => {
      const user = userEvent.setup();
      render(<TabelaCategorias categorias={[categoriaAtiva]} />, {
        wrapper: createWrapper(),
      });

      const [, row] = screen.getAllByRole("row");
      const [, trash] = within(row).getAllByRole("button");
      await user.click(trash);

      await user.click(screen.getByRole("button", { name: "Cancelar" }));

      expect(
        screen.queryByRole("dialog", { name: "Excluir Categoria" }),
      ).not.toBeInTheDocument();
    });

    it("deve chamar deletar e exibir toast de sucesso ao confirmar exclusão", async () => {
      categoriasService.deletar.mockResolvedValueOnce(undefined);
      const user = userEvent.setup();
      render(<TabelaCategorias categorias={[categoriaAtiva]} />, {
        wrapper: createWrapper(),
      });

      const [, row] = screen.getAllByRole("row");
      const [, trash] = within(row).getAllByRole("button");
      await user.click(trash);
      await user.click(screen.getByRole("button", { name: "Confirmar" }));

      await waitFor(() => {
        expect(categoriasService.deletar).toHaveBeenCalledWith("cat-1");
        expect(toast.success).toHaveBeenCalledWith(
          "Categoria excluída com sucesso!",
        );
      });
    });

    it("deve exibir toast de erro da API ao falhar exclusão", async () => {
      categoriasService.deletar.mockRejectedValueOnce(
        new ApiError({ codigo: 500, descricao: "Erro ao excluir" }, 500),
      );
      const user = userEvent.setup();
      render(<TabelaCategorias categorias={[categoriaAtiva]} />, {
        wrapper: createWrapper(),
      });

      const [, row] = screen.getAllByRole("row");
      const [, trash] = within(row).getAllByRole("button");
      await user.click(trash);
      await user.click(screen.getByRole("button", { name: "Confirmar" }));

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Erro ao excluir");
      });
    });
  });

  describe("modal de alteração de status", () => {
    it("deve abrir modal 'Desativar Categoria' para categoria ativa", async () => {
      const user = userEvent.setup();
      render(<TabelaCategorias categorias={[categoriaAtiva]} />, {
        wrapper: createWrapper(),
      });

      const [, row] = screen.getAllByRole("row");
      const [, , statusBtn] = within(row).getAllByRole("button");
      await user.click(statusBtn);

      expect(
        screen.getByRole("dialog", { name: "Desativar Categoria" }),
      ).toBeVisible();
    });

    it("deve chamar desativar e exibir toast de sucesso ao confirmar desativação", async () => {
      categoriasService.desativar.mockResolvedValueOnce(undefined);
      const user = userEvent.setup();
      render(<TabelaCategorias categorias={[categoriaAtiva]} />, {
        wrapper: createWrapper(),
      });

      const [, row] = screen.getAllByRole("row");
      const [, , statusBtn] = within(row).getAllByRole("button");
      await user.click(statusBtn);
      await user.click(screen.getByRole("button", { name: "Confirmar" }));

      await waitFor(() => {
        expect(categoriasService.desativar).toHaveBeenCalledWith("cat-1");
        expect(toast.success).toHaveBeenCalledWith(
          "Categoria desativada com sucesso!",
        );
      });
    });

    it("deve abrir modal 'Ativar Categoria' para categoria inativa", async () => {
      const user = userEvent.setup();
      render(<TabelaCategorias categorias={[categoriaInativa]} />, {
        wrapper: createWrapper(),
      });

      const [, row] = screen.getAllByRole("row");
      const [, , statusBtn] = within(row).getAllByRole("button");
      await user.click(statusBtn);

      expect(
        screen.getByRole("dialog", { name: "Ativar Categoria" }),
      ).toBeVisible();
    });

    it("deve chamar ativar e exibir toast de sucesso ao confirmar ativação", async () => {
      categoriasService.ativar.mockResolvedValueOnce(undefined);
      const user = userEvent.setup();
      render(<TabelaCategorias categorias={[categoriaInativa]} />, {
        wrapper: createWrapper(),
      });

      const [, row] = screen.getAllByRole("row");
      const [, , statusBtn] = within(row).getAllByRole("button");
      await user.click(statusBtn);
      await user.click(screen.getByRole("button", { name: "Confirmar" }));

      await waitFor(() => {
        expect(categoriasService.ativar).toHaveBeenCalledWith("cat-2");
        expect(toast.success).toHaveBeenCalledWith(
          "Categoria ativada com sucesso!",
        );
      });
    });
  });
});
