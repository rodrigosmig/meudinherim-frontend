import { render, screen } from "@/helpers/test/test-helper";
import userEvent from "@testing-library/user-event";

import { AdicionarNav } from "../header/adicionar-nav";

jest.mock(
  "@/app/(protected)/cartoes-de-credito/[idCartao]/faturas/[idFatura]/lancamentos/lancamento-cartao-form",
  () => ({ __esModule: true, default: ({ open }: { open?: boolean }) => open ? <div role="dialog">Form Cartão</div> : null }),
);
jest.mock(
  "@/app/(protected)/contas-bancarias/[idConta]/lancamentos/lancamento-conta-form",
  () => ({ __esModule: true, default: ({ open }: { open?: boolean }) => open ? <div role="dialog">Form Conta</div> : null }),
);
jest.mock(
  "@/app/(protected)/categorias/categoria-form",
  () => ({ __esModule: true, default: ({ open }: { open?: boolean }) => open ? <div role="dialog">Form Categoria</div> : null }),
);
jest.mock(
  "@/app/(protected)/orcamentos/orcamento-form",
  () => ({ __esModule: true, default: ({ open }: { open?: boolean }) => open ? <div role="dialog">Form Orçamento</div> : null }),
);
jest.mock(
  "@/app/(protected)/contas-a-pagar/conta-a-pagar-form",
  () => ({ __esModule: true, default: ({ open }: { open?: boolean }) => open ? <div role="dialog">Form Conta a Pagar</div> : null }),
);
jest.mock(
  "@/app/(protected)/contas-a-receber/conta-a-receber-form",
  () => ({ __esModule: true, default: ({ open }: { open?: boolean }) => open ? <div role="dialog">Form Conta a Receber</div> : null }),
);

const mockedUseMobile = jest.fn();
jest.mock("@/hooks/use-is-mobile", () => ({
  useMobile: () => mockedUseMobile(),
}));

describe("Componente AdicionarNav", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseMobile.mockReturnValue(false);
  });

  it("deve renderizar o botão de abrir menu", () => {
    render(<AdicionarNav />);

    expect(screen.getByRole("button", { name: "Adicionar" })).toBeInTheDocument();
  });

  it("não deve exibir o menu antes de clicar no botão", () => {
    render(<AdicionarNav />);

    expect(screen.queryByText("Lançamento no cartão")).not.toBeInTheDocument();
  });

  it("deve abrir o menu ao clicar no botão", async () => {
    const user = userEvent.setup();
    render(<AdicionarNav />);

    await user.click(screen.getByRole("button", { name: "Adicionar" }));

    expect(screen.getByText("Adicionar")).toBeVisible();
  });

  it("deve exibir todos os itens ao abrir o menu", async () => {
    const user = userEvent.setup();
    render(<AdicionarNav />);

    await user.click(screen.getByRole("button", { name: "Adicionar" }));

    expect(screen.getByText("Lançamento no cartão")).toBeVisible();
    expect(screen.getByText("Lançamento na conta")).toBeVisible();
    expect(screen.getByText("Categoria")).toBeVisible();
    expect(screen.getByText("Orçamento")).toBeVisible();
    expect(screen.getByText("Contas a Pagar")).toBeVisible();
    expect(screen.getByText("Contas a Receber")).toBeVisible();
  });

  it("deve exibir os rótulos de seção", async () => {
    const user = userEvent.setup();
    render(<AdicionarNav />);

    await user.click(screen.getByRole("button", { name: "Adicionar" }));

    expect(screen.getByText("Lançamentos")).toBeVisible();
    expect(screen.getByText("Cadastros")).toBeVisible();
    expect(screen.getByText("Agendamentos")).toBeVisible();
  });

  it("deve abrir o formulário de lançamento no cartão ao clicar no item", async () => {
    const user = userEvent.setup();
    render(<AdicionarNav />);

    await user.click(screen.getByRole("button", { name: "Adicionar" }));
    await user.click(screen.getByText("Lançamento no cartão"));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("deve abrir o formulário de lançamento na conta ao clicar no item", async () => {
    const user = userEvent.setup();
    render(<AdicionarNav />);

    await user.click(screen.getByRole("button", { name: "Adicionar" }));
    await user.click(screen.getByText("Lançamento na conta"));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});
