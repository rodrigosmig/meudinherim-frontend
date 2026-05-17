import { render, screen } from "@/helpers/test/test-helper";
import ValidarCodigoPage from "../page";

jest.mock("../validar-codigo-form", () => ({
  ValidarCodigoForm: () => <div>ValidarCodigoForm</div>,
}));

jest.mock("@/components/auth-layout", () => ({
  AuthLayout: ({ children, title, subtitle }: any) => (
    <div>
      <h1>{title}</h1>
      {subtitle && <p>{subtitle}</p>}
      {children}
    </div>
  ),
}));

describe("ValidarCodigoPage", () => {
  it("renderiza o título correto", () => {
    render(<ValidarCodigoPage />);
    expect(screen.getByText("Verifique seu e-mail")).toBeInTheDocument();
  });

  it("renderiza o subtítulo", () => {
    render(<ValidarCodigoPage />);
    expect(screen.getByText(/código de 6 dígitos/i)).toBeInTheDocument();
  });

  it("renderiza o formulário de validação", () => {
    render(<ValidarCodigoPage />);
    expect(screen.getByText("ValidarCodigoForm")).toBeInTheDocument();
  });
});
