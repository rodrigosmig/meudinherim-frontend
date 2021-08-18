import { render, screen } from "@testing-library/react";
import Home from "../../pages";

describe('Home Component', () => {
  it('renders inputs correctly', () => {
    render(
      <Home />
    )

    expect(screen.getByText("E-mail")).toBeInTheDocument();
    expect(screen.getByText("Senha")).toBeInTheDocument();
  });

  it('renders buttons correctly', () => {
    render(
      <Home />
    )

    expect(screen.getByText("Entrar")).toBeInTheDocument();
    expect(screen.getByText("Cadastrar novo usuário")).toBeInTheDocument();
  });
})