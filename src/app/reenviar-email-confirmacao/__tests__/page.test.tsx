import { render, screen } from "@/utils/test-utils";

import ReenviarEmailConfirmacao from "../page";

const mockedPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockedPush }),
}));

describe("Page ReenviarEmailConfirmacao", () => {
  it("deve renderizar o título e o formulário", () => {
    render(<ReenviarEmailConfirmacao />);
    expect(screen.getByText("MEU DINHEIRIM")).toBeInTheDocument();
    expect(screen.getByText("Reenviar e-mail")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reenviar e-mail de confirmação" })).toBeInTheDocument();
    expect(screen.getByLabelText("E-mail")).toBeInTheDocument();
  });

  it("deve renderizar o botão de voltar", () => {
    render(<ReenviarEmailConfirmacao />);
    const link = screen.getByRole("link", { name: "" });
    expect(link).toHaveAttribute("href", "/login");
    const button = screen.getByRole("button", { name: "Voltar" });
    expect(link).toContainElement(button);
  });
});
