import { fireEvent, render, screen, waitFor } from "../../../utils/test-utils";
import { mocked } from 'ts-jest/utils';
import { ForgotPasswordForm } from "../../../components/Foms/auth/ForgotPasswordForm";
import { authService } from "../../../services/ApiService/AuthService";

const authServiceMocked = mocked(authService.forgotPassword);

jest.mock('../../../services/ApiService/AuthService');

describe('ForgotPasswordForm.spec Component', () => {
  beforeEach(() => {
    render(<ForgotPasswordForm />)
  });

  it('renders corretly', async () => {
    expect(screen.getByRole("button", {name: "Enviar e-mail de recuperação"}))
    expect(screen.getByText("Esqueci minha senha")).toBeInTheDocument();
    expect(screen.getByText("Fazer login")).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute('href', '/');
  });

  it('validates required fields inputs', async () => {
    await waitFor(() => {
      fireEvent.submit(screen.getByRole("button", {name: "Enviar e-mail de recuperação"}));
    })

    expect(screen.getByText("O campo email é obrigatório")).toBeInTheDocument();
  });

  it('validates invalid email', async () => {
    fireEvent.input(screen.getByLabelText('E-mail'), {target: { value: "test" }});

    await waitFor(() => {
      fireEvent.submit(screen.getByRole("button", {name: "Enviar e-mail de recuperação"}));
    })

    expect(screen.getByText("E-mail inválido")).toBeInTheDocument();
    expect(authServiceMocked).not.toBeCalled();
  });

  it('tests an unregistered email', async () => {
    const responseMessage = "We couldn't find any users with the given email address."

    authServiceMocked.mockRejectedValue({
      response: {
        status: 422,
        headers: {},
        statusText: "",
        config: {},
        data:{
          message: 'Invalid data',
          errors: {
            email: [responseMessage]
          }
        }
      }
      
    })

    fireEvent.change(screen.getByLabelText('E-mail'), {target: { value: "test@test.com" }});

    await waitFor(() => {
      fireEvent.submit(screen.getByRole("button", {name: "Enviar e-mail de recuperação"}));
    })

    expect(authServiceMocked).toBeCalled();
    expect(screen.getByText("Dados inválidos")).toBeInTheDocument();
    expect(screen.getByText(responseMessage)).toBeInTheDocument();
  });

  it('tests sending recovery e-mail successfully', async () => {
    const responseMessage = "Recovery email sent successfully"

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

    await waitFor(() => {
      fireEvent.submit(screen.getByRole("button", {name: "Enviar e-mail de recuperação"}));
    })

    expect(authServiceMocked).toBeCalled();
    expect(screen.getByText("Sucesso")).toBeInTheDocument();
    expect(screen.getByText(responseMessage)).toBeInTheDocument();
  });
})