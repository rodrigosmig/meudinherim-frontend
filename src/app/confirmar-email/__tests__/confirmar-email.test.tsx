import { render, waitFor } from '@/helpers/test/test-helper';
import { authService } from '@/services/auth-service';
import ApiError from '@/types/application-error';
import { toast } from '@/components/toast';

import ConfirmarEmail from '../confirmar-email';

const mockedPush = jest.fn();

jest.mock('@/services/auth-service', () => ({
  authService: {
    confirmarEmail: jest.fn(),
  },
}));
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

describe('Componente ConfirmarEmail', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('mostra erro quando não há token', async () => {
    setSearchParams(undefined);

    render(<ConfirmarEmail />);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Token de confirmação inválido. Por favor, verifique o link enviado para seu email.'
      );
    });
  });

  it('confirma com sucesso e redireciona', async () => {
    setSearchParams('valid-token');
    mockConfirmarEmail.mockResolvedValueOnce({});

    render(<ConfirmarEmail />);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Conta confirmada com sucesso!');
      expect(mockedPush).toHaveBeenCalledWith('/login');
    });
  });

  it('mostra erro vindo da API (ApiError)', async () => {
    setSearchParams('invalid-token');
    mockConfirmarEmail.mockRejectedValueOnce(new ApiError({ codigo: -9, descricao: 'Token inválido' }, 400));

    render(<ConfirmarEmail />);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Token inválido');
    });
  });

  it('mostra mensagem padrão em erro inesperado', async () => {
    setSearchParams('any-token');
    mockConfirmarEmail.mockRejectedValueOnce(new Error('boom'));

    render(<ConfirmarEmail />);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(expect.any(String));
    });
  });
});
