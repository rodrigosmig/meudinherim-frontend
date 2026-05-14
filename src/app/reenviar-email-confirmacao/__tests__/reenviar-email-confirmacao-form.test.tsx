import { authService } from "@/services/auth-service";
import { DEFAULT_ERROR_MESSAGE } from '@/helpers/route-helpers';
import { render, screen } from "@/helpers/test/test-helper";
import { catalogoErros } from '@/helpers/erros-helper';
import userEvent from "@testing-library/user-event";
import ApiError from '@/types/application-error';
import { toast } from "@/components/toast";

import ReenviarEmailConfirmacaoForm from "../reenviar-email-confirmacao-form";

const mockedPush = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockedPush }),
}));

jest.mock("@/components/toast", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock("@/services/auth-service", () => ({
  authService: {
    reenviarEmailConfirmacao: jest.fn(),
  },
}));
const mockReenviarEmailConfirmacao = authService.reenviarEmailConfirmacao as jest.Mock;

describe("Componente ReenviarEmailConfirmacaoForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve renderizar corretamente", () => {
    render(<ReenviarEmailConfirmacaoForm />);

    expect(screen.getByRole("button", { name: "Reenviar e-mail" })).toBeVisible();
    expect(screen.getByLabelText("E-mail")).toBeVisible();
  });

  it("deve enviar com sucesso e redirecionar", async () => {
    mockReenviarEmailConfirmacao.mockResolvedValueOnce({
      type: "success",
      data: {},
      message: { codigo: 0, descricao: 'Sucesso' }
    });

    const mensagemSucesso = "Email de confirmação de conta enviado com sucesso!";
    const email = "test@email.com";

    render(<ReenviarEmailConfirmacaoForm />);

    const user = userEvent.setup();

    await user.type(screen.getByLabelText("E-mail"), email);
    await user.click(screen.getByRole("button", { name: "Reenviar e-mail" }));

    expect(authService.reenviarEmailConfirmacao).toHaveBeenCalledWith({ email });
    expect(toast.success).toHaveBeenCalledWith(mensagemSucesso);
    expect(mockedPush).toHaveBeenCalledWith("/login");
  });

  it("deve exibir erro de validação do formulário", async () => {
    const emailInvalido = "invalido";

    render(<ReenviarEmailConfirmacaoForm />);

    const user = userEvent.setup();

    await user.type(screen.getByLabelText("E-mail"), emailInvalido);
    await user.click(screen.getByRole("button", { name: "Reenviar e-mail" }));

    expect(screen.getByText("E-mail inválido")).toBeInTheDocument();
  });

  it("deve exibir erro de campo vindo da API", async () => {
    const mensagemErro = "Email inválido";
    const emailInvalido = "emailinvalido@teste.com";

    mockReenviarEmailConfirmacao.mockRejectedValueOnce(
      new ApiError(
        { codigo: catalogoErros.CAMPO_INVALIDO_OU_OBRIGATORIO, descricao: 'Erro de campo' },
        400,
        {
          fields: [
            { field: "email", message: mensagemErro },
          ],
        }
      )
    );

    render(<ReenviarEmailConfirmacaoForm />);

    const user = userEvent.setup();

    await user.type(screen.getByLabelText("E-mail"), emailInvalido);
    await user.click(screen.getByRole("button", { name: "Reenviar e-mail" }));

    expect(authService.reenviarEmailConfirmacao).toHaveBeenCalledWith({ email: emailInvalido });
    expect(toast.error).toHaveBeenCalledWith("Erro de campo");
    expect(screen.getByText(mensagemErro)).toBeInTheDocument();
  });

  it("deve exibir erro genérico se a resposta não for esperada", async () => {
    mockReenviarEmailConfirmacao.mockRejectedValueOnce(
      new ApiError({ codigo: -999, descricao: "Erro desconhecido" }, 500),
    );

    render(<ReenviarEmailConfirmacaoForm />);

    const user = userEvent.setup();

    await user.type(screen.getByLabelText("E-mail"), "test@email.com");
    await user.click(screen.getByRole("button", { name: "Reenviar e-mail" }));

    expect(toast.error).toHaveBeenCalled();
  });

  it('deve exibir mensagem default quando ocorrer erro inesperado', async () => {
    mockReenviarEmailConfirmacao.mockRejectedValueOnce(new Error('boom'));

    render(<ReenviarEmailConfirmacaoForm />);

    const user = userEvent.setup();

    await user.type(screen.getByLabelText("E-mail"), "teste@teste.com");
    await user.click(screen.getByRole("button", { name: "Reenviar e-mail" }));

    expect(toast.error).toHaveBeenCalledWith(DEFAULT_ERROR_MESSAGE);
  });
});
