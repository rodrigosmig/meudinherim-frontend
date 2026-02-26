import { render, waitFor } from '@testing-library/react';
import * as authService from '@/services/auth-service';
import { toast } from '@/components/toast';

import ConfirmarEmail from '../page';

const mockedPush = jest.fn();

jest.mock('@/services/auth-service');
const mockConfirmarEmail = authService.confirmarEmail as jest.Mock;

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockedPush }),
  useSearchParams: () => ({
    get: (key: string) => {
      const params = new URLSearchParams(window.location.search);
      return params.get(key);
    },
  }),
}));

jest.mock('@/components/toast', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
    warning: jest.fn(),
    promise: jest.fn(),
  },
}));

function setSearchParams(token?: string) {
  const searchParams = new URLSearchParams();
  if (token) searchParams.set('token', token);
  window.history.replaceState({}, '', `/confirmar-email?${searchParams.toString()}`);
}

describe('ConfirmarEmail page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('exibe mensagem de erro se não houver token', async () => {
    setSearchParams(undefined);

    render(<ConfirmarEmail />);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Token de confirmação inválido. Por favor, verifique o link enviado para seu email."
      );
    });
  });

  it('exibe mensagem de sucesso e redireciona para login', async () => {
    setSearchParams('valid-token');
    mockConfirmarEmail.mockResolvedValue({ message: { codigo: 0, descricao: 'Sucesso' } });

    render(<ConfirmarEmail />);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Conta confirmada com sucesso!');
      expect(mockedPush).toHaveBeenCalledWith('/login');
    });
  });

  it('exibe mensagem de erro da API quando falha', async () => {
    setSearchParams('invalid-token');
    mockConfirmarEmail.mockResolvedValue({ message: { codigo: -9, descricao: 'Token inválido' } });

    render(<ConfirmarEmail />);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Token inválido');
    });
  });
});
