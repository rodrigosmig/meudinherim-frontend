import React from "react";
import { render, screen } from "@/helpers/test/test-helper";
import userEvent from "@testing-library/user-event";

import type { CobrancaRecebida } from "@/types/cobranca";
import { StatusCobranca } from "@/types/enum/status-cobranca";

import TabelaCobrancasRecebidas from "../tabela-cobrancas-recebidas";

// ── mocks ──────────────────────────────────────────────────────────────────

jest.mock("../status-badge", () => ({
  StatusBadge: ({ status }: { status: string }) => (
    <span data-testid="status-badge">{status}</span>
  ),
}));

// ── helpers ────────────────────────────────────────────────────────────────

const cobrancaAberta: CobrancaRecebida = {
  uuid: "cob-rec-1",
  cobrador: { id: "user-1", nome: "Carlos Oliveira", email: "carlos@email.com" },
  descricao: "Mensalidade escolar",
  valor: 2500,
  status: StatusCobranca.ABERTO,
  criadoEm: "2025-02-01T10:00:00",
  gerouContaAPagar: false,
  data: "2025-02-01",
  isParcelado: false,
};

const cobrancaComContaGerada: CobrancaRecebida = {
  uuid: "cob-rec-2",
  cobrador: { id: "user-2", nome: "Ana Pereira", email: "ana@email.com" },
  descricao: "Taxa de condomínio",
  valor: 450,
  status: StatusCobranca.ABERTO,
  criadoEm: "2025-01-20T08:30:00",
  gerouContaAPagar: true,
  data: "2025-01-20",
  isParcelado: false,
};

const cobrancaPaga: CobrancaRecebida = {
  uuid: "cob-rec-3",
  cobrador: { id: "user-3", nome: "Roberto Lima", email: "roberto@email.com" },
  descricao: "Serviço de consultoria",
  valor: 1200,
  status: StatusCobranca.PAGO,
  criadoEm: "2025-01-05T09:00:00",
  pagoEm: "2025-01-06T14:00:00",
  gerouContaAPagar: true,
  data: "2025-01-05",
  isParcelado: false,
};

const defaultProps = {
  cobrancas: [cobrancaAberta],
  onGerarContaAPagar: jest.fn(),
  onMarcarComoPaga: jest.fn(),
  isMutating: false,
};

// ── setup ──────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
});

// ── testes ─────────────────────────────────────────────────────────────────

describe("TabelaCobrancasRecebidas", () => {
  describe("renderização básica", () => {
    it("deve renderizar os cabeçalhos da tabela", () => {
      render(<TabelaCobrancasRecebidas {...defaultProps} />);

      expect(screen.getByText("Nome")).toBeVisible();
      expect(screen.getByText("Descrição")).toBeVisible();
      expect(screen.getByText("Data")).toBeVisible();
      expect(screen.getByText("Valor")).toBeVisible();
      expect(screen.getByText("Status")).toBeVisible();
      expect(screen.getByText("Ações")).toBeVisible();
    });

    it("deve renderizar o nome do cobrador", () => {
      render(<TabelaCobrancasRecebidas {...defaultProps} />);

      expect(screen.getByText("Carlos Oliveira")).toBeVisible();
    });

    it("deve renderizar a descrição da cobrança", () => {
      render(<TabelaCobrancasRecebidas {...defaultProps} />);

      expect(screen.getByText("Mensalidade escolar")).toBeVisible();
    });

    it("deve renderizar o valor formatado", () => {
      render(<TabelaCobrancasRecebidas {...defaultProps} />);

      expect(screen.getByText("R$ 2.500,00")).toBeVisible();
    });

    it("deve renderizar o status badge", () => {
      render(<TabelaCobrancasRecebidas {...defaultProps} />);

      expect(screen.getByTestId("status-badge")).toHaveTextContent("ABERTO");
    });

    it("deve renderizar múltiplas linhas", () => {
      render(
        <TabelaCobrancasRecebidas
          {...defaultProps}
          cobrancas={[cobrancaAberta, cobrancaPaga]}
        />,
      );

      expect(screen.getByText("Carlos Oliveira")).toBeVisible();
      expect(screen.getByText("Roberto Lima")).toBeVisible();
    });
  });

  describe("botões de ação — status ABERTO", () => {
    it("deve exibir botão Gerar conta a pagar", () => {
      render(<TabelaCobrancasRecebidas {...defaultProps} />);

      expect(
        screen.getByRole("button", { name: "Gerar conta a pagar" }),
      ).toBeVisible();
    });

    it("deve exibir botão Marcar como pago", () => {
      render(<TabelaCobrancasRecebidas {...defaultProps} />);

      expect(
        screen.getByRole("button", { name: "Marcar como pago" }),
      ).toBeVisible();
    });

    it("deve chamar onGerarContaAPagar ao clicar no botão", async () => {
      const onGerarContaAPagar = jest.fn();
      const user = userEvent.setup();

      render(
        <TabelaCobrancasRecebidas
          {...defaultProps}
          onGerarContaAPagar={onGerarContaAPagar}
        />,
      );

      await user.click(
        screen.getByRole("button", { name: "Gerar conta a pagar" }),
      );

      expect(onGerarContaAPagar).toHaveBeenCalledWith("cob-rec-1");
    });

    it("deve chamar onMarcarComoPaga ao clicar no botão", async () => {
      const onMarcarComoPaga = jest.fn();
      const user = userEvent.setup();

      render(
        <TabelaCobrancasRecebidas
          {...defaultProps}
          onMarcarComoPaga={onMarcarComoPaga}
        />,
      );

      await user.click(
        screen.getByRole("button", { name: "Marcar como pago" }),
      );

      expect(onMarcarComoPaga).toHaveBeenCalledWith({
        uuid: "cob-rec-1",
        nomeCobrador: "Carlos Oliveira",
      });
    });

    it("deve desabilitar botão Gerar conta a pagar quando gerouContaAPagar é true", () => {
      render(
        <TabelaCobrancasRecebidas
          {...defaultProps}
          cobrancas={[cobrancaComContaGerada]}
        />,
      );

      const btn = screen.getByRole("button", { name: "Conta gerada" });
      expect(btn).toBeDisabled();
    });

    it("deve desabilitar botões quando isMutating é true", () => {
      render(<TabelaCobrancasRecebidas {...defaultProps} isMutating={true} />);

      const botoes = screen.getAllByRole("button");
      botoes.forEach((btn) => {
        expect(btn).toBeDisabled();
      });
    });
  });

  describe("botões de ação — outros status", () => {
    it("não deve exibir botões de ação para status PAGO", () => {
      render(
        <TabelaCobrancasRecebidas
          {...defaultProps}
          cobrancas={[cobrancaPaga]}
        />,
      );

      expect(
        screen.queryByRole("button", { name: "Gerar conta a pagar" }),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: "Marcar como pago" }),
      ).not.toBeInTheDocument();
    });
  });
});
