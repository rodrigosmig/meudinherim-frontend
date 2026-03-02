import { DEFAULT_ERROR_MESSAGE } from '@/helpers/route-helpers';
import { render, screen } from "@/helpers/test/test-helper";
import { recuperarSenha } from "@/services/auth-service";
import * as authService from "@/services/auth-service";
import { catalogoErros } from '@/helpers/erros-helper';
import userEvent from "@testing-library/user-event";
import ApiError from '@/types/application-error';
import { toast } from "@/components/toast";

import { RecuperarSenhaForm } from "../recuperar-senha-form";

const mockedPush = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockedPush }),
}));

jest.mock("@/components/toast", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('@/services/auth-service');
const mockRecuperarSenha = recuperarSenha as jest.Mock;

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
    mockRecuperarSenha.mockResolvedValueOnce({
      message: { codigo: 0, descricao: 'Sucesso' },
      data: {}
    });

    const mensagemSucesso = "Email de recuperação enviado com sucesso!";
    const email = "test@test.com";

    render(<RecuperarSenhaForm />);

    const user = userEvent.setup();

    await user.type(screen.getByLabelText("E-mail"), email);
    await user.click(screen.getByRole("button", { name: "Enviar e-mail de recuperação" }));

    expect(authService.recuperarSenha).toHaveBeenCalledWith({ email });

    expect(toast.success).toHaveBeenCalledWith(mensagemSucesso);
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
    const mensagemErro = "E-mail já cadastrado";
    const emailInvalido = "emailinvalido@teste.com";
    mockRecuperarSenha.mockRejectedValueOnce(
      new ApiError(
        { codigo: catalogoErros.CAMPO_INVALIDO_OU_OBRIGATORIO, descricao: mensagemErro },
        422,
        { fields: [{ field: 'email', message: mensagemErro }] },
      ),
    );

    render(<RecuperarSenhaForm />);

    const user = userEvent.setup();
    await user.type(screen.getByLabelText("E-mail"), emailInvalido);
    await user.click(screen.getByRole("button", { name: "Enviar e-mail de recuperação" }));

    expect(authService.recuperarSenha).toHaveBeenCalledWith({ email: emailInvalido });
    expect(toast.error).toHaveBeenCalledWith(mensagemErro);

    expect(screen.getByText(mensagemErro)).toBeInTheDocument();
  });

  it("deve exibir erro genérico retornado pelo servidor", async () => {
    const mensagemErro = "Erro desconhecido";
    const emailInvalido = "emailinvalido@teste.com";

    mockRecuperarSenha.mockRejectedValueOnce(new ApiError({ codigo: -999, descricao: mensagemErro }, 500));

    render(<RecuperarSenhaForm />);

    const user = userEvent.setup();
    await user.type(screen.getByLabelText("E-mail"), emailInvalido);
    await user.click(screen.getByRole("button", { name: "Enviar e-mail de recuperação" }));

    expect(authService.recuperarSenha).toHaveBeenCalledWith({ email: emailInvalido });
    expect(toast.error).toHaveBeenCalledWith(mensagemErro);
  });

  it('deve exibir mensagem default quando ocorrer erro inesperado', async () => {
    mockRecuperarSenha.mockRejectedValueOnce(new Error('boom'));

    render(<RecuperarSenhaForm />);

    const user = userEvent.setup();
    await user.type(screen.getByLabelText("E-mail"), "teste@teste.com");
    await user.click(screen.getByRole("button", { name: "Enviar e-mail de recuperação" }));

    expect(toast.error).toHaveBeenCalledWith(DEFAULT_ERROR_MESSAGE);
  });
});