import { render, screen, waitFor } from "@/helpers/test/test-helper";
import { DEFAULT_ERROR_MESSAGE } from '@/helpers/route-helpers';
import { catalogoErros } from '@/helpers/erros-helper';
import userEvent from "@testing-library/user-event";
import ApiError from '@/types/application-error';
import { toast } from "@/components/toast";

import { LoginForm } from "../login-form";

const mockedPush = jest.fn();
const mockedRefresh = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockedPush, refresh: mockedRefresh }),
}));

jest.mock("@/components/toast", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const mockedLogin = jest.fn();

jest.mock('@/contexts/auth-context', () => ({
  useAuth: () => ({ login: mockedLogin }),
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
    const email = "test@test.com";
    const senha = "senhaValida";

    mockedLogin.mockResolvedValueOnce({
      message: { codigo: 0, descricao: 'Sucesso' },
      data: { token: 'abc', user: { id: 'u1', nome: 'User' } }
    });

    render(<LoginForm />);

    const user = userEvent.setup();

    await user.type(screen.getByLabelText("E-mail"), email);
    await user.type(screen.getByLabelText("Senha"), senha);
    await user.click(screen.getByRole("button", { name: "Entrar" }));

    expect(mockedLogin).toHaveBeenCalledWith({ email, password: senha });

    expect(mockedPush).toHaveBeenCalledWith("/");
    expect(mockedRefresh).not.toHaveBeenCalled();
  });

  it("deve exibir erro de validação do formulário", async () => {
    render(<LoginForm />);

    const user = userEvent.setup();
    await user.type(screen.getByLabelText("E-mail"), "invalido");
    await user.click(screen.getByRole("button", { name: "Entrar" }));

    expect(screen.getByText("Digite um e-mail válido")).toBeInTheDocument();
    expect(screen.getByText("A senha é obrigatória")).toBeInTheDocument();

    expect(mockedLogin).not.toHaveBeenCalled();
  });

  it("deve exibir erro de validação retornado pela API", async () => {
    const mensagemErro = "Credenciais inválidas";
    const emailInvalido = "emailinvalido@teste.com";

    mockedLogin.mockRejectedValueOnce(
      new ApiError(
        { codigo: catalogoErros.CAMPO_INVALIDO_OU_OBRIGATORIO, descricao: mensagemErro },
        422,
        { fields: [{ field: 'email', message: 'E-mail inválido' }] },
      ),
    );

    render(<LoginForm />);

    const user = userEvent.setup();
    await user.type(screen.getByLabelText("E-mail"), emailInvalido);
    await user.type(screen.getByLabelText("Senha"), "senhaInvalida");
    await user.click(screen.getByRole("button", { name: "Entrar" }));

    expect(toast.error).toHaveBeenCalledWith(mensagemErro);

    expect(screen.getByText("E-mail inválido")).toBeInTheDocument();
    expect(mockedLogin).toHaveBeenCalledWith({ email: emailInvalido, password: "senhaInvalida" });
  });

  it('deve exibir erro genérico retornado pela API', async () => {
    const messageError = 'Erro ao efetuar login';

    mockedLogin.mockRejectedValueOnce(new ApiError({ codigo: -999, descricao: messageError }, 500));
    render(<LoginForm />);

    const user = userEvent.setup();
    await user.type(screen.getByLabelText("E-mail"), "teste@teste.com");
    await user.type(screen.getByLabelText("Senha"), "senhaValida");
    await user.click(screen.getByRole("button", { name: "Entrar" }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(messageError);
    });
  });

  it('deve exibir mensagem default quando ocorrer erro inesperado', async () => {
    mockedLogin.mockRejectedValueOnce(new Error('boom'));

    render(<LoginForm />);

    const user = userEvent.setup();
    await user.type(screen.getByLabelText("E-mail"), "teste@teste.com");
    await user.type(screen.getByLabelText("Senha"), "senhaValida");
    await user.click(screen.getByRole("button", { name: "Entrar" }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(DEFAULT_ERROR_MESSAGE);
    });
  });
});