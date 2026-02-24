import { render, screen } from "@/lib/test-utils";

import RecuperarSenha from "../page";

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

describe("Página RecuperarSenha", () => {
  it("renderiza corretamente o título e o formulário", () => {
    render(<RecuperarSenha />);
    expect(screen.getByText("Recuperar senha")).toBeVisible();
    expect(screen.getByLabelText("E-mail")).toBeVisible();
    expect(screen.getByLabelText("Voltar")).toBeVisible();
    expect(screen.getByRole("button", { name: "Enviar e-mail de recuperação" })).toBeVisible();
  });
});