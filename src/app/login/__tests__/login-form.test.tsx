import * as authService from "@/services/auth-service";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@/lib/test-utils";

import { LoginForm } from "../login-form";

const mockedPush = jest.fn();
const mockedRefresh = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockedPush, refresh: mockedRefresh }),
}));

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe("Componente LoginForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve renderizar corretamente", () => {
    render(<LoginForm />);

    expect(screen.getByLabelText("E-mail")).toBeVisible();
    expect(screen.getByLabelText("Senha")).toBeVisible();
    expect(screen.getByRole("button", { name: "Entrar" })).toBeVisible();
  });

  it("deve fazer login com sucesso", async () => {
    const mensagemSucesso = "Login realizado com sucesso!";
    const email = "test@test.com";
    const senha = "senhaValida";

    jest.spyOn(authService, "login").mockResolvedValue({
      ok: true,
      status: 200,
      message: { descricao: mensagemSucesso },
      data: null,
      fields: [],
    } as any);

    render(<LoginForm />);

    const user = userEvent.setup();

    await user.type(screen.getByLabelText("E-mail"), email);
    await user.type(screen.getByLabelText("Senha"), senha);
    await user.click(screen.getByRole("button", { name: "Entrar" }));

    expect(authService.login).toHaveBeenCalledWith(email, senha);

    expect(mockedPush).toHaveBeenCalledWith("/");
    expect(mockedRefresh).toHaveBeenCalled();
  });

  it("deve exibir erro de validação do formulário", async () => {
    render(<LoginForm />);

    const user = userEvent.setup();
    await user.type(screen.getByLabelText("E-mail"), "invalido");
    await user.click(screen.getByRole("button", { name: "Entrar" }));

    expect(screen.getByText("Digite um e-mail válido")).toBeInTheDocument();
    expect(screen.getByText("A senha é obrigatória")).toBeInTheDocument();

    expect(authService.login).not.toHaveBeenCalled();
  });

  it("deve exibir erro de validação retornado pelo servidor", async () => {
    const mensagemErro = "Credenciais inválidas";
    const emailInvalido = "emailinvalido@teste.com";

    jest.spyOn(authService, "login").mockResolvedValue({
      ok: false,
      status: 422,
      message: { descricao: mensagemErro },
      data: null,
      fields: [{ field: "email", message: "E-mail inválido" }],
    } as any);

    render(<LoginForm />);

    const user = userEvent.setup();
    await user.type(screen.getByLabelText("E-mail"), emailInvalido);
    await user.type(screen.getByLabelText("Senha"), "senhaInvalida");
    await user.click(screen.getByRole("button", { name: "Entrar" }));

    const { toast } = require("sonner");
    expect(toast.error).toHaveBeenCalledWith(mensagemErro);
    expect(screen.getByText("E-mail inválido")).toBeInTheDocument();
    expect(authService.login).toHaveBeenCalledWith(emailInvalido, "senhaInvalida");
  });
});