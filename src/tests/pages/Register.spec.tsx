import { render, screen } from "@testing-library/react";
import Register from "../../pages/register";

describe('Register Component', () => {
  it('renders inputs correctly', () => {
    render(
      <Register />
    )

    expect(screen.getByText("Nome")).toBeInTheDocument();
    expect(screen.getByText("E-mail")).toBeInTheDocument();
    expect(screen.getByText("Senha")).toBeInTheDocument();
    expect(screen.getByText("Confirmação de Senha")).toBeInTheDocument();
  });

  it('renders buttons correctly', () => {
    render(
      <Register />
    )

    expect(screen.getByText("Cadastrar")).toBeInTheDocument();
    expect(screen.getByText("Já tenho um usuário")).toBeInTheDocument();
  });
})