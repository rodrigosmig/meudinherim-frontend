import { render, screen, fireEvent, waitFor } from "@/helpers/test/test-helper";
import { DEFAULT_ERROR_MESSAGE } from "@/helpers/route-helpers";
import ApiError from "@/types/application-error";
import { toast } from "@/components/toast";
import userEvent from "@testing-library/user-event";

import { ValidarCodigoForm } from "../validar-codigo-form";

const mockedPush = jest.fn();
const mockEmail = "usuario@teste.com";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockedPush }),
  useSearchParams: () => ({ get: (key: string) => key === "email" ? mockEmail : null }),
}));

jest.mock("@/components/toast", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

jest.mock("@/services/auth-service", () => ({
  authService: { validarCodigoRecuperacao: jest.fn() },
}));

import { authService } from "@/services/auth-service";
const mockValidar = authService.validarCodigoRecuperacao as jest.Mock;

function getInputs() {
  return screen.getAllByRole("textbox") as HTMLInputElement[];
}

async function typeCode(code: string) {
  const inputs = getInputs();
  for (let i = 0; i < code.length && i < 6; i++) {
    fireEvent.change(inputs[i], { target: { value: code[i] } });
  }
}

describe("ValidarCodigoForm", () => {
  beforeEach(() => jest.clearAllMocks());

  it("renderiza 6 inputs OTP", () => {
    render(<ValidarCodigoForm />);
    expect(getInputs()).toHaveLength(6);
  });

  it("exibe o e-mail recebido por searchParams", () => {
    render(<ValidarCodigoForm />);
    expect(screen.getByText(mockEmail)).toBeInTheDocument();
  });

  it("botão fica desabilitado com menos de 6 dígitos", async () => {
    render(<ValidarCodigoForm />);
    await typeCode("12345");
    expect(screen.getByRole("button", { name: "Verificar código" })).toBeDisabled();
  });

  it("botão fica habilitado com 6 dígitos", async () => {
    render(<ValidarCodigoForm />);
    await typeCode("123456");
    expect(screen.getByRole("button", { name: "Verificar código" })).not.toBeDisabled();
  });

  it("avança o foco para o próximo input ao digitar um dígito", () => {
    render(<ValidarCodigoForm />);
    const inputs = getInputs();
    fireEvent.change(inputs[0], { target: { value: "1" } });
    expect(document.activeElement).toBe(inputs[1]);
  });

  it("volta o foco ao pressionar Backspace no input vazio", () => {
    render(<ValidarCodigoForm />);
    const inputs = getInputs();
    fireEvent.change(inputs[0], { target: { value: "1" } });
    fireEvent.change(inputs[1], { target: { value: "2" } });
    fireEvent.keyDown(inputs[1], { key: "Backspace" });
    fireEvent.keyDown(inputs[1], { key: "Backspace" });
    expect(document.activeElement).toBe(inputs[0]);
  });

  it("navega com ArrowLeft e ArrowRight", () => {
    render(<ValidarCodigoForm />);
    const inputs = getInputs();
    fireEvent.change(inputs[2], { target: { value: "3" } });
    fireEvent.keyDown(inputs[2], { key: "ArrowLeft" });
    expect(document.activeElement).toBe(inputs[1]);
    fireEvent.keyDown(inputs[1], { key: "ArrowRight" });
    expect(document.activeElement).toBe(inputs[2]);
  });

  it("preenche todos os inputs ao colar o código", () => {
    render(<ValidarCodigoForm />);
    const inputs = getInputs();
    fireEvent.paste(inputs[0], {
      clipboardData: { getData: () => "763035" },
    });
    const allInputs = getInputs();
    expect(allInputs[0]).toHaveValue("7");
    expect(allInputs[5]).toHaveValue("5");
  });

  it("ignora caracteres não numéricos na entrada", () => {
    render(<ValidarCodigoForm />);
    const inputs = getInputs();
    fireEvent.change(inputs[0], { target: { value: "a" } });
    expect(inputs[0]).toHaveValue("");
  });

  it("valida código com sucesso e redireciona para resetar-senha", async () => {
    const token = "token-abc-123";
    mockValidar.mockResolvedValueOnce({
      message: { codigo: 0, descricao: "Sucesso" },
      data: token,
    });

    render(<ValidarCodigoForm />);
    await typeCode("763035");
    fireEvent.click(screen.getByRole("button", { name: "Verificar código" }));

    await waitFor(() => {
      expect(mockValidar).toHaveBeenCalledWith({ email: mockEmail, codigo: "763035" });
      expect(mockedPush).toHaveBeenCalledWith(`/resetar-senha?token=${encodeURIComponent(token)}`);
    });
  });

  it("exibe toast de erro da API ao falhar validação", async () => {
    mockValidar.mockRejectedValueOnce(
      new ApiError({ codigo: 400, descricao: "Código inválido ou expirado" }, 400),
    );

    render(<ValidarCodigoForm />);
    await typeCode("000000");
    fireEvent.click(screen.getByRole("button", { name: "Verificar código" }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Código inválido ou expirado");
    });
    expect(mockedPush).not.toHaveBeenCalled();
  });

  it("exibe mensagem default em erro inesperado", async () => {
    mockValidar.mockRejectedValueOnce(new Error("network error"));

    render(<ValidarCodigoForm />);
    await typeCode("123456");
    fireEvent.click(screen.getByRole("button", { name: "Verificar código" }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(DEFAULT_ERROR_MESSAGE);
    });
  });

  it("exibe toast de código validado com sucesso", async () => {
    mockValidar.mockResolvedValueOnce({ message: { codigo: 0, descricao: "Sucesso" }, data: "tok" });

    render(<ValidarCodigoForm />);
    await typeCode("123456");
    fireEvent.click(screen.getByRole("button", { name: "Verificar código" }));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("Código validado com sucesso! Defina uma nova senha.");
    });
  });
});
