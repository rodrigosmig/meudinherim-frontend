import { render, screen } from "@/helpers/test/test-helper";
import { StatusBadge } from "../status-badge";
import { StatusCobranca } from "@/types/enum/status-cobranca";

describe("StatusBadge", () => {
  it("renderiza 'Aberto' para status ABERTO", () => {
    render(<StatusBadge status={StatusCobranca.ABERTO} />);
    expect(screen.getByText("Aberto")).toBeInTheDocument();
  });

  it("renderiza 'Pago' para status PAGO", () => {
    render(<StatusBadge status={StatusCobranca.PAGO} />);
    expect(screen.getByText("Pago")).toBeInTheDocument();
  });

  it("renderiza 'Cancelado' para status CANCELADA", () => {
    render(<StatusBadge status={StatusCobranca.CANCELADA} />);
    expect(screen.getByText("Cancelado")).toBeInTheDocument();
  });
});
