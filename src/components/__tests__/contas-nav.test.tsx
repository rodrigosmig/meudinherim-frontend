import { toCurrency } from "@/helpers/string-helper";
import { render, screen, waitFor } from "@/helpers/test/test-helper";
import userEvent from "@testing-library/user-event";

import { ContasNav } from "../header/contas-nav";

const hasCurrencyText = (value: number) => (_: string, element: Element | null) => {
  if (!element?.textContent) return false;

  const normalize = (text: string) => text.replace(/\s+/g, "");
  return normalize(element.textContent) === normalize(toCurrency(value));
};

const mockedUseContas = jest.fn();
jest.mock("@/hooks/use-contas", () => ({
  useContas: () => mockedUseContas(),
}));

const mockedUseMobile = jest.fn();
jest.mock("@/hooks/use-is-mobile", () => ({
  useMobile: () => mockedUseMobile(),
}));

describe("Componente ContasNav", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseMobile.mockReturnValue(false);
    mockedUseContas.mockReturnValue({
      contas: [
        {
          uuid: "1",
          nome: "Conta Principal",
          tipo: "CORRENTE",
          status: "ATIVO",
          icon: "landmark",
          saldo: 1000,
        },
        {
          uuid: "2",
          nome: "Cartao Virtual",
          tipo: "CORRENTE",
          status: "ATIVO",
          icon: "credit-card",
          saldo: -250,
        },
      ],
      saldoTotal: 750,
      isFetching: false,
      isLoading: false,
    });
  });

  it("deve renderizar o botão de abrir contas", () => {
    render(<ContasNav />);

    expect(screen.getByRole("button", { name: "Contas" })).toBeInTheDocument();
  });

  it("deve abrir menu e renderizar contas com total", async () => {
    const user = userEvent.setup();
    render(<ContasNav />);

    await user.click(screen.getByRole("button", { name: "Contas" }));

    expect(screen.getByText("Contas")).toBeVisible();
    expect(screen.getByText("Conta Principal")).toBeVisible();
    expect(screen.getByText("Cartao Virtual")).toBeVisible();
    expect(screen.getByText(hasCurrencyText(1000))).toBeVisible();
    expect(screen.getByText(hasCurrencyText(-250))).toBeVisible();

    await waitFor(() => {
      expect(screen.getByText(hasCurrencyText(750))).toBeVisible();
    });
  });

  it("deve usar avatar maior no desktop", async () => {
    const user = userEvent.setup();
    render(<ContasNav />);

    await user.click(screen.getByRole("button", { name: "Contas" }));

    const avatar = await screen.findByRole("img", { name: "Avatar de Conta Principal" });
    expect(avatar).toHaveStyle({ width: "36px", height: "36px" });
  });

  it("deve usar avatar menor no mobile", async () => {
    mockedUseMobile.mockReturnValue(true);
    const user = userEvent.setup();
    render(<ContasNav />);

    await user.click(screen.getByRole("button", { name: "Contas" }));

    const avatar = await screen.findByRole("img", { name: "Avatar de Conta Principal" });
    expect(avatar).toHaveStyle({ width: "34px", height: "34px" });
  });
});