import { render, screen } from "@/helpers/test/test-helper";

import LoginPage from "../page";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

describe("LoginPage", () => {
  it("renderiza o formulário de login", () => {
    render(<LoginPage />);
    expect(screen.getByLabelText("E-mail")).toBeVisible();
    expect(screen.getByLabelText("Senha")).toBeVisible();
    expect(screen.getByRole("button", { name: "Entrar" })).toBeVisible();
  });

  it("renderiza o título do layout", () => {
    render(<LoginPage />);
    expect(screen.getByText("Bem-vindo de volta")).toBeInTheDocument();
  });

  it("renderiza links de navegação", () => {
    render(<LoginPage />);
    expect(screen.getByRole("link", { name: "Esqueci minha senha" })).toHaveAttribute("href", "/recuperar-senha");
    expect(screen.getByRole("link", { name: "Cadastre-se" })).toHaveAttribute("href", "/cadastrar-usuario");
  });
});
