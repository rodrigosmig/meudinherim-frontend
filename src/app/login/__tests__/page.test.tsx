import { render, screen } from "@/lib/test-utils";

import LoginPage from "../page";

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

describe("Componente LoginPage", () => {
  it("renderiza corretamente o título e o formulário", () => {
    render(<LoginPage />);
    expect(screen.getByText("MEU DINHEIRIM")).toBeVisible();
    expect(screen.getByLabelText("E-mail")).toBeVisible();
    expect(screen.getByLabelText("Senha")).toBeVisible();
    expect(screen.getByRole("button", { name: "Entrar" })).toBeVisible();
  });

  it("renderiza links de navegação", () => {
    render(<LoginPage />);
    expect(screen.getByText("Esqueci minha senha")).toBeVisible();
    expect(screen.getByText("Cadastre-se")).toBeVisible();

    // Verifica se os links têm os href corretos
    expect(screen.getByRole("link", { name: "Esqueci minha senha" })).toHaveAttribute("href", "/recuperar-senha");
    expect(screen.getByRole("link", { name: "Cadastre-se" })).toHaveAttribute("href", "/cadastrar-usuario");
  });
});