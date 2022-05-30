import { act } from "react-dom/test-utils";
import { fireEvent, render, screen, waitFor } from "../../../utils/test-utils";
import { mocked } from 'ts-jest/utils';
import { RegisterForm } from "../../../components/Foms/auth/RegisterForm";
import { authService } from "../../../services/ApiService/AuthService";
import React from "react";

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

jest.mock('../../../services/ApiService/AuthService');

jest.mock('react-google-recaptcha', () => {
  const ReCaptchaV2 = () => {
    return (
      <input type="checkbox" 
        data-testid="recaptcha-register"
        onChange={jest.fn}
      />
    )
  }
  return ReCaptchaV2;
});

describe('RegisterForm Component', () => {
  beforeEach(() => {
    render(<RegisterForm />)
  });
  
  it('validates required fields', async () => {
    await act(async () => {
      fireEvent.submit(screen.getByText('Cadastrar'));
    });

    expect(screen.getByText("O campo nome é obrigatório")).toBeInTheDocument();
    expect(screen.getByText("O campo email é obrigatório")).toBeInTheDocument();
    expect(screen.getByText("O campo senha é obrigatório")).toBeInTheDocument();
  });

   it('validates user inputs', async () => {
    fireEvent.input(screen.getByLabelText('Nome'), {
      target: {value: 'T'}
    })

    fireEvent.input(screen.getByLabelText('E-mail'), {
      target: {value: 'Test'}
    })

    fireEvent.input(screen.getByLabelText('Senha'), {
      target: {value: '123456'}
    })


    await act(async () => {
      fireEvent.submit(screen.getByText('Cadastrar'));
    })

    expect(screen.getByText("O campo nome deve ter no mínimo 3 caracteres")).toBeInTheDocument();
    expect(screen.getByText("E-mail inválido")).toBeInTheDocument();
    expect(screen.getByText("O campo senha deve ter no mínimo 8 caracteres")).toBeInTheDocument();
    expect(screen.getByText("As senhas precisam ser iguais")).toBeInTheDocument();
  });

  it('allows the user to register successfuly', async () => {
    const getAuthServiceMocked = mocked(authService.register);

    getAuthServiceMocked.mockResolvedValueOnce({
      status: 201,
      headers: {},
      statusText: "",
      config: {},
      data:{
        id: 1,
        name: 'Test',
        email: 'test@test.com',
        avatar: 'test',
        enable_notification: false,
        hasEmailVerified: true
      }
    })

    fireEvent.input(screen.getByLabelText('Nome'), {
      target: {value: 'Test'}
    })

    
    fireEvent.input(screen.getByLabelText('E-mail'), {
      target: {value: 'test@test.com'}
    })

    fireEvent.input(screen.getByLabelText('Senha'), {
      target: {value: '12345678'}
    })
    
    fireEvent.input(screen.getByLabelText('Confirmação de Senha'), {
      target: {value: '12345678'}
    })

    await waitFor(() => {
      fireEvent.submit(screen.getByText('Cadastrar'));
    })
    
    expect(screen.getByText("Sucesso")).toBeInTheDocument();
    expect(screen.getByText("Usuário Test cadastrado com sucesso")).toBeInTheDocument();
  });
})