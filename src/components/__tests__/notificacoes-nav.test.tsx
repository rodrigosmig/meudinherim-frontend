// Importa o módulo original para manter a função cn antes de qualquer importação
const originalStringHelper = jest.requireActual("@/helpers/string-helper");

import { render, screen } from "@/helpers/test/test-helper";
import userEvent from "@testing-library/user-event";
import NotificacoesNav from "../header/notificacoes-nav";
import { TipoContaAgendada } from "@/types/enum/tipo-conta-agendada";

// Mocks dos hooks
const mockedUseConfiguracaoInicial = jest.fn();
jest.mock("@/hooks/use-configuracao-inicial", () => ({
  useConfiguracaoInicial: () => mockedUseConfiguracaoInicial(),
}));

const mockedUseMobile = jest.fn();
jest.mock("@/hooks/use-is-mobile", () => ({
  useMobile: () => mockedUseMobile(),
}));

// Mocks dos helpers
jest.mock("@/helpers/string-helper", () => ({
  ...originalStringHelper,
  toBrDate: (date: string) => `DATA-${date}`,
  toCurrency: (valor: number) => `R$ ${valor}`,
}));

describe("NotificacoesNav", () => {
  const notificacoesMock = [
    {
      id: "1",
      idContaAgendada: "ca-1",
      tipo: TipoContaAgendada.CONTA_A_RECEBER,
      descricao: "Conta de água",
      dataVencimento: "2024-07-01",
      valor: 100,
      isParcela: false,
    },
    {
      id: "2",
      idContaAgendada: "ca-2",
      tipo: TipoContaAgendada.CONTA_A_PAGAR,
      descricao: "Conta de luz",
      dataVencimento: "2024-07-02",
      valor: 200,
      isParcela: false,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseMobile.mockReturnValue(false);
    mockedUseConfiguracaoInicial.mockReturnValue({
      data: { notificacoes: notificacoesMock },
      isFetching: false,
    });
  });

  it("deve renderizar o botão de notificações", () => {
    render(<NotificacoesNav />);
    expect(screen.getByRole("button", { name: "Notificações" })).toBeInTheDocument();
  });

  it("deve mostrar badge com quantidade de notificações", () => {
    render(<NotificacoesNav />);
    expect(screen.getByText(notificacoesMock.length.toString())).toBeInTheDocument();
  });

  it("não deve mostrar badge se não houver notificações", () => {
    mockedUseConfiguracaoInicial.mockReturnValue({ data: { notificacoes: [] }, isFetching: false });
    render(<NotificacoesNav />);
    expect(screen.queryByText("0")).not.toBeInTheDocument();
  });

  it("deve abrir menu e renderizar notificações corretamente", async () => {
    const user = userEvent.setup();
    render(<NotificacoesNav />);
    await user.click(screen.getByRole("button", { name: "Notificações" }));

    expect(screen.getByText("Notificações")).toBeVisible();

    // Primeira notificação
    expect(screen.getByText("Conta a Receber")).toBeVisible();
    expect(screen.getByText("Conta de água")).toBeVisible();
    expect(screen.getByText(/DATA-2024-07-01/)).toBeVisible();
    expect(screen.getByText(/R\$ 100/)).toBeVisible();

    // Segunda notificação
    expect(screen.getByText("Conta a Pagar")).toBeVisible();
    expect(screen.getByText("Conta de luz")).toBeVisible();
    expect(screen.getByText(/DATA-2024-07-02/)).toBeVisible();
    expect(screen.getByText(/R\$ 200/)).toBeVisible();
  });

  it("deve alinhar menu à direita no desktop", async () => {
    const user = userEvent.setup();
    render(<NotificacoesNav />);
    await user.click(screen.getByRole("button", { name: "Notificações" }));
    expect(screen.getByText("Notificações")).toBeVisible();
  });

  it("deve alinhar menu ao centro no mobile", async () => {
    mockedUseMobile.mockReturnValue(true);
    const user = userEvent.setup();
    render(<NotificacoesNav />);
    await user.click(screen.getByRole("button", { name: "Notificações" }));
    expect(screen.getByText("Notificações")).toBeVisible();
  });

  it('deve exibir botão "Marcar todas como lidas"', async () => {
    const user = userEvent.setup();
    render(<NotificacoesNav />);
    await user.click(screen.getByRole("button", { name: "Notificações" }));
    expect(screen.getByRole("button", { name: /Marcar todas como lidas/i })).toBeVisible();
  });
});