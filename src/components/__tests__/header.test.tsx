import { render, screen } from "@/helpers/test/test-helper";

import { Header } from "../header/header";

jest.mock("../header/contas-nav", () => ({
  ContasNav: () => <button aria-label="Contas">Contas</button>,
}));

jest.mock("../header/notificacoes-nav", () => () => (
  <button aria-label="Notificações">Notificações</button>
));

jest.mock("../user-profile", () => () => <div data-testid="user-profile" />);

describe("Componente Header", () => {
  it("deve renderizar botões de ação", () => {
    render(<Header.Root title="Dashboard" />);

    expect(screen.getByRole("button", { name: "Notificações" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Adicionar" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Contas" })).toBeInTheDocument();
    expect(screen.getByTestId("user-profile")).toBeInTheDocument();
  });
});
