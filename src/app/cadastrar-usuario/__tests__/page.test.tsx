import { render, screen } from "@testing-library/react";

import CadastrarUsuarioPage from "../page";

describe("CadastrarUsuario Page", () => {
  it("renderiza título e formulário", () => {
    render(<CadastrarUsuarioPage />);
    expect(screen.getByText("Criar conta")).toBeInTheDocument();
  });

  it("renderiza link de voltar para login", () => {
    render(<CadastrarUsuarioPage />);
    const link = screen.getByRole("link", { name: /voltar/i });
    expect(link).toHaveAttribute("href", "/login");
  });

  it("renderiza os campos do formulário", () => {
    render(<CadastrarUsuarioPage />);
    const [senhaInput, confirmaSenhaInput] = screen.getAllByLabelText(/Senha/i);
    expect(screen.getByLabelText(/Nome/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/E-mail/i)).toBeInTheDocument();
    expect(senhaInput).toBeInTheDocument();
    expect(confirmaSenhaInput).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Cadastrar/i })).toBeInTheDocument();
  });
});
