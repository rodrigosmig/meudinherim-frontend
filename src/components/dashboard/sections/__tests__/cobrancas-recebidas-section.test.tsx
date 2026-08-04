import { render, screen } from "@/helpers/test/test-helper";

import { CobrancasRecebidasSection } from "../cobrancas-recebidas-section";
import { CobrancaRecebida } from "@/types/cobranca";
import { StatusCobranca } from "@/types/enum/status-cobranca";

// ── mocks ──────────────────────────────────────────────────────────────────

jest.mock("next/link", () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

// ── helpers ────────────────────────────────────────────────────────────────

function criarCobranca(overrides: Partial<CobrancaRecebida> = {}): CobrancaRecebida {
  return {
    uuid: "uuid-1",
    cobrador: { id: "user-1", nome: "João Silva", email: "joao@email.com" },
    descricao: "Mensalidade academia",
    valor: 150.0,
    status: StatusCobranca.ABERTO,
    criadoEm: "2025-12-01T10:00:00",
    pagoEm: undefined,
    gerouContaAPagar: false,
    data: "2025-12-15",
    isParcelado: false,
    ...overrides,
  };
}

// ── testes ─────────────────────────────────────────────────────────────────

describe("CobrancasRecebidasSection", () => {
  it("renderiza nome do cobrador, descrição, valor e data de vencimento", () => {
    const cobrancas = [criarCobranca()];
    render(<CobrancasRecebidasSection cobrancas={cobrancas} />);

    expect(screen.getByText("João Silva")).toBeInTheDocument();
    expect(screen.getByText("Mensalidade academia")).toBeInTheDocument();
    expect(screen.getByText("R$ 150,00")).toBeInTheDocument();
    expect(screen.getByText("Vencimento: 15/12/2025")).toBeInTheDocument();
  });

  it("filtra apenas cobranças com status ABERTO", () => {
    const cobrancas = [
      criarCobranca({ uuid: "uuid-1", status: StatusCobranca.ABERTO, cobrador: { id: "1", nome: "Aberto", email: "a@a.com" } }),
      criarCobranca({ uuid: "uuid-2", status: StatusCobranca.PAGO, cobrador: { id: "2", nome: "Pago", email: "b@b.com" } }),
      criarCobranca({ uuid: "uuid-3", status: StatusCobranca.CANCELADA, cobrador: { id: "3", nome: "Cancelada", email: "c@c.com" } }),
    ];

    render(<CobrancasRecebidasSection cobrancas={cobrancas} />);

    expect(screen.getByText("Aberto")).toBeInTheDocument();
    expect(screen.queryByText("Pago")).not.toBeInTheDocument();
    expect(screen.queryByText("Cancelada")).not.toBeInTheDocument();
  });

  it("exibe badge 'Conta gerada' quando gerouContaAPagar é true", () => {
    const cobrancas = [criarCobranca({ gerouContaAPagar: true })];
    render(<CobrancasRecebidasSection cobrancas={cobrancas} />);

    expect(screen.getByText("Conta gerada")).toBeInTheDocument();
    expect(screen.queryByText("Pendente")).not.toBeInTheDocument();
  });

  it("exibe badge 'Pendente' quando gerouContaAPagar é false", () => {
    const cobrancas = [criarCobranca({ gerouContaAPagar: false })];
    render(<CobrancasRecebidasSection cobrancas={cobrancas} />);

    expect(screen.getByText("Pendente")).toBeInTheDocument();
    expect(screen.queryByText("Conta gerada")).not.toBeInTheDocument();
  });

  it("exibe mensagem de vazio quando não há cobranças em aberto", () => {
    render(<CobrancasRecebidasSection cobrancas={[]} />);

    expect(screen.getByText("Nenhuma cobrança recebida em aberto.")).toBeInTheDocument();
  });

  it("exibe mensagem de vazio quando todas as cobranças estão pagas ou canceladas", () => {
    const cobrancas = [
      criarCobranca({ uuid: "uuid-1", status: StatusCobranca.PAGO }),
      criarCobranca({ uuid: "uuid-2", status: StatusCobranca.CANCELADA }),
    ];

    render(<CobrancasRecebidasSection cobrancas={cobrancas} />);

    expect(screen.getByText("Nenhuma cobrança recebida em aberto.")).toBeInTheDocument();
  });

  it("exibe link 'Ver todas →' apontando para /cobrancas", () => {
    const cobrancas = [criarCobranca()];
    render(<CobrancasRecebidasSection cobrancas={cobrancas} />);

    const link = screen.getByText("Ver todas →");
    expect(link).toBeInTheDocument();
    expect(link.closest("a")).toHaveAttribute("href", "/cobrancas");
  });
});
