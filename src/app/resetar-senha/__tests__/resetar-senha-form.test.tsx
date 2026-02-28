import { fireEvent, render, screen, waitFor } from '@/utils/test-utils';
import * as authService from '@/services/auth-service';
import { toast } from '@/components/toast';

import { ResetarSenhaForm } from '../resetar-senha-form';

const mockedPush = jest.fn();

jest.mock('@/services/auth-service');
const mockResetarSenha = authService.resetarSenha as jest.Mock;

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockedPush }),
}));

jest.mock('@/components/toast', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
    warning: jest.fn(),
    promise: jest.fn(),
  },
}));

describe('ResetarSenhaForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve exibir erro de validação ao enviar campos vazios', async () => {
    render(<ResetarSenhaForm token="valid-token" />);

    fireEvent.click(screen.getByText('Resetar Senha'));

    await waitFor(() => {
      expect(screen.getByText(/o campo senha deve ter no mínimo 8 caracteres/i)).toBeInTheDocument();
    });
  });

  it('deve exibir erro de validação quando o campo confirmação de senha for diferente da senha', async () => {
    render(<ResetarSenhaForm token="valid-token" />);

    fireEvent.change(screen.getByLabelText('Senha'), { target: { value: '12345678' } });
    fireEvent.change(screen.getByLabelText('Confirme a senha'), { target: { value: '87654321' } });
    fireEvent.click(screen.getByText('Resetar Senha'));

    await waitFor(() => {
      expect(screen.getByText(/A confirmação de senha não corresponde à senha/i)).toBeInTheDocument();
    });
  });

  it('deve exibir toast de erro para token inválido', async () => {
    mockResetarSenha.mockResolvedValue({ message: { codigo: -7, descricao: 'Token inválido' } });

    render(<ResetarSenhaForm token="invalid-token" />);

    fireEvent.change(screen.getByLabelText('Senha'), { target: { value: '12345678' } });
    fireEvent.change(screen.getByLabelText('Confirme a senha'), { target: { value: '12345678' } });
    fireEvent.click(screen.getByText('Resetar Senha'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Não foi possível validar o token informado');
    });
  });

  it('deve exibir toast de sucesso e redireciona para login', async () => {
    mockResetarSenha.mockResolvedValue({ message: { codigo: 0, descricao: 'Sucesso' } });

    render(<ResetarSenhaForm token="valid-token" />);

    fireEvent.change(screen.getByLabelText('Senha'), { target: { value: '12345678' } });
    fireEvent.change(screen.getByLabelText('Confirme a senha'), { target: { value: '12345678' } });
    fireEvent.click(screen.getByText('Resetar Senha'));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Senha resetada com sucesso!');
      expect(mockedPush).toHaveBeenCalledWith('/login');
    });
  });

  it('deve exibir toast de erro genérico', async () => {
    mockResetarSenha.mockResolvedValue({ message: { codigo: -999, descricao: 'Erro desconhecido' } });

    render(<ResetarSenhaForm token="valid-token" />);

    fireEvent.change(screen.getByLabelText('Senha'), { target: { value: '12345678' } });
    fireEvent.change(screen.getByLabelText('Confirme a senha'), { target: { value: '12345678' } });
    fireEvent.click(screen.getByText('Resetar Senha'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(expect.stringContaining('Erro desconhecido'));
    });
  });

  it('deve exibir erro de validação de campo vindo da API', async () => {
    const messageErro = "Confirmação de senha inválida";

    mockResetarSenha.mockResolvedValue({
      message: { codigo: -1, descricao: 'Erro de campo' },
      data: { fields: [{ field: 'passwordConfirmation', message: messageErro }] },
    });

    render(<ResetarSenhaForm token="valid-token" />);

    fireEvent.change(screen.getByLabelText('Senha'), { target: { value: '12345678' } });
    fireEvent.change(screen.getByLabelText('Confirme a senha'), { target: { value: '12345678' } });
    fireEvent.click(screen.getByText('Resetar Senha'));

    await waitFor(() => {
      expect(screen.getByText(messageErro)).toBeInTheDocument();
    });
  });
});
