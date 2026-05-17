import { fireEvent, render, screen, waitFor } from "@/helpers/test/test-helper";
import { DEFAULT_ERROR_MESSAGE } from "@/helpers/route-helpers";
import { catalogoErros } from "@/helpers/erros-helper";
import ApiError from "@/types/application-error";
import { toast } from "@/components/toast";

import { ResetarSenhaForm } from "../resetar-senha-form";

const mockedPush = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockedPush }),
}));

jest.mock("@/components/toast", () => ({
  toast: { error: jest.fn(), success: jest.fn() },
}));

jest.mock("@/services/auth-service", () => ({
  authService: { resetarSenha: jest.fn() },
}));

import { authService } from "@/services/auth-service";
const mockResetarSenha = authService.resetarSenha as jest.Mock;

describe("ResetarSenhaForm", () => {
  beforeEach(() => jest.clearAllMocks());

  it("exibe erro de validação ao enviar campos vazios", async () => {
    render(<ResetarSenhaForm token="valid-token" />);
    fireEvent.click(screen.getByText("Resetar Senha"));
    await waitFor(() => {
      expect(screen.getByText(/o campo senha deve ter no mínimo 8 caracteres/i)).toBeInTheDocument();
    });
  });

  it("exibe erro quando confirmação de senha não bate", async () => {
    render(<ResetarSenhaForm token="valid-token" />);
    fireEvent.change(screen.getByLabelText("Senha"), { target: { value: "12345678" } });
    fireEvent.change(screen.getByLabelText("Confirme a senha"), { target: { value: "87654321" } });
    fireEvent.click(screen.getByText("Resetar Senha"));
    await waitFor(() => {
      expect(screen.getByText(/A confirmação de senha não corresponde à senha/i)).toBeInTheDocument();
    });
  });

  it("exibe toast de sucesso e redireciona para login", async () => {
    mockResetarSenha.mockResolvedValueOnce({});
    render(<ResetarSenhaForm token="valid-token" />);

    fireEvent.change(screen.getByLabelText("Senha"), { target: { value: "12345678" } });
    fireEvent.change(screen.getByLabelText("Confirme a senha"), { target: { value: "12345678" } });
    fireEvent.click(screen.getByText("Resetar Senha"));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("Senha resetada com sucesso!");
      expect(mockedPush).toHaveBeenCalledWith("/login");
    });
  });

  it("chama resetarSenha com token e dados do formulário", async () => {
    mockResetarSenha.mockResolvedValueOnce({});
    render(<ResetarSenhaForm token="meu-token-123" />);

    fireEvent.change(screen.getByLabelText("Senha"), { target: { value: "novaSenha1" } });
    fireEvent.change(screen.getByLabelText("Confirme a senha"), { target: { value: "novaSenha1" } });
    fireEvent.click(screen.getByText("Resetar Senha"));

    await waitFor(() => {
      expect(mockResetarSenha).toHaveBeenCalledWith({
        token: "meu-token-123",
        password: "novaSenha1",
        passwordConfirmation: "novaSenha1",
      });
    });
  });

  it("exibe toast de erro para token inválido", async () => {
    mockResetarSenha.mockRejectedValueOnce(
      new ApiError(
        { codigo: catalogoErros.TOKEN_NAO_ENCONTRADO, descricao: "Não foi possível validar o token informado" },
        400,
      ),
    );
    render(<ResetarSenhaForm token="invalid-token" />);

    fireEvent.change(screen.getByLabelText("Senha"), { target: { value: "12345678" } });
    fireEvent.change(screen.getByLabelText("Confirme a senha"), { target: { value: "12345678" } });
    fireEvent.click(screen.getByText("Resetar Senha"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Não foi possível validar o token informado");
    });
  });

  it("exibe toast de erro genérico de API", async () => {
    mockResetarSenha.mockRejectedValueOnce(
      new ApiError({ codigo: -999, descricao: "Erro desconhecido" }, 500),
    );
    render(<ResetarSenhaForm token="valid-token" />);

    fireEvent.change(screen.getByLabelText("Senha"), { target: { value: "12345678" } });
    fireEvent.change(screen.getByLabelText("Confirme a senha"), { target: { value: "12345678" } });
    fireEvent.click(screen.getByText("Resetar Senha"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Erro desconhecido");
    });
  });

  it("exibe DEFAULT_ERROR_MESSAGE em erro inesperado não-ApiError", async () => {
    mockResetarSenha.mockRejectedValueOnce(new Error("network failure"));
    render(<ResetarSenhaForm token="valid-token" />);

    fireEvent.change(screen.getByLabelText("Senha"), { target: { value: "12345678" } });
    fireEvent.change(screen.getByLabelText("Confirme a senha"), { target: { value: "12345678" } });
    fireEvent.click(screen.getByText("Resetar Senha"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(DEFAULT_ERROR_MESSAGE);
    });
  });

  it("exibe erro de campo retornado pela API", async () => {
    const mensagem = "Confirmação de senha inválida";
    mockResetarSenha.mockRejectedValueOnce(
      new ApiError(
        { codigo: catalogoErros.CAMPO_INVALIDO_OU_OBRIGATORIO, descricao: "Erro de campo" },
        422,
        { fields: [{ field: "passwordConfirmation", message: mensagem }] },
      ),
    );
    render(<ResetarSenhaForm token="valid-token" />);

    fireEvent.change(screen.getByLabelText("Senha"), { target: { value: "12345678" } });
    fireEvent.change(screen.getByLabelText("Confirme a senha"), { target: { value: "12345678" } });
    fireEvent.click(screen.getByText("Resetar Senha"));

    await waitFor(() => {
      expect(screen.getByText(mensagem)).toBeInTheDocument();
    });
  });
});
