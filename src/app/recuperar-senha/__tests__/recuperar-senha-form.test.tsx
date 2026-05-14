import { render, screen } from "@/helpers/test/test-helper";
import { DEFAULT_ERROR_MESSAGE } from "@/helpers/route-helpers";
import { catalogoErros } from "@/helpers/erros-helper";
import userEvent from "@testing-library/user-event";
import ApiError from "@/types/application-error";
import { toast } from "@/components/toast";

import { RecuperarSenhaForm } from "../recuperar-senha-form";

const mockedPush = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockedPush }),
}));

jest.mock("@/components/toast", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

jest.mock("@/services/auth-service", () => ({
  authService: { recuperarSenha: jest.fn() },
}));

import { authService } from "@/services/auth-service";
const mockRecuperarSenha = authService.recuperarSenha as jest.Mock;

describe("RecuperarSenhaForm", () => {
  beforeEach(() => jest.clearAllMocks());

  it("renderiza o campo de email e o botão", () => {
    render(<RecuperarSenhaForm />);
    expect(screen.getByLabelText("E-mail")).toBeVisible();
    expect(screen.getByRole("button", { name: "Enviar código" })).toBeVisible();
  });

  it("envia com sucesso e redireciona para validar-codigo", async () => {
    mockRecuperarSenha.mockResolvedValueOnce({ message: { codigo: 0, descricao: "Sucesso" }, data: {} });
    const email = "test@test.com";

    render(<RecuperarSenhaForm />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText("E-mail"), email);
    await user.click(screen.getByRole("button", { name: "Enviar código" }));

    expect(mockRecuperarSenha).toHaveBeenCalledWith({ email });
    expect(toast.success).toHaveBeenCalledWith("Código enviado! Verifique seu e-mail.");
    expect(mockedPush).toHaveBeenCalledWith(`/validar-codigo?email=${encodeURIComponent(email)}`);
  });

  it("exibe erro de validação local para e-mail inválido", async () => {
    render(<RecuperarSenhaForm />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText("E-mail"), "invalido");
    await user.click(screen.getByRole("button", { name: "Enviar código" }));

    expect(screen.getByText("E-mail inválido")).toBeInTheDocument();
    expect(mockRecuperarSenha).not.toHaveBeenCalled();
  });

  it("exibe erro de campo retornado pelo servidor", async () => {
    const mensagem = "E-mail não cadastrado";
    mockRecuperarSenha.mockRejectedValueOnce(
      new ApiError(
        { codigo: catalogoErros.CAMPO_INVALIDO_OU_OBRIGATORIO, descricao: mensagem },
        422,
        { fields: [{ field: "email", message: mensagem }] },
      ),
    );

    render(<RecuperarSenhaForm />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText("E-mail"), "nao@cadastrado.com");
    await user.click(screen.getByRole("button", { name: "Enviar código" }));

    expect(toast.error).toHaveBeenCalledWith(mensagem);
    expect(screen.getByText(mensagem)).toBeInTheDocument();
  });

  it("exibe erro genérico retornado pelo servidor", async () => {
    mockRecuperarSenha.mockRejectedValueOnce(
      new ApiError({ codigo: -999, descricao: "Erro genérico" }, 500),
    );

    render(<RecuperarSenhaForm />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText("E-mail"), "test@test.com");
    await user.click(screen.getByRole("button", { name: "Enviar código" }));

    expect(toast.error).toHaveBeenCalledWith("Erro genérico");
  });

  it("exibe mensagem default em erro inesperado", async () => {
    mockRecuperarSenha.mockRejectedValueOnce(new Error("boom"));

    render(<RecuperarSenhaForm />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText("E-mail"), "test@test.com");
    await user.click(screen.getByRole("button", { name: "Enviar código" }));

    expect(toast.error).toHaveBeenCalledWith(DEFAULT_ERROR_MESSAGE);
  });
});
