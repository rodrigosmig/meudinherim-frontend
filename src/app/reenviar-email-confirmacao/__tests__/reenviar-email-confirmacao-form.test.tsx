import { reenviarEmailConfirmacao } from "@/services/auth-service";
import * as authService from "@/services/auth-service";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@/lib/test-utils";
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

jest.mock("@/services/auth-service");
const mockReenviarEmailConfirmacao = reenviarEmailConfirmacao as jest.Mock;

describe("Componente ReenviarEmailConfirmacaoForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve renderizar corretamente", () => {
    render(<ReenviarEmailConfirmacaoForm />);

    expect(screen.getByRole("button", { name: "Reenviar e-mail de confirmação" })).toBeVisible();
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
    await user.click(screen.getByRole("button", { name: "Reenviar e-mail de confirmação" }));

    expect(authService.reenviarEmailConfirmacao).toHaveBeenCalledWith({ email });
    expect(toast.success).toHaveBeenCalledWith(mensagemSucesso);
    expect(mockedPush).toHaveBeenCalledWith("/login");
  });

  it("deve exibir erro de validação do formulário", async () => {
    const emailInvalido = "invalido";

    render(<ReenviarEmailConfirmacaoForm />);

    const user = userEvent.setup();

    await user.type(screen.getByLabelText("E-mail"), emailInvalido);
    await user.click(screen.getByRole("button", { name: "Reenviar e-mail de confirmação" }));

    expect(screen.getByText("E-mail inválido")).toBeInTheDocument();
  });

  it("deve exibir erro de campo vindo da API", async () => {
    const mensagemErro = "Email inválido";
    const emailInvalido = "emailinvalido@teste.com";

    mockReenviarEmailConfirmacao.mockResolvedValueOnce({
      data: {
        fields: [
          { field: "email", message: mensagemErro },
        ],
      },
      message: { descricao: "Erro de campo" },
      type: "form_error",
    });

    render(<ReenviarEmailConfirmacaoForm />);

    const user = userEvent.setup();

    await user.type(screen.getByLabelText("E-mail"), emailInvalido);
    await user.click(screen.getByRole("button", { name: "Reenviar e-mail de confirmação" }));

    expect(authService.reenviarEmailConfirmacao).toHaveBeenCalledWith({ email: emailInvalido });
    expect(toast.error).toHaveBeenCalledWith("Erro de campo");
    expect(screen.getByText(mensagemErro)).toBeInTheDocument();
  });

  it("deve exibir erro genérico se a resposta não for esperada", async () => {
    mockReenviarEmailConfirmacao.mockResolvedValueOnce({
      type: "error",
      message: { descricao: "Erro desconhecido" },
    });

    render(<ReenviarEmailConfirmacaoForm />);

    const user = userEvent.setup();

    await user.type(screen.getByLabelText("E-mail"), "test@email.com");
    await user.click(screen.getByRole("button", { name: "Reenviar e-mail de confirmação" }));

    expect(toast.error).toHaveBeenCalled();
  });
});
