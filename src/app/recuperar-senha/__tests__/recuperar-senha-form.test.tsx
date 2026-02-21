import * as authService from "@/services/auth-service";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@/lib/test-utils";

import { RecuperarSenhaForm } from "../reuperar-senha-form";

const mockedPush = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockedPush }),
}));

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe("Componente RecuperarSenhaForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve renderizar corretamente", () => {
    render(<RecuperarSenhaForm />);

    expect(screen.getByRole("button", { name: "Enviar e-mail de recuperação" })).toBeVisible();
    expect(screen.getByLabelText("E-mail")).toBeVisible();
  });

  it("deve enviar com sucesso e redirecionar", async () => {
    const mensagemSucesso = "Email de recuperação enviado com sucesso!";
    const email = "test@test.com";

    jest.spyOn(authService, "recuperarSenha").mockResolvedValue({
      ok: true,
      status: 200,
      message: { descricao: mensagemSucesso },
      data: null,
      fields: [],
    } as any);

    render(<RecuperarSenhaForm />);

    const user = userEvent.setup();

    await user.type(screen.getByLabelText("E-mail"), email);
    await user.click(screen.getByRole("button", { name: "Enviar e-mail de recuperação" }));

    expect(authService.recuperarSenha).toHaveBeenCalledWith(email);

    const { toast } = require("sonner");
    expect(toast.success).toHaveBeenCalledWith("Email de recuperação enviado com sucesso!");
    expect(mockedPush).toHaveBeenCalledWith("/login");
  });

  it("deve exibir erro de validação do formulário", async () => {
    const emailInvalido = "invalido";

    render(<RecuperarSenhaForm />);

    jest.spyOn(authService, "recuperarSenha");

    const user = userEvent.setup();
    await user.type(screen.getByLabelText("E-mail"), emailInvalido);
    await user.click(screen.getByRole("button", { name: "Enviar e-mail de recuperação" }));

    expect(screen.getByText("E-mail inválido")).toBeInTheDocument();

    jest.spyOn(authService, "recuperarSenha");
  });

  it("deve exibir erro de validação retornado pelo servidor", async () => {
    const mensagemErro = "E-mail inválido";
    const emailInvalido = "emailinvalido@teste.com";

    jest.spyOn(authService, "recuperarSenha").mockResolvedValue({
      ok: false,
      status: 422,
      message: { descricao: "Erro servidor" },
      data: null,
      fields: [{ field: "email", message: mensagemErro }],
    } as any);

    render(<RecuperarSenhaForm />);

    const user = userEvent.setup();
    await user.type(screen.getByLabelText("E-mail"), emailInvalido);
    await user.click(screen.getByRole("button", { name: "Enviar e-mail de recuperação" }));

    const { toast } = require("sonner");
    expect(authService.recuperarSenha).toHaveBeenCalledWith(emailInvalido);
    expect(toast.error).toHaveBeenCalledWith("Erro servidor");

    expect(screen.getByText(mensagemErro)).toBeInTheDocument();
  });
});