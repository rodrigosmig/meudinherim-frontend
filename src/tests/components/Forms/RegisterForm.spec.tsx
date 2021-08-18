import { act } from "react-dom/test-utils";
import { fireEvent, render, screen, waitFor } from "../../../utils/test-utils";
import { mocked } from 'ts-jest/utils';
import { RegisterForm } from "../../../components/Foms/RegisterForm";
import { authService } from "../../../services/ApiService/AuthService";

jest.mock('../../../services/ApiService/AuthService')

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
      data:{id: 1,
        name: 'Test',
        email: 'test@test.com',
        avatar: 'test',
        enable_notification: false
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