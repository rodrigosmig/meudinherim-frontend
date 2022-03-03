import { fireEvent, render, screen, waitFor } from "../../../utils/test-utils";
import { mocked } from 'ts-jest/utils';
import { ForgotPasswordForm } from "../../../components/Foms/auth/ForgotPasswordForm";
import { authService } from "../../../services/ApiService/AuthService";
import { ResetPasswordForm } from "../../../components/Foms/auth/ResetPasswordForm";

const authServiceMocked = mocked(authService.resetPassword);

jest.mock('../../../services/ApiService/AuthService');

const token = 'test token';

describe('ResetPasswordForm.spec Component', () => {
  beforeEach(() => {
    render(<ResetPasswordForm token={token} />)
  });

  it('renders corretly', async () => {
    expect(screen.getByRole("button", {name: "Resetar Senha"}))
    expect(screen.getByLabelText("E-mail")).toBeInTheDocument();
    expect(screen.getByLabelText("Senha")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirmação de Senha")).toBeInTheDocument();
  });

  it('validates required fields inputs', async () => {
    await waitFor(() => {
      fireEvent.submit(screen.getByRole("button", {name: "Resetar Senha"}));
    })

    expect(screen.getByText("O campo senha é obrigatório")).toBeInTheDocument();
    expect(screen.getByText("O campo email é obrigatório")).toBeInTheDocument();
    expect(authServiceMocked).not.toBeCalled();
  });

  it('validates invalid email', async () => {
    fireEvent.input(screen.getByLabelText('E-mail'), {target: { value: "test" }});

    await waitFor(() => {
      fireEvent.submit(screen.getByRole("button", {name: "Resetar Senha"}));
    })

    expect(screen.getByText("E-mail inválido")).toBeInTheDocument();
  });

  it('tests invalid password confirmation', async () => {
    fireEvent.input(screen.getByLabelText("Senha"), {target: { value: "12345678" }});
    fireEvent.input(screen.getByLabelText("Confirmação de Senha"), {target: { value: "12345678910" }});

    await waitFor(() => {
      fireEvent.submit(screen.getByRole("button", {name: "Resetar Senha"}));
    })

    expect(screen.getByText("As senhas precisam ser iguais")).toBeInTheDocument();
  });

  it('tests password reset with invalid token', async () => {
    const responseMessage = "This token is invalid"

    authServiceMocked.mockRejectedValue({
      response: {
        status: 400,
        headers: {},
        statusText: "",
        config: {},
        data:{
          message: responseMessage
        }
      }
      
    })

    fireEvent.change(screen.getByLabelText('E-mail'), {target: { value: "test@test.com" }});
    fireEvent.change(screen.getByLabelText('Senha'), {target: { value: "12345678" }});
    fireEvent.change(screen.getByLabelText('Confirmação de Senha'), {target: { value: "12345678" }});

    await waitFor(() => {
      fireEvent.submit(screen.getByRole("button", {name: "Resetar Senha"}));
    })

    expect(authServiceMocked).toBeCalled();
    expect(screen.getByText(responseMessage)).toBeInTheDocument();
    expect(screen.getByText('Dados inválidos')).toBeInTheDocument();
  });

  it('tests email reset successfully', async () => {
    const responseMessage = "Password reset successfully";

    authServiceMocked.mockResolvedValue({
      status: 200,
      headers: {},
      statusText: "",
      config: {},
      data:{
        message: responseMessage
      }
    })

    fireEvent.change(screen.getByLabelText('E-mail'), {target: { value: "test@test.com" }});
    fireEvent.change(screen.getByLabelText('Senha'), {target: { value: "12345678" }});
    fireEvent.change(screen.getByLabelText('Confirmação de Senha'), {target: { value: "12345678" }});

    await waitFor(() => {
      fireEvent.submit(screen.getByRole("button", {name: "Resetar Senha"}));
    })

    expect(authServiceMocked).toBeCalled();
    expect(screen.getByText("Sucesso")).toBeInTheDocument();
    expect(screen.getByText(responseMessage)).toBeInTheDocument();
  });
})