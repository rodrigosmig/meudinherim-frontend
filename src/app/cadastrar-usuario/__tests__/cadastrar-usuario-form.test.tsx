import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { DEFAULT_ERROR_MESSAGE } from "@/helpers/route-helpers";
import { catalogoErros } from "@/helpers/erros-helper";
import ApiError from "@/types/application-error";
import { toast } from "@/components/toast";

import CadastrarUsuarioForm from "../cadastrar-usuario-form";

jest.mock("@/services/auth-service", () => ({
  authService: { cadastrarUsuario: jest.fn() },
}));

jest.mock("@/components/toast", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

jest.mock("react-google-recaptcha-v3", () => ({
  useGoogleReCaptcha: jest.fn(),
}));

import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { authService } from "@/services/auth-service";

const mockUseGoogleReCaptcha = useGoogleReCaptcha as jest.Mock;
const mockExecuteRecaptcha = jest.fn();
const mockCadastrarUsuario = authService.cadastrarUsuario as jest.Mock;

const dadosFormulario = {
  nome: "Teste Silva",
  email: "teste@exemplo.com",
  password: "12345678",
  passwordConfirmation: "12345678",
};

function preencherFormulario() {
  const [senhaInput, confirmaSenhaInput] = screen.getAllByLabelText(/Senha/i);
  fireEvent.change(screen.getByLabelText(/Nome/i), { target: { value: dadosFormulario.nome } });
  fireEvent.change(screen.getByLabelText(/E-mail/i), { target: { value: dadosFormulario.email } });
  fireEvent.change(senhaInput, { target: { value: dadosFormulario.password } });
  fireEvent.change(confirmaSenhaInput, { target: { value: dadosFormulario.passwordConfirmation } });
}

describe("CadastrarUsuarioForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockExecuteRecaptcha.mockResolvedValue("mock-recaptcha-token");
    mockUseGoogleReCaptcha.mockReturnValue({ executeRecaptcha: mockExecuteRecaptcha });
  });

  it("renderiza todos os campos do formulário", () => {
    render(<CadastrarUsuarioForm />);
    const [senhaInput, confirmaSenhaInput] = screen.getAllByLabelText(/Senha/i);
    expect(screen.getByLabelText(/Nome/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/E-mail/i)).toBeInTheDocument();
    expect(senhaInput).toBeInTheDocument();
    expect(confirmaSenhaInput).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Cadastrar/i })).toBeInTheDocument();
  });

  it("exibe mensagem de sucesso e envia recaptchaToken ao cadastrar", async () => {
    mockCadastrarUsuario.mockResolvedValueOnce({
      message: { codigo: 0, descricao: "Sucesso" },
      data: { idUsuario: "123" },
    });
    render(<CadastrarUsuarioForm />);
    preencherFormulario();
    fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

    await waitFor(() => {
      expect(mockExecuteRecaptcha).toHaveBeenCalledWith("cadastrar_usuario");
      expect(mockCadastrarUsuario).toHaveBeenCalledWith({
        ...dadosFormulario,
        recaptchaToken: "mock-recaptcha-token",
      });
      expect(toast.success).toHaveBeenCalledWith("Usuário cadastrado com sucesso!");
    });
  });

  it("exibe erro quando reCAPTCHA não está disponível", async () => {
    mockUseGoogleReCaptcha.mockReturnValue({ executeRecaptcha: undefined });

    render(<CadastrarUsuarioForm />);
    preencherFormulario();
    fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "reCAPTCHA não está disponível. Recarregue a página e tente novamente."
      );
      expect(mockCadastrarUsuario).not.toHaveBeenCalled();
    });
  });

  it("exibe erro de campo retornado pela API", async () => {
    mockCadastrarUsuario.mockRejectedValueOnce(
      new ApiError(
        { codigo: catalogoErros.CAMPO_INVALIDO_OU_OBRIGATORIO, descricao: "Campo inválido" },
        422,
        { fields: [{ field: "email", message: "E-mail já cadastrado" }] },
      ),
    );
    render(<CadastrarUsuarioForm />);
    preencherFormulario();
    fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));
    await waitFor(() => {
      expect(screen.getByText("E-mail já cadastrado")).toBeInTheDocument();
      expect(toast.error).toHaveBeenCalledWith("Campo inválido");
    });
  });

  it("exibe erro de e-mail já cadastrado", async () => {
    const mensagem = "O email informado já está sendo utilizado";
    mockCadastrarUsuario.mockRejectedValueOnce(
      new ApiError({ codigo: catalogoErros.EMAIL_JA_CADASTRADO, descricao: mensagem }, 409),
    );
    render(<CadastrarUsuarioForm />);
    preencherFormulario();
    fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(mensagem);
    });
  });

  it("exibe toast genérico em erro inesperado", async () => {
    mockCadastrarUsuario.mockRejectedValueOnce(new Error("unexpected"));
    render(<CadastrarUsuarioForm />);
    preencherFormulario();
    fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(DEFAULT_ERROR_MESSAGE);
    });
  });
});
