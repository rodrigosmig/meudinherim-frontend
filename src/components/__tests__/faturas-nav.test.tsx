import { toBrDate, toCurrency } from "@/helpers/string-helper";
import { render, screen, waitFor } from "@/helpers/test/test-helper";
import userEvent from "@testing-library/user-event";

import { FaturasNav } from "../header/faturas-nav";

const hasCurrencyText = (value: number) => (_: string, element: Element | null) => {
  if (!element?.textContent) return false;

  const normalize = (text: string) => text.replace(/\s+/g, "");
  const expected = normalize(toCurrency(value));
  const hasSameText = normalize(element.textContent) === expected;
  const childHasSameText = Array.from(element.children).some((child) => {
    return normalize(child.textContent ?? "") === expected;
  });

  return hasSameText && !childHasSameText;
};

const mockedUseConfiguracaoInicial = jest.fn();
jest.mock("@/hooks/use-configuracao-inicial", () => ({
  useConfiguracaoInicial: () => mockedUseConfiguracaoInicial(),
}));

const mockedUseMobile = jest.fn();
jest.mock("@/hooks/use-is-mobile", () => ({
  useMobile: () => mockedUseMobile(),
}));

describe("Componente FaturasNav", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseMobile.mockReturnValue(false);
    mockedUseConfiguracaoInicial.mockReturnValue({
      data: {
        faturas: [
          {
            uuid: "1",
            cartao: "Cartao Black",
            dataVencimento: "2026-03-20",
            dataFechamento: "2026-03-10",
            valorTotal: 1200,
            status: "PENDENTE",
            isFechada: false,
          },
          {
            uuid: "2",
            cartao: "Cartao Gold",
            dataVencimento: "2026-03-25",
            dataFechamento: "2026-03-15",
            valorTotal: 300,
            status: "PENDENTE",
            isFechada: false,
          },
        ],
      },
      isFetching: false,
    });
  });

  it("deve renderizar o botão de abrir faturas", () => {
    render(<FaturasNav />);

    expect(screen.getByRole("button", { name: "Faturas" })).toBeInTheDocument();
  });

  it("deve abrir menu e renderizar faturas com total", async () => {
    const user = userEvent.setup();
    render(<FaturasNav />);

    await user.click(screen.getByRole("button", { name: "Faturas" }));

    expect(screen.getByText("Faturas")).toBeVisible();
    expect(screen.getByText("Cartao Black")).toBeVisible();
    expect(screen.getByText("Cartao Gold")).toBeVisible();
    expect(screen.getByText(toBrDate("2026-03-20"))).toBeVisible();
    expect(screen.getByText(toBrDate("2026-03-25"))).toBeVisible();
    expect(screen.getByText(hasCurrencyText(1200))).toBeVisible();
    expect(screen.getByText(hasCurrencyText(300))).toBeVisible();

    await waitFor(() => {
      expect(screen.getByText(hasCurrencyText(1500))).toBeVisible();
    });
  });

  it("deve usar avatar maior no desktop", async () => {
    const user = userEvent.setup();
    render(<FaturasNav />);

    await user.click(screen.getByRole("button", { name: "Faturas" }));

    const avatar = await screen.findByRole("img", { name: "Avatar de Cartao Black" });
    expect(avatar).toHaveStyle({ width: "42px", height: "42px" });
  });

  it("deve usar avatar menor no mobile", async () => {
    mockedUseMobile.mockReturnValue(true);
    const user = userEvent.setup();
    render(<FaturasNav />);

    await user.click(screen.getByRole("button", { name: "Faturas" }));

    const avatar = await screen.findByRole("img", { name: "Avatar de Cartao Black" });
    expect(avatar).toHaveStyle({ width: "38px", height: "38px" });
  });
});