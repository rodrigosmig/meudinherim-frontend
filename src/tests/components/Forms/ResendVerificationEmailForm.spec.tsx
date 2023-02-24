import { mocked } from 'ts-jest/utils';
import { authService } from "../../../services/ApiService/AuthService";
import { ResendVerificationEmailForm } from "../../../components/Foms/auth/ResendVerificationEmailForm";
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useDispatch } from '../../../hooks/useDispatch';
import { useSelector } from '../../../hooks/useSelector';


const authServiceMocked = mocked(authService.resendVerificationEmail);
const useSelectorMock = mocked(useSelector)

jest.mock('../../../services/ApiService/AuthService');
jest.mock('../../../hooks/useDispatch');
jest.mock('../../../hooks/useSelector');
jest.mock('broadcast-channel');

describe('ResendVerificationEmailForm Component', () => {
  beforeEach(() => {
    useSelectorMock.mockImplementation(() => ({isAuthenticated: true}))
    render(<ResendVerificationEmailForm />)
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders corretly', async () => {
    expect(screen.getByRole("button", {name: "Enviar e-mail de verificação"}));
    expect(screen.getByLabelText("E-mail")).toBeInTheDocument();
    expect(screen.getByText("Fazer login")).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute('href', '/');
  });

  it('validates required fields inputs', async () => {
    await waitFor(() => {
      fireEvent.submit(screen.getByRole("button", {name: "Enviar e-mail de verificação"}));
    });

    expect(screen.getByText("O campo email é obrigatório")).toBeInTheDocument();
  });

  it('validates invalid email', async () => {
    fireEvent.input(screen.getByLabelText('E-mail'), {target: { value: "test" }});

    await waitFor(() => {
      fireEvent.submit(screen.getByRole("button", {name: "Enviar e-mail de verificação"}));
    });

    expect(screen.getByText("E-mail inválido")).toBeInTheDocument();
    expect(authServiceMocked).not.toBeCalled();
  });

  it('tests an unregistered email', async () => {
    const responseMessage = "We couldn't find any users with the given email address."

    authServiceMocked.mockRejectedValueOnce({
      response: {
        status: 422,
        headers: {},
        statusText: "",
        config: {},
        data:{
          email: [responseMessage]
        }
      }
      
    })

    fireEvent.change(screen.getByLabelText('E-mail'), {target: { value: "test@test.com" }});

    await waitFor(() => {
      fireEvent.submit(screen.getByRole("button", {name: "Enviar e-mail de verificação"}));
    });

    expect(authServiceMocked).toBeCalled();
    expect(screen.getByText("Dados inválidos")).toBeInTheDocument();
    expect(screen.getByText(responseMessage)).toBeInTheDocument();
  });

  it('tests sending verification e-mail successfully', async () => {
    const responseMessage = "Verification email sent successfully"

    authServiceMocked.mockResolvedValueOnce({
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
      fireEvent.submit(screen.getByRole("button", {name: "Enviar e-mail de verificação"}));
    })

    expect(authServiceMocked).toBeCalled();
    expect(screen.getByText("Sucesso")).toBeInTheDocument();
    expect(screen.getByText(responseMessage)).toBeInTheDocument();
  });
})