import React from "react";
import { render, screen } from "@/helpers/test/test-helper";
import userEvent from "@testing-library/user-event";

import type { CobrancaEmitida } from "@/types/cobranca";
import { StatusCobranca } from "@/types/enum/status-cobranca";

import TabelaCobrancasEmitidas from "../tabela-cobrancas-emitidas";

// ── mocks ──────────────────────────────────────────────────────────────────

jest.mock("../status-badge", () => ({
  StatusBadge: ({ status }: { status: string }) => (
    <span data-testid="status-badge">{status}</span>
  ),
}));

// ── helpers ────────────────────────────────────────────────────────────────

const cobrancaAberta: CobrancaEmitida = {
  uuid: "cob-1",
  devedor: { id: "user-1", nome: "João Silva", email: "joao@email.com" },
  descricao: "Pagamento de dívida",
  valor: 1500,
  status: StatusCobranca.ABERTO,
  criadoEm: "2025-01-15T10:30:00",
  data: "2025-01-15",
  isParcelado: false,
};

const cobrancaPaga: CobrancaEmitida = {
  uuid: "cob-2",
  devedor: { id: "user-2", nome: "Maria Santos", email: "maria@email.com" },
  descricao: "Assinatura mensal",
  valor: 350,
  status: StatusCobranca.PAGO,
  criadoEm: "2025-01-10T08:00:00",
  pagoEm: "2025-01-11T14:00:00",
  data: "2025-01-10",
  isParcelado: false,
};

const defaultProps = {
  cobrancas: [cobrancaAberta],
  onMarcarComoPaga: jest.fn(),
  onCancelar: jest.fn(),
  isMutating: false,
};

// ── setup ──────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
});

// ── testes ─────────────────────────────────────────────────────────────────

describe("TabelaCobrancasEmitidas", () => {
  describe("renderização básica", () => {
    it("deve renderizar os cabeçalhos da tabela", () => {
      render(<TabelaCobrancasEmitidas {...defaultProps} />);

      expect(screen.getByText("Nome")).toBeVisible();
      expect(screen.getByText("Descrição")).toBeVisible();
      expect(screen.getByText("Data")).toBeVisible();
      expect(screen.getByText("Valor")).toBeVisible();
      expect(screen.getByText("Status")).toBeVisible();
      expect(screen.getByText("Ações")).toBeVisible();
    });

    it("deve renderizar o nome do devedor", () => {
      render(<TabelaCobrancasEmitidas {...defaultProps} />);

      expect(screen.getByText("João Silva")).toBeVisible();
    });

    it("deve renderizar a descrição da cobrança", () => {
      render(<TabelaCobrancasEmitidas {...defaultProps} />);

      expect(screen.getByText("Pagamento de dívida")).toBeVisible();
    });

    it("deve renderizar o valor formatado", () => {
      render(<TabelaCobrancasEmitidas {...defaultProps} />);

      expect(screen.getByText("R$ 1.500,00")).toBeVisible();
    });

    it("deve renderizar o status badge", () => {
      render(<TabelaCobrancasEmitidas {...defaultProps} />);

      expect(screen.getByTestId("status-badge")).toHaveTextContent("ABERTO");
    });
  });

  describe("botões de ação — status ABERTO", () => {
    it("deve exibir botão Marcar como pago", () => {
      render(<TabelaCobrancasEmitidas {...defaultProps} />);

      expect(
        screen.getByRole("button", { name: "Marcar como pago" }),
      ).toBeVisible();
    });

    it("deve exibir botão Cancelar", () => {
      render(<TabelaCobrancasEmitidas {...defaultProps} />);

      expect(
        screen.getByRole("button", { name: "Cancelar" }),
      ).toBeVisible();
    });

    it("deve chamar onMarcarComoPaga ao clicar no botão", async () => {
      const onMarcarComoPaga = jest.fn();
      const user = userEvent.setup();

      render(
        <TabelaCobrancasEmitidas
          {...defaultProps}
          onMarcarComoPaga={onMarcarComoPaga}
        />,
      );

      await user.click(
        screen.getByRole("button", { name: "Marcar como pago" }),
      );

      expect(onMarcarComoPaga).toHaveBeenCalledWith({
        uuid: "cob-1",
        nomeDevedor: "João Silva",
      });
    });

    it("deve chamar onCancelar ao clicar no botão", async () => {
      const onCancelar = jest.fn();
      const user = userEvent.setup();

      render(
        <TabelaCobrancasEmitidas
          {...defaultProps}
          onCancelar={onCancelar}
        />,
      );

      await user.click(screen.getByRole("button", { name: "Cancelar" }));

      expect(onCancelar).toHaveBeenCalledWith({
        uuid: "cob-1",
        nomeDevedor: "João Silva",
      });
    });

    it("deve desabilitar botões quando isMutating é true", () => {
      render(
        <TabelaCobrancasEmitidas {...defaultProps} isMutating={true} />,
      );

      const botoes = screen.getAllByRole("button");
      botoes.forEach((btn) => {
        expect(btn).toBeDisabled();
      });
    });
  });

  describe("botões de ação — outros status", () => {
    it("não deve exibir botões de ação para status PAGO", () => {
      render(
        <TabelaCobrancasEmitidas
          {...defaultProps}
          cobrancas={[cobrancaPaga]}
        />,
      );

      expect(
        screen.queryByRole("button", { name: "Marcar como pago" }),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: "Cancelar" }),
      ).not.toBeInTheDocument();
    });
  });
});
