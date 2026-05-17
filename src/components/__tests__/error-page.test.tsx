import { render, screen } from "@/helpers/test/test-helper";
import { ErrorPage } from "../error-page";

jest.mock("@/components/header/responsive-page-title", () => ({
  __esModule: true,
  default: () => null,
}));

describe("ErrorPage", () => {
  it("renderiza o título", () => {
    render(<ErrorPage title="Erro ao carregar" message="Tente novamente mais tarde." />);
    expect(screen.getByText("Erro ao carregar")).toBeInTheDocument();
  });

  it("renderiza a mensagem", () => {
    render(<ErrorPage title="Erro" message="Tente novamente mais tarde." />);
    expect(screen.getByText("Tente novamente mais tarde.")).toBeInTheDocument();
  });

  it("renderiza o ícone de erro", () => {
    const { container } = render(<ErrorPage title="Erro" message="Mensagem de erro" />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });
});
