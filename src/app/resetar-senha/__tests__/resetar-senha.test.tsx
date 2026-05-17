import { render, screen, waitFor } from "@/helpers/test/test-helper";
import { toast } from "@/components/toast";

import { ResetarSenha } from "../resetar-senha";

const mockedPush = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockedPush }),
  useSearchParams: () => ({
    get: (key: string) => {
      const params = new URLSearchParams(window.location.search);
      return params.get(key);
    },
  }),
}));

jest.mock("@/components/toast", () => ({
  toast: { error: jest.fn(), success: jest.fn() },
}));

jest.mock("@/services/auth-service", () => ({
  authService: { resetarSenha: jest.fn() },
}));

function setToken(token?: string) {
  const search = token ? `?token=${token}` : "";
  window.history.replaceState({}, "", `/resetar-senha${search}`);
}

describe("ResetarSenha", () => {
  beforeEach(() => jest.clearAllMocks());

  it("exibe toast de erro e redireciona para login quando não há token", async () => {
    setToken(undefined);
    render(<ResetarSenha />);
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Token inválido. Não é possível resetar a senha");
      expect(mockedPush).toHaveBeenCalledWith("/login");
    });
  });

  it("renderiza o formulário quando há token válido", async () => {
    setToken("valid-token");
    render(<ResetarSenha />);
    await waitFor(() => {
      expect(screen.getByText("Resetar Senha")).toBeInTheDocument();
    });
  });

  it("renderiza o título 'Nova senha' no layout", async () => {
    setToken("valid-token");
    render(<ResetarSenha />);
    await waitFor(() => {
      expect(screen.getByText("Nova senha")).toBeInTheDocument();
    });
  });
});
