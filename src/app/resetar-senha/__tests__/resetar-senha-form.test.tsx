import { fireEvent, render, screen, waitFor } from '@/helpers/test/test-helper';
import * as authService from '@/services/auth-service';
import { catalogoErros } from '@/helpers/erros-helper';
import ApiError from '@/types/application-error';
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
    mockResetarSenha.mockRejectedValueOnce(
      new ApiError(
        { codigo: catalogoErros.TOKEN_NAO_ENCONTRADO, descricao: 'Não foi possível validar o token informado' },
        400,
      )
    );

    render(<ResetarSenhaForm token="invalid-token" />);

    fireEvent.change(screen.getByLabelText('Senha'), { target: { value: '12345678' } });
    fireEvent.change(screen.getByLabelText('Confirme a senha'), { target: { value: '12345678' } });
    fireEvent.click(screen.getByText('Resetar Senha'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Não foi possível validar o token informado');
    });
  });

  it('deve exibir toast de sucesso e redireciona para login', async () => {
    mockResetarSenha.mockResolvedValueOnce({});

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
    mockResetarSenha.mockRejectedValueOnce(new ApiError({ codigo: -999, descricao: 'Erro desconhecido' }, 500));

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

    mockResetarSenha.mockRejectedValueOnce(
      new ApiError(
        { codigo: catalogoErros.CAMPO_INVALIDO_OU_OBRIGATORIO, descricao: 'Erro de campo' },
        422,
        { fields: [{ field: 'passwordConfirmation', message: messageErro }] },
      )
    );

    render(<ResetarSenhaForm token="valid-token" />);

    fireEvent.change(screen.getByLabelText('Senha'), { target: { value: '12345678' } });
    fireEvent.change(screen.getByLabelText('Confirme a senha'), { target: { value: '12345678' } });
    fireEvent.click(screen.getByText('Resetar Senha'));

    await waitFor(() => {
      expect(screen.getByText(messageErro)).toBeInTheDocument();
    });
  });
});
