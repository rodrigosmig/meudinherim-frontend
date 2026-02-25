import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { cadastrarUsuario } from '@/services/auth-service';
import { toast } from "@/components/toast";

import CadastrarUsuarioForm from '../cadastrar-usuario-form';

jest.mock('@/services/auth-service');

jest.mock("@/components/toast", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const mockCadastrarUsuario = cadastrarUsuario as jest.Mock;

describe('CadastrarUsuarioForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar campos do formulário', () => {
    render(<CadastrarUsuarioForm />);

    const [senhaInput, confirmaSenhaInput] = screen.getAllByLabelText(/Senha/i);

    expect(screen.getByLabelText(/Nome/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/E-mail/i)).toBeInTheDocument();
    expect(senhaInput).toBeInTheDocument();
    expect(confirmaSenhaInput).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cadastrar/i })).toBeInTheDocument();
  });

  it('deve exibir erro de campo retornado pela API', async () => {
    mockCadastrarUsuario.mockResolvedValueOnce({
      message: { codigo: -90, descricao: 'Campo inválido' },
      data: { fields: [{ field: 'email', message: 'E-mail já cadastrado' }] }
    });
    render(<CadastrarUsuarioForm />);

    const [senhaInput, confirmaSenhaInput] = screen.getAllByLabelText(/Senha/i);

    fireEvent.change(screen.getByLabelText(/Nome/i), { target: { value: 'Teste' } });
    fireEvent.change(screen.getByLabelText(/E-mail/i), { target: { value: 'teste@exemplo.com' } });
    fireEvent.change(senhaInput, { target: { value: '12345678' } });
    fireEvent.change(confirmaSenhaInput, { target: { value: '12345678' } });
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));

    await waitFor(() => {
      expect(screen.getByText('E-mail já cadastrado')).toBeInTheDocument();
      expect(toast.error).toHaveBeenCalledWith('Campo inválido');
    });
  });

  it('deve exibir erro genérico retornado pela API', async () => {
    const messageError = 'O email informado já está sendo utilizado';
    mockCadastrarUsuario.mockResolvedValueOnce({
      message: { codigo: -30, descricao: messageError }
    });
    render(<CadastrarUsuarioForm />);

    const [senhaInput, confirmaSenhaInput] = screen.getAllByLabelText(/Senha/i);

    fireEvent.change(screen.getByLabelText(/Nome/i), { target: { value: 'Teste' } });
    fireEvent.change(screen.getByLabelText(/E-mail/i), { target: { value: 'teste@exemplo.com' } });
    fireEvent.change(senhaInput, { target: { value: '12345678' } });
    fireEvent.change(confirmaSenhaInput, { target: { value: '12345678' } });
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(messageError);
      expect(screen.getByText(messageError)).toBeInTheDocument();
    });
  });

  it('deve exibir mensagem de sucesso ao cadastrar', async () => {
    mockCadastrarUsuario.mockResolvedValueOnce({
      message: { codigo: 0, descricao: 'Sucesso' },
      data: { idUsuario: '123' }
    });

    render(<CadastrarUsuarioForm />);

    const [senhaInput, confirmaSenhaInput] = screen.getAllByLabelText(/Senha/i);

    fireEvent.change(screen.getByLabelText(/Nome/i), { target: { value: 'Teste' } });
    fireEvent.change(screen.getByLabelText(/E-mail/i), { target: { value: 'teste@exemplo.com' } });
    fireEvent.change(senhaInput, { target: { value: '12345678' } });
    fireEvent.change(confirmaSenhaInput, { target: { value: '12345678' } });
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Usuário cadastrado com sucesso!');
    });
  });
});
