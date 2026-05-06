import React from "react";
import { render, screen, within } from "@/helpers/test/test-helper";

import { Fatura } from "@/types/faturas";
import { StatusFatura } from "@/types/enum/status-fatura";

import TabelaFaturas from "../tabela-faturas";

// ── mocks ──────────────────────────────────────────────────────────────────

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

// ── helpers ────────────────────────────────────────────────────────────────

const idCartao = "cartao-1";

const faturaAberta: Fatura = {
  uuid: "fatura-1",
  dataVencimento: "2026-05-10",
  dataFechamento: "2026-05-03",
  valorTotal: 1500,
  status: StatusFatura.ABERTO,
  isFechada: false,
  cartao: { uuid: idCartao, descricao: "Nubank" },
};

const faturaPaga: Fatura = {
  uuid: "fatura-2",
  dataVencimento: "2026-04-10",
  dataFechamento: "2026-04-03",
  valorTotal: 800,
  status: StatusFatura.PAGO,
  isFechada: true,
  cartao: { uuid: idCartao, descricao: "Nubank" },
};

const faturaAntecipada: Fatura = {
  uuid: "fatura-3",
  dataVencimento: "2026-03-10",
  dataFechamento: "2026-03-03",
  valorTotal: 200,
  status: StatusFatura.FECHADO,
  isFechada: true,
  cartao: { uuid: idCartao, descricao: "Nubank" },
};

// ── testes ─────────────────────────────────────────────────────────────────

describe("TabelaFaturas", () => {
  describe("renderização", () => {
    it("deve renderizar as colunas do cabeçalho", () => {
      render(<TabelaFaturas idCartao={idCartao} faturas={[]} />);
      expect(screen.getByText("Vencimento")).toBeVisible();
      expect(screen.getByText("Fechamento")).toBeVisible();
      expect(screen.getByText("Valor Total")).toBeVisible();
      expect(screen.getByText("Status")).toBeVisible();
      expect(screen.getByText("Ações")).toBeVisible();
    });

    it("deve renderizar datas e valor formatados", () => {
      render(<TabelaFaturas idCartao={idCartao} faturas={[faturaAberta]} />);
      expect(screen.getByText("10/05/2026")).toBeVisible();
      expect(screen.getByText("03/05/2026")).toBeVisible();
      expect(screen.getByText(/1\.500,00/)).toBeVisible();
    });

    it("deve renderizar múltiplas faturas", () => {
      render(<TabelaFaturas idCartao={idCartao} faturas={[faturaAberta, faturaPaga]} />);
      const [, ...rows] = screen.getAllByRole("row");
      expect(rows).toHaveLength(2);
    });
  });

  describe("badge de status", () => {
    it("deve exibir 'Em aberto' para status ABERTO", () => {
      render(<TabelaFaturas idCartao={idCartao} faturas={[faturaAberta]} />);
      expect(screen.getByText("Em aberto")).toBeVisible();
    });

    it("deve exibir 'Pago' para status PAGO", () => {
      render(<TabelaFaturas idCartao={idCartao} faturas={[faturaPaga]} />);
      expect(screen.getByText("Pago")).toBeVisible();
    });

    it("deve exibir 'Fechado' para status FECHADO", () => {
      render(<TabelaFaturas idCartao={idCartao} faturas={[faturaAntecipada]} />);
      expect(screen.getByText("Fechado")).toBeVisible();
    });
  });

  describe("botão de ação", () => {
    it("deve renderizar 1 botão de ação por linha", () => {
      render(<TabelaFaturas idCartao={idCartao} faturas={[faturaAberta]} />);
      const [, row] = screen.getAllByRole("row");
      expect(within(row).getAllByRole("button")).toHaveLength(1);
    });

    it("deve renderizar link apontando para a página da fatura", () => {
      render(<TabelaFaturas idCartao={idCartao} faturas={[faturaAberta]} />);
      const link = screen.getByRole("link");
      expect(link).toHaveAttribute(
        "href",
        `/cartoes-de-credito/${idCartao}/faturas/fatura-1`,
      );
    });
  });
});
