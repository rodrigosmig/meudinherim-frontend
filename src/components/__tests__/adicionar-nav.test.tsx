import { render, screen } from "@/helpers/test/test-helper";
import userEvent from "@testing-library/user-event";

import { AdicionarNav } from "../header/adicionar-nav";

const mockedUseMobile = jest.fn();
jest.mock("@/hooks/use-is-mobile", () => ({
  useMobile: () => mockedUseMobile(),
}));

describe("Componente AdicionarNav", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseMobile.mockReturnValue(false);
  });

  it("deve renderizar o botão de abrir menu", () => {
    render(<AdicionarNav />);

    expect(screen.getByRole("button", { name: "Adicionar" })).toBeInTheDocument();
  });

  it("não deve exibir o menu antes de clicar no botão", () => {
    render(<AdicionarNav />);

    expect(screen.queryByText("Lançamento no cartão")).not.toBeInTheDocument();
  });

  it("deve abrir o menu ao clicar no botão", async () => {
    const user = userEvent.setup();
    render(<AdicionarNav />);

    await user.click(screen.getByRole("button", { name: "Adicionar" }));

    expect(screen.getByText("Adicionar")).toBeVisible();
  });

  it("deve exibir todos os itens ao abrir o menu", async () => {
    const user = userEvent.setup();
    render(<AdicionarNav />);

    await user.click(screen.getByRole("button", { name: "Adicionar" }));

    expect(screen.getByText("Lançamento no cartão")).toBeVisible();
    expect(screen.getByText("Lançamento na conta")).toBeVisible();
    expect(screen.getByText("Categoria")).toBeVisible();
    expect(screen.getByText("Contas a Pagar")).toBeVisible();
    expect(screen.getByText("Contas a Receber")).toBeVisible();
  });

  it("deve exibir os rótulos de seção", async () => {
    const user = userEvent.setup();
    render(<AdicionarNav />);

    await user.click(screen.getByRole("button", { name: "Adicionar" }));

    expect(screen.getByText("Lançamentos")).toBeVisible();
    expect(screen.getByText("Cadastros")).toBeVisible();
    expect(screen.getByText("Agendamentos")).toBeVisible();
  });

  it("deve renderizar os links com os hrefs corretos", async () => {
    const user = userEvent.setup();
    render(<AdicionarNav />);

    await user.click(screen.getByRole("button", { name: "Adicionar" }));

    expect(screen.getByRole("menuitem", { name: /Lançamento no cartão/ })).toHaveAttribute(
      "href",
      "/cartoes-de-credito",
    );
    expect(screen.getByRole("menuitem", { name: /Lançamento na conta/ })).toHaveAttribute(
      "href",
      "/contas-bancarias",
    );
    expect(screen.getByRole("menuitem", { name: /Categoria/ })).toHaveAttribute(
      "href",
      "/categorias",
    );
    expect(screen.getByRole("menuitem", { name: /Contas a Pagar/ })).toHaveAttribute(
      "href",
      "/contas-a-pagar",
    );
    expect(screen.getByRole("menuitem", { name: /Contas a Receber/ })).toHaveAttribute(
      "href",
      "/contas-a-receber",
    );
  });
});
