import { render, screen } from "@/helpers/test/test-helper";

import RecuperarSenhaPage from "../page";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock("@/services/auth-service", () => ({
  authService: { recuperarSenha: jest.fn() },
}));

describe("RecuperarSenhaPage", () => {
  it("renderiza o título 'Esqueci minha senha'", () => {
    render(<RecuperarSenhaPage />);
    expect(screen.getByText("Esqueci minha senha")).toBeInTheDocument();
  });

  it("renderiza o campo de e-mail e botão", () => {
    render(<RecuperarSenhaPage />);
    expect(screen.getByLabelText("E-mail")).toBeVisible();
    expect(screen.getByRole("button", { name: "Enviar código" })).toBeVisible();
  });

  it("renderiza link de voltar para login", () => {
    render(<RecuperarSenhaPage />);
    const link = screen.getByRole("link", { name: /voltar/i });
    expect(link).toHaveAttribute("href", "/login");
  });
});
