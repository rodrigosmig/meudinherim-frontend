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

import { authService } from "@/services/auth-service";
const mockCadastrarUsuario = authService.cadastrarUsuario as jest.Mock;

function preencherFormulario() {
  const [senhaInput, confirmaSenhaInput] = screen.getAllByLabelText(/Senha/i);
  fireEvent.change(screen.getByLabelText(/Nome/i), { target: { value: "Teste Silva" } });
  fireEvent.change(screen.getByLabelText(/E-mail/i), { target: { value: "teste@exemplo.com" } });
  fireEvent.change(senhaInput, { target: { value: "12345678" } });
  fireEvent.change(confirmaSenhaInput, { target: { value: "12345678" } });
}

describe("CadastrarUsuarioForm", () => {
  beforeEach(() => jest.clearAllMocks());

  it("renderiza todos os campos do formulário", () => {
    render(<CadastrarUsuarioForm />);
    const [senhaInput, confirmaSenhaInput] = screen.getAllByLabelText(/Senha/i);
    expect(screen.getByLabelText(/Nome/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/E-mail/i)).toBeInTheDocument();
    expect(senhaInput).toBeInTheDocument();
    expect(confirmaSenhaInput).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Cadastrar/i })).toBeInTheDocument();
  });

  it("exibe mensagem de sucesso ao cadastrar", async () => {
    mockCadastrarUsuario.mockResolvedValueOnce({
      message: { codigo: 0, descricao: "Sucesso" },
      data: { idUsuario: "123" },
    });
    render(<CadastrarUsuarioForm />);
    preencherFormulario();
    fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("Usuário cadastrado com sucesso!");
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
