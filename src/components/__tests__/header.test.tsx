import { render, screen } from "@/helpers/test/test-helper";

import { Header } from "../header";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn(), refresh: jest.fn() }),
}));

const nome = 'Rodrigo Miguel';
const email = 'rodrigosmig@gmail.com';
const mockedUseAuth = jest.fn(() => ({ usuario: { nome, email }, isLoading: false }));
jest.mock('@/contexts/auth-context', () => ({
  useAuth: () => mockedUseAuth(),
}));

describe("Componente Header", () => {
  it("deve renderizar o título corretamente", () => {
    render(<Header.Root title="Dashboard" />);
    expect(screen.getByText("Dashboard")).toBeVisible();
  });

  it("deve renderizar botões de navegação", () => {
    render(<Header.Root title="Financeiro" />);
    // Botões de navegação (ChevronLeft e ChevronRight)
    expect(screen.getByRole("button", { name: "Voltar" })).toBeInTheDocument(); // fallback para botões sem label
    expect(screen.getByRole("button", { name: "Avançar" })).toBeInTheDocument(); // fallback para botões sem label
  });

  it("deve renderizar botões de ação com aria-label e UserProfile", () => {
    render(<Header.Root title="Financeiro" />);
    // Bell
    expect(screen.getByRole("button", { name: "Notificações" })).toBeInTheDocument();
    // Plus
    expect(screen.getByRole("button", { name: "Adicionar" })).toBeInTheDocument();
    // Landmark
    expect(screen.getByRole("button", { name: "Contas" })).toBeInTheDocument();
    // WalletCards
    expect(
      screen.getByRole("button", { name: "Cartões de Crédito" })
    ).toBeInTheDocument();
    // UserProfile
    expect(screen.getByRole("img", { name: /Rodrigo Miguel/i })).toBeVisible();
    expect(screen.getByText("Rodrigo Miguel")).toBeVisible();
    expect(screen.getByText("rodrigosmig@gmail.com")).toBeVisible();
  });
});
