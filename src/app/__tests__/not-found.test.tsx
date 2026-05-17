import { render, screen } from "@/helpers/test/test-helper";
import NotFound from "../not-found";

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

describe("NotFound", () => {
  it("renderiza o código 404", () => {
    render(<NotFound />);
    expect(screen.getByText("404")).toBeInTheDocument();
  });

  it("renderiza o título 'Página não encontrada'", () => {
    render(<NotFound />);
    expect(screen.getByText("Página não encontrada")).toBeInTheDocument();
  });

  it("renderiza o link de voltar ao início", () => {
    render(<NotFound />);
    const link = screen.getByRole("link", { name: /Voltar para o início/i });
    expect(link).toHaveAttribute("href", "/");
  });
});
