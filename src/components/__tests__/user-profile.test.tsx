import { render, screen, waitFor } from "@/helpers/test/test-helper";
import userEvent from "@testing-library/user-event";
import { act } from 'react';

import UserProfile from "../user-profile";

const mockedPush = jest.fn();
const mockedRefresh = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockedPush, refresh: mockedRefresh }),
}));

jest.mock("@/services/auth-service", () => ({
  logout: jest.fn()
}));

const nome = "João Silva";
const email = "joao@teste.com";

const mockedUseAuth = jest.fn(() => ({ usuario: { nome, email }, isLoading: false }));
jest.mock('@/contexts/auth-context', () => ({
  useAuth: () => mockedUseAuth(),
}));

describe("Componente UserProfile", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve abrir e fechar o menu do usuário", async () => {
    const user = userEvent.setup();
    render(<UserProfile />);
    const btnAvatar = screen.getByRole("button", { name: /abrir menu do usuário/i });

    await user.click(btnAvatar);

    expect(screen.getByText("Perfil")).toBeVisible();
    expect(screen.getByText("Configurações")).toBeVisible();
    expect(screen.getByText("Sair")).toBeVisible();


    act(() => {
      document.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    });

    await waitFor(() => {
      expect(screen.queryByText("Perfil")).not.toBeInTheDocument();
    });
  });

  it("deve navegar para perfil ao clicar em Perfil", async () => {
    const user = userEvent.setup();
    render(<UserProfile />);
    await user.click(screen.getByRole("button", { name: /abrir menu do usuário/i }));
    await user.click(screen.getByText("Perfil"));
    expect(mockedPush).toHaveBeenCalledWith("/perfil");
  });

  it("deve navegar para configurações ao clicar em Configurações", async () => {
    const user = userEvent.setup();
    render(<UserProfile />);
    await user.click(screen.getByRole("button", { name: /abrir menu do usuário/i }));
    await user.click(screen.getByText("Configurações"));
    expect(mockedPush).toHaveBeenCalledWith("/configuracoes");
  });

  it("deve fazer logout e redirecionar ao clicar em Sair", async () => {
    const user = userEvent.setup();
    render(<UserProfile />);
    await user.click(screen.getByRole("button", { name: /abrir menu do usuário/i }));
    await user.click(screen.getByText("Sair"));

    const { logout } = require("@/services/auth-service")
    expect(logout).toHaveBeenCalled();
    expect(mockedPush).toHaveBeenCalledWith("/login");
    expect(mockedRefresh).toHaveBeenCalled();
  });
});