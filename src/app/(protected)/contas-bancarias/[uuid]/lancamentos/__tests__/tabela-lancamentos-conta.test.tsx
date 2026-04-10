import { render, screen, within } from "@/helpers/test/test-helper";
import { TipoCategoria } from "@/types/enum/tipo-categoria";
import { toCurrency } from "@/helpers/string-helper";

import TabelaLancamentosConta from "../tabela-lancamentos-conta";

const lancamentosMock = [
  {
    uuid: "lanc-1",
    data: "2026-03-20",
    descricao: "Salario",
    valor: 3500,
    categoria: {
      uuid: "cat-1",
      descricao: "Receita",
      tipo: TipoCategoria.ENTRADA,
    },
    conta: {
      uuid: "conta-1",
      descricao: "Conta Principal",
    },
    tags: [],
  },
  {
    uuid: "lanc-2",
    data: "2026-03-21",
    descricao: "Supermercado",
    valor: 180.45,
    categoria: {
      uuid: "cat-2",
      descricao: "Alimentacao",
      tipo: TipoCategoria.SAIDA,
    },
    conta: {
      uuid: "conta-1",
      descricao: "Conta Principal",
    },
    tags: ["mercado"],
  },
];

const getByNormalizedText = (text: string) =>
  screen.getByText((_, node) => node?.textContent?.replace(/\s+/g, " ").trim() === text.replace(/\s+/g, " ").trim());

describe("Componente TabelaLancamentosConta", () => {
  it("deve renderizar cabeçalho e dados formatados dos lançamentos", () => {
    render(<TabelaLancamentosConta lancamentos={lancamentosMock} />);

    expect(screen.getByText("Data")).toBeVisible();
    expect(screen.getByText("Categoria")).toBeVisible();
    expect(screen.getByText("Descrição")).toBeVisible();
    expect(screen.getByText("Valor")).toBeVisible();
    expect(screen.getByText("Ações")).toBeVisible();

    expect(screen.getByText("20/03/2026")).toBeVisible();
    expect(screen.getByText("21/03/2026")).toBeVisible();
    expect(screen.getByText("Receita")).toBeVisible();
    expect(screen.getByText("Alimentacao")).toBeVisible();
    expect(screen.getByText("Salario")).toBeVisible();
    expect(screen.getByText("Supermercado")).toBeVisible();
    expect(getByNormalizedText(toCurrency(3500))).toBeVisible();
    expect(getByNormalizedText(toCurrency(180.45))).toBeVisible();
  });

  it("deve aplicar a cor correta para entrada e saída e renderizar ações por linha", () => {
    render(<TabelaLancamentosConta lancamentos={lancamentosMock} />);

    expect(getByNormalizedText(toCurrency(3500)).closest("td")).toHaveClass("text-positive");
    expect(getByNormalizedText(toCurrency(180.45)).closest("td")).toHaveClass("text-negative");

    const [, ...rows] = screen.getAllByRole("row");
    expect(rows).toHaveLength(2);

    rows.forEach((row) => {
      const utils = within(row);
      expect(utils.getAllByRole("button")).toHaveLength(2);
    });
  });

  it("deve renderizar apenas o cabeçalho quando não houver lançamentos", () => {
    const { container } = render(<TabelaLancamentosConta lancamentos={[]} />);

    expect(screen.getByText("Data")).toBeVisible();
    expect(screen.getByText("Categoria")).toBeVisible();
    expect(screen.getByText("Descrição")).toBeVisible();
    expect(screen.getByText("Valor")).toBeVisible();
    expect(screen.getByText("Ações")).toBeVisible();
    expect(container.querySelectorAll("tbody tr")).toHaveLength(0);
  });
});