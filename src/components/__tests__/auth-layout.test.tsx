import { render, screen } from "@/helpers/test/test-helper";
import { AuthLayout } from "../auth-layout";

describe("AuthLayout", () => {
  it("renderiza o título passado via prop", () => {
    render(<AuthLayout title="Meu Título"><p>conteúdo</p></AuthLayout>);
    expect(screen.getByText("Meu Título")).toBeInTheDocument();
  });

  it("renderiza o subtítulo quando fornecido", () => {
    render(<AuthLayout title="Título" subtitle="Subtítulo aqui"><p>filho</p></AuthLayout>);
    expect(screen.getByText("Subtítulo aqui")).toBeInTheDocument();
  });

  it("não renderiza subtítulo quando omitido", () => {
    render(<AuthLayout title="Título"><p>filho</p></AuthLayout>);
    expect(screen.queryByText("Subtítulo aqui")).not.toBeInTheDocument();
  });

  it("renderiza os filhos (children)", () => {
    render(
      <AuthLayout title="Título">
        <button>Botão filho</button>
      </AuthLayout>,
    );
    expect(screen.getByRole("button", { name: "Botão filho" })).toBeInTheDocument();
  });

  it("renderiza o link de voltar quando backHref é fornecido", () => {
    render(<AuthLayout title="Título" backHref="/login"><p>filho</p></AuthLayout>);
    const link = screen.getByRole("link", { name: /voltar/i });
    expect(link).toHaveAttribute("href", "/login");
  });

  it("não renderiza o link de voltar quando backHref é omitido", () => {
    render(<AuthLayout title="Título"><p>filho</p></AuthLayout>);
    expect(screen.queryByRole("link", { name: /voltar/i })).not.toBeInTheDocument();
  });

  it("renderiza a marca 'Meu Dinheirim'", () => {
    render(<AuthLayout title="Título"><p>filho</p></AuthLayout>);
    expect(screen.getAllByText("Meu Dinheirim").length).toBeGreaterThan(0);
  });
});
