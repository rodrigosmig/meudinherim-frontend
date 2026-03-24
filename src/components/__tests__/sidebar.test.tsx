import { render, screen, waitFor } from "@/helpers/test/test-helper";
import userEvent from "@testing-library/user-event";

import { Sidebar } from "../sidebar";

jest.mock('next/link', () => {
  return ({ children, ...props }: any) => {
    // Adiciona preventDefault para evitar navegação real nos testes
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      if (props.onClick) props.onClick(e);
    };
    return (
      <a {...props} onClick={handleClick}>
        {children}
      </a>
    );
  };
});

describe("Componente Sidebar", () => {
  it("deve renderizar itens principais e seções", () => {
    render(<Sidebar />);
    expect(screen.getByText("Meu Dinheirim")).toBeVisible();
    expect(screen.getByText("Controle Financeiro")).toBeVisible();
    expect(screen.getByRole("button", { name: "Abrir menu" })).toBeVisible();

    expect(screen.getByText("Dashboard")).toBeVisible();
    expect(screen.getByText("Categorias")).toBeVisible();
    expect(screen.getByText("Tags")).toBeVisible();
    expect(screen.getByText("Contas Bancárias")).toBeVisible();
    expect(screen.getByText("Cartões de Crédito")).toBeVisible();
    expect(screen.getByText("Contas a Pagar")).toBeVisible();
    expect(screen.getByText("Contas a Receber")).toBeVisible();
    expect(screen.getByText("Contas a Pagar/Receber")).toBeVisible();
    expect(screen.getByText("Lançamentos por categoria")).toBeVisible();
    expect(screen.getByText("Geral")).toBeVisible();
    expect(screen.getByText("Contas")).toBeVisible();
    expect(screen.getByText("Cartão de Crédito")).toBeVisible();
    expect(screen.getByText("Agendamento")).toBeVisible();
    expect(screen.getByText("Relatórios")).toBeVisible();
  });

  it("deve renderizar links corretos", () => {
    render(<Sidebar />);
    expect(screen.getByRole("link", { name: "Dashboard" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "Categorias" })).toHaveAttribute("href", "/categorias");
    expect(screen.getByRole("link", { name: "Tags" })).toHaveAttribute("href", "/tags");
    expect(screen.getByRole("link", { name: "Contas Bancárias" })).toHaveAttribute("href", "/contas-bancarias");
    expect(screen.getByRole("link", { name: "Cartões de Crédito" })).toHaveAttribute("href", "/cartoes-de-credito");
    expect(screen.getByRole("link", { name: "Contas a Pagar" })).toHaveAttribute("href", "/contas-a-pagar");
    expect(screen.getByRole("link", { name: "Contas a Receber" })).toHaveAttribute("href", "/contas-a-receber");
    expect(screen.getByRole("link", { name: "Contas a Pagar/Receber" })).toHaveAttribute("href", "/relatorios/contas-a-pagar-receber");
    expect(screen.getByRole("link", { name: "Lançamentos por categoria" })).toHaveAttribute("href", "/relatorios/lancamentos-por-categoria");
  });

  it("deve abrir o menu ao clicar no botão de menu", async () => {
    const user = userEvent.setup();
    render(<Sidebar />);
    await user.click(screen.getByRole("button", { name: "Abrir menu" }));
    expect(screen.getByRole("button", { name: "Fechar menu" })).toBeVisible();
  });

  it("deve colapsar e expandir a sidebar ao clicar no botão", async () => {
    const user = userEvent.setup();
    render(<Sidebar />);

    const btnCollapse = screen.getByRole("button", { name: "Recolher" });
    await user.click(btnCollapse);

    expect(screen.getByRole("button", { name: "Expandir" })).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Expandir" }));
    expect(screen.getByRole("button", { name: "Recolher" })).toBeVisible();
  });

  it("deve abrir e fechar o menu no mobile", async () => {
    window.innerWidth = 375;
    window.dispatchEvent(new Event("resize"));

    const user = userEvent.setup();
    render(<Sidebar />);
    const btnOpen = screen.getByRole("button", { name: "Abrir menu" });
    expect(btnOpen).toBeVisible();

    await user.click(btnOpen);
    const btnClose = screen.getByRole("button", { name: "Fechar menu" });
    expect(btnClose).toBeVisible();

    await user.click(btnClose);

    // Aguarda o DOM atualizar e o botão sumir
    await waitFor(() => {
      expect(btnClose).not.toBeVisible();
    });
  });

  it("deve fechar o menu mobile ao clicar em um item de navegação", async () => {
    window.innerWidth = 375;
    window.dispatchEvent(new Event("resize"));

    const user = userEvent.setup();
    render(<Sidebar />);
    const btnOpen = screen.getByRole("button", { name: "Abrir menu" });
    await user.click(btnOpen);

    // Lista de todos os itens de navegação
    const navItems = [
      "Dashboard",
      "Categorias",
      "Tags",
      "Contas Bancárias",
      "Cartões de Crédito",
      "Contas a Pagar",
      "Contas a Receber",
      "Contas a Pagar/Receber",
      "Lançamentos por categoria"
    ];

    for (const item of navItems) {
      // Reabre o menu antes de cada clique
      if (!screen.queryByRole("button", { name: "Fechar menu" })) {
        const btnOpenAgain = screen.getByRole("button", { name: "Abrir menu" });
        await user.click(btnOpenAgain);
      }
      const link = screen.getByRole("link", { name: item });
      // Simula apenas o clique normalmente (userEvent v14+ não aceita mais 2º argumento)
      await user.click(link);
      await waitFor(() => {
        expect(screen.queryByRole("button", { name: "Fechar menu" })).not.toBeInTheDocument();
      });
    }
  });
});