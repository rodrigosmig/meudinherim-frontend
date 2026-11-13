import React from "react";
import { render, screen } from "@/helpers/test/test-helper";

import { DonutChart } from "../donut-chart";
import { CategoriaValor } from "@/types/dashboard";

jest.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  PieChart: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  Pie: ({ data }: { data: CategoriaValor[] }) => (
    <div
      data-testid="pie"
      data-categories={data.map((item) => item.categoriaNome).join(",")}
    />
  ),
  Cell: () => null,
}));

const dados: CategoriaValor[] = [
  {
    categoriaUuid: "cat-1",
    categoriaNome: "Alimentação",
    valor: 100,
    percentual: 40,
    exibirEmRelatorios: true,
  },
  {
    categoriaUuid: "cat-2",
    categoriaNome: "Transporte",
    valor: 50,
    percentual: 20,
    exibirEmRelatorios: true,
  },
  {
    categoriaUuid: "cat-3",
    categoriaNome: "Categoria oculta",
    valor: 900,
    percentual: 40,
    exibirEmRelatorios: false,
  },
];

describe("DonutChart", () => {
  it("deve renderizar apenas categorias com exibirEmRelatorios true", () => {
    render(<DonutChart dados={dados} titulo="Saídas" accentColor="#f87171" />);

    expect(screen.getByTestId("pie")).toHaveAttribute(
      "data-categories",
      "Alimentação,Transporte",
    );
    expect(screen.getByText("Alimentação")).toBeVisible();
    expect(screen.getByText("Transporte")).toBeVisible();
    expect(screen.queryByText("Categoria oculta")).not.toBeInTheDocument();
  });

  it("deve somar apenas as categorias exibidas em relatórios", () => {
    render(<DonutChart dados={dados} titulo="Saídas" accentColor="#f87171" />);

    expect(screen.getByText(/150,00/)).toBeVisible();
  });
});
