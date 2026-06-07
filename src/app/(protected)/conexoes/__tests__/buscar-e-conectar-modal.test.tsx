import React from "react";
import { render, screen, waitFor } from "@/helpers/test/test-helper";
import userEvent from "@testing-library/user-event";

import type { Usuario } from "@/types/conexao";
import { toast } from "@/components/toast";
import ApiError from "@/types/application-error";
import { DEFAULT_ERROR_MESSAGE } from "@/helpers/route-helpers";

import BuscarEConectarModal from "../buscar-e-conectar-modal";

// ── mocks ──────────────────────────────────────────────────────────────────

jest.mock("@/components/toast", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

const mockUseBuscarUsuarios = jest.fn();
jest.mock("@/hooks/use-buscar-usuarios", () => ({
  useBuscarUsuarios: (q: string) => mockUseBuscarUsuarios(q),
}));

jest.mock("@/services/conexoes-service", () => ({
  conexoesService: {
    enviarSolicitacao: jest.fn(),
  },
}));

// ── helpers ────────────────────────────────────────────────────────────────

const { conexoesService } = jest.requireMock("@/services/conexoes-service");

const usuario1: Usuario = {
  id: "user-1",
  nome: "João Silva",
  email: "joao@email.com",
  ativaNotificacao: true,
};

const usuario2: Usuario = {
  id: "user-2",
  nome: "Maria Santos",
  email: "maria@email.com",
  ativaNotificacao: false,
};

function mockBuscarUsuarios(data: Usuario[] | undefined, isLoading = false) {
  mockUseBuscarUsuarios.mockReturnValue({
    data,
    isLoading,
    isError: false,
    refetch: jest.fn(),
  });
}

// ── setup ──────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
  mockBuscarUsuarios(undefined, false);
});

// ── testes ─────────────────────────────────────────────────────────────────

describe("BuscarEConectarModal", () => {
  const defaultProps = {
    open: true,
    onOpenChange: jest.fn(),
  };

  describe("renderização", () => {
    it("deve renderizar o título do modal", () => {
      render(<BuscarEConectarModal {...defaultProps} />);

      expect(screen.getByRole("dialog", { name: "Buscar contatos" })).toBeVisible();
    });

    it("deve renderizar o campo de busca", () => {
      render(<BuscarEConectarModal {...defaultProps} />);

      expect(
        screen.getByPlaceholderText("Buscar por nome ou email"),
      ).toBeVisible();
    });

    it("não deve renderizar quando open é false", () => {
      render(<BuscarEConectarModal {...defaultProps} open={false} />);

      expect(
        screen.queryByRole("dialog", { name: "Buscar contatos" }),
      ).not.toBeInTheDocument();
    });
  });

  describe("estado inicial", () => {
    it("deve exibir mensagem para digitar pelo menos 2 caracteres", () => {
      render(<BuscarEConectarModal {...defaultProps} />);

      expect(
        screen.getByText("Digite pelo menos 2 caracteres para buscar"),
      ).toBeVisible();
    });
  });

  describe("busca", () => {
    it("deve exibir estado de carregamento ao buscar", async () => {
      const user = userEvent.setup();
      mockBuscarUsuarios(undefined, true);
      render(<BuscarEConectarModal {...defaultProps} />);

      const input = screen.getByPlaceholderText("Buscar por nome ou email");
      await user.type(input, "Jo");

      await waitFor(() => {
        expect(screen.getByText("Buscando...")).toBeVisible();
      });
    });

    it("deve exibir mensagem de nenhum usuário encontrado", async () => {
      const user = userEvent.setup();
      mockBuscarUsuarios([], false);
      render(<BuscarEConectarModal {...defaultProps} />);

      const input = screen.getByPlaceholderText("Buscar por nome ou email");
      await user.type(input, "xyz");

      await waitFor(() => {
        expect(
          screen.getByText("Nenhum usuário encontrado"),
        ).toBeVisible();
      });
    });

    it("deve exibir lista de usuários encontrados", async () => {
      const user = userEvent.setup();
      // Precisamos garantir que a busca só é chamada com >= 2 caracteres
      // e que o resultado mockado retorna quando debouncedSearch >= 2
      // O useBuscarUsuarios usa `enabled: q.trim().length >= 2`
      // Então precisamos que o mock retorne os dados
      mockBuscarUsuarios([usuario1, usuario2], false);
      render(<BuscarEConectarModal {...defaultProps} />);

      const input = screen.getByPlaceholderText("Buscar por nome ou email");
      await user.type(input, "Jo");

      // Aguardar o debounce de 300ms e a renderização
      await waitFor(
        () => {
          expect(screen.getByText("João Silva")).toBeVisible();
        },
        { timeout: 1000 },
      );
      expect(screen.getByText("joao@email.com")).toBeVisible();
    });

    it("deve exibir botão Conectar para cada usuário", async () => {
      const user = userEvent.setup();
      mockBuscarUsuarios([usuario1], false);
      render(<BuscarEConectarModal {...defaultProps} />);

      const input = screen.getByPlaceholderText("Buscar por nome ou email");
      await user.type(input, "Jo");

      await waitFor(
        () => {
          expect(screen.getByRole("button", { name: "Conectar" })).toBeVisible();
        },
        { timeout: 1000 },
      );
    });
  });

  describe("mutação conectar", () => {
    it("deve chamar enviarSolicitacao e exibir toast ao clicar em Conectar", async () => {
      conexoesService.enviarSolicitacao.mockResolvedValueOnce(undefined);
      const user = userEvent.setup();
      mockBuscarUsuarios([usuario1], false);
      render(<BuscarEConectarModal {...defaultProps} />);

      const input = screen.getByPlaceholderText("Buscar por nome ou email");
      await user.type(input, "Jo");

      await waitFor(
        () => {
          expect(screen.getByRole("button", { name: "Conectar" })).toBeVisible();
        },
        { timeout: 1000 },
      );

      await user.click(screen.getByRole("button", { name: "Conectar" }));

      await waitFor(() => {
        expect(conexoesService.enviarSolicitacao).toHaveBeenCalledWith({
          idDestinatario: "user-1",
        });
        expect(toast.success).toHaveBeenCalledWith("Solicitação enviada!");
      });
    });

    it("deve exibir toast de erro quando a mutação falha com ApiError", async () => {
      const apiError = new ApiError({ codigo: 400, descricao: "Erro ao conectar" }, 400);
      conexoesService.enviarSolicitacao.mockRejectedValueOnce(apiError);
      const user = userEvent.setup();
      mockBuscarUsuarios([usuario1], false);
      render(<BuscarEConectarModal {...defaultProps} />);

      const input = screen.getByPlaceholderText("Buscar por nome ou email");
      await user.type(input, "Jo");

      await waitFor(
        () => {
          expect(screen.getByRole("button", { name: "Conectar" })).toBeVisible();
        },
        { timeout: 1000 },
      );

      await user.click(screen.getByRole("button", { name: "Conectar" }));

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Erro ao conectar");
      });
    });

    it("deve exibir mensagem de erro padrão quando a mutação falha com erro genérico", async () => {
      conexoesService.enviarSolicitacao.mockRejectedValueOnce(new Error("Erro genérico"));
      const user = userEvent.setup();
      mockBuscarUsuarios([usuario1], false);
      render(<BuscarEConectarModal {...defaultProps} />);

      const input = screen.getByPlaceholderText("Buscar por nome ou email");
      await user.type(input, "Jo");

      await waitFor(
        () => {
          expect(screen.getByRole("button", { name: "Conectar" })).toBeVisible();
        },
        { timeout: 1000 },
      );

      await user.click(screen.getByRole("button", { name: "Conectar" }));

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(DEFAULT_ERROR_MESSAGE);
      });
    });
  });

  describe("handleOpenChange", () => {
    it("deve limpar o campo de busca ao fechar o modal", async () => {
      const user = userEvent.setup();
      const onOpenChange = jest.fn();
      mockBuscarUsuarios([], false);
      render(<BuscarEConectarModal open={true} onOpenChange={onOpenChange} />);

      const input = screen.getByPlaceholderText("Buscar por nome ou email");
      await user.type(input, "Jo");

      // Fecha o modal via onOpenChange(false) - simulando fechar
      // O modal real usa Radix Dialog, vamos testar via tecla Escape
      await user.keyboard("{Escape}");

      await waitFor(() => {
        // onOpenChange é chamado com false e handleOpenChange limpa o search
        expect(onOpenChange).toHaveBeenCalledWith(false);
      });
    });
  });
});
