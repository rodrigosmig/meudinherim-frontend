import { render, waitFor } from '@/helpers/test/test-helper';
import { toast } from '@/components/toast';

import { ResetarSenha } from '../resetar-senha';

const mockedPush = jest.fn();

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
  window.history.replaceState({}, '', `/resetar-senha?${searchParams.toString()}`);
}

describe('ResetarSenhaPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('exibe toast de erro e redireciona se não houver token', async () => {
    setSearchParams(undefined);
    render(<ResetarSenha />);
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Token inválido. Não é possível resetar a senha");
      expect(mockedPush).toHaveBeenCalledWith('/');
    });
  });

  it('renderiza o formulário se houver token', async () => {
    setSearchParams('valid-token');
    render(<ResetarSenha />);
    await waitFor(() => {
      expect(document.body.textContent).toContain('Resetar Senha');
    });
  });
});
