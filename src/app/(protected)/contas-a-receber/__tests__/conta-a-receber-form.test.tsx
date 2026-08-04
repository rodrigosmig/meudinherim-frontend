import React from "react";
import { render, screen } from "@/helpers/test/test-helper";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ContaAgendada } from "@/types/conta-agendada";
import { Periodicidade } from "@/types/enum/periodicidade";
import { StatusContaAgendada } from "@/types/enum/status-conta-agendada";
import { TipoContaAgendada } from "@/types/enum/tipo-conta-agendada";
import ContaAReceberForm from "../conta-a-receber-form";

// ── mocks ──────────────────────────────────────────────────────────────────

jest.mock("@/components/toast", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

jest.mock("@/hooks/use-categorias", () => ({
  useCategorias: () => ({
    categoriasEntrada: [
      { uuid: "cat-1", nome: "Salário" },
    ],
    isLoading: false,
  }),
}));

jest.mock("@/hooks/use-tags", () => ({
  useTags: () => ({ tagsOptions: [], isLoading: false }),
}));

const mockUseConexoesConfiguracaoInicial = jest.fn();
jest.mock("@/hooks/use-conexoes-configuracao-inicial", () => ({
  useConexoesConfiguracaoInicial: () => mockUseConexoesConfiguracaoInicial(),
}));

jest.mock("@/services/conexoes-service", () => ({
  conexoesService: { listar: jest.fn() },
}));

jest.mock("@/components/primitives/select", () => ({
  Select: ({ label, options, onChange, value, disabled, isMulti }: any) =>
    isMulti ? null : (
      <select
        aria-label={label}
        value={value ?? ""}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Selecione</option>
        {options?.map((o: any) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    ),
}));

jest.mock("@/components/primitives/input-money", () => ({
  InputMoney: ({ label, value, onChange }: any) => (
    <input
      aria-label={label}
      type="number"
      value={value ?? ""}
      onChange={(e) => onChange(parseFloat(e.target.value) || null)}
    />
  ),
}));

jest.mock("@/components/primitives/input-date", () => ({
  __esModule: true,
  default: ({ label, onChange }: any) => (
    <input
      aria-label={label}
      type="date"
      defaultValue="2026-05-01"
      onChange={(e) => onChange(new Date(e.target.value + "T00:00:00"))}
    />
  ),
}));

jest.mock("@/services/contas-a-receber-service", () => ({
  contasAReceberService: { cadastrar: jest.fn(), alterar: jest.fn() },
}));

// ── helpers ────────────────────────────────────────────────────────────────

const createWrapper = () => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
};

const { conexoesService } = jest.requireMock("@/services/conexoes-service");

const conexaoAceita = {
  uuid: "conn-1",
  usuarioConexao: { id: "user-1", nome: "João Silva", email: "joao@email.com" },
  status: "ACEITA",
  criadoEm: "2025-01-15T10:00:00",
  atualizadoEm: "2025-01-15T10:00:00",
};

const contaAReceberEdit: ContaAgendada = {
  uuid: "cr-1",
  dataVencimento: "2026-05-10",
  descricao: "Salário",
  valor: 1000,
  idFatura: "",
  categoria: { uuid: "cat-1", descricao: "Salário" },
  tipo: TipoContaAgendada.CONTA_A_RECEBER,
  periodicidade: Periodicidade.NENHUMA,
  status: StatusContaAgendada.ABERTO,
  parcelado: false,
  dadosParcela: {
    idParcela: "",
    numeroDaParcela: 1,
    totalDeParcelas: 1,
    valorTotal: 1000,
    idLancamento: "",
    pago: false,
  },
  tags: [],
};

function mockConexoesConfiguracao(
  conexoesAtivas: Array<Record<string, unknown>> = [],
  isLoading = false,
) {
  mockUseConexoesConfiguracaoInicial.mockReturnValue({
    conexoesAtivas,
    isLoading,
    isFetching: false,
  });
}

// ── setup ──────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
  mockConexoesConfiguracao();
});

// ── testes ─────────────────────────────────────────────────────────────────

describe("ContaAReceberForm - valor da parcela", () => {
  it("não deve exibir label de valor da parcela quando parcelado está desativado", async () => {
    const user = userEvent.setup();
    render(
      <ContaAReceberForm>
        <button type="button">Adicionar</button>
      </ContaAReceberForm>,
      { wrapper: createWrapper() },
    );

    await user.click(screen.getByRole("button", { name: "Adicionar" }));
    await user.type(screen.getByRole("spinbutton", { name: "Valor" }), "1000");

    expect(
      screen.queryByText(/Valor de cada parcela/),
    ).not.toBeInTheDocument();
  });

  it("deve exibir R$ 0,00 quando parcelado está ativo sem quantidade de parcelas", async () => {
    const user = userEvent.setup();
    render(
      <ContaAReceberForm>
        <button type="button">Adicionar</button>
      </ContaAReceberForm>,
      { wrapper: createWrapper() },
    );

    await user.click(screen.getByRole("button", { name: "Adicionar" }));
    await user.type(screen.getByRole("spinbutton", { name: "Valor" }), "1000");
    await user.click(screen.getByText("Parcelado"));

    expect(
      screen.getByText("Valor de cada parcela: R$ 0,00"),
    ).toBeVisible();
  });

  it("deve exibir o valor correto da parcela quando valor e quantidade são preenchidos", async () => {
    const user = userEvent.setup();
    render(
      <ContaAReceberForm>
        <button type="button">Adicionar</button>
      </ContaAReceberForm>,
      { wrapper: createWrapper() },
    );

    await user.click(screen.getByRole("button", { name: "Adicionar" }));
    await user.type(screen.getByRole("spinbutton", { name: "Valor" }), "1000");
    await user.click(screen.getByText("Parcelado"));

    const parcelasInput = screen.getByPlaceholderText("Informe o número de parcelas");
    await user.type(parcelasInput, "5");

    expect(
      screen.getByText("Valor de cada parcela: R$ 200,00"),
    ).toBeVisible();
  });
});

describe("ContaAReceberForm - cobrança", () => {
  it("não deve fazer requisição própria de conexões ao abrir o form", async () => {
    const user = userEvent.setup();
    mockConexoesConfiguracao([conexaoAceita]);
    render(
      <ContaAReceberForm>
        <button type="button">Adicionar</button>
      </ContaAReceberForm>,
      { wrapper: createWrapper() },
    );

    await user.click(screen.getByRole("button", { name: "Adicionar" }));

    expect(conexoesService.listar).not.toHaveBeenCalled();
  });

  it("deve listar apenas conexões ativas no select Devedor ao ativar Criar como cobrança", async () => {
    const user = userEvent.setup();
    mockConexoesConfiguracao([conexaoAceita]);
    render(
      <ContaAReceberForm>
        <button type="button">Adicionar</button>
      </ContaAReceberForm>,
      { wrapper: createWrapper() },
    );

    await user.click(screen.getByRole("button", { name: "Adicionar" }));
    await user.click(screen.getByText("Criar como cobrança"));

    const devedorSelect = screen.getByLabelText("Devedor") as HTMLSelectElement;
    expect(devedorSelect).toBeVisible();
    expect(
      screen.getByRole("option", { name: "João Silva" }),
    ).toBeInTheDocument();
  });

  it("deve desabilitar Criar como cobrança e exibir mensagem quando não há conexões ativas", async () => {
    const user = userEvent.setup();
    mockConexoesConfiguracao([]);
    render(
      <ContaAReceberForm>
        <button type="button">Adicionar</button>
      </ContaAReceberForm>,
      { wrapper: createWrapper() },
    );

    await user.click(screen.getByRole("button", { name: "Adicionar" }));

    expect(
      screen.getByRole("switch", { name: "Criar como cobrança" }),
    ).toBeDisabled();
    expect(
      screen.getByText("Você não tem conexões ativas. Adicione contatos primeiro."),
    ).toBeVisible();
  });

  it("não deve exibir mensagem de sem conexões enquanto a configuração inicial carrega", async () => {
    const user = userEvent.setup();
    mockConexoesConfiguracao([], true);
    render(
      <ContaAReceberForm>
        <button type="button">Adicionar</button>
      </ContaAReceberForm>,
      { wrapper: createWrapper() },
    );

    await user.click(screen.getByRole("button", { name: "Adicionar" }));

    expect(
      screen.queryByText("Você não tem conexões ativas. Adicione contatos primeiro."),
    ).not.toBeInTheDocument();
  });

  it("não deve exibir campos de cobrança em modo edição", async () => {
    const user = userEvent.setup();
    mockConexoesConfiguracao([conexaoAceita]);
    render(
      <ContaAReceberForm contaAReceber={contaAReceberEdit}>
        <button type="button">Editar</button>
      </ContaAReceberForm>,
      { wrapper: createWrapper() },
    );

    await user.click(screen.getByRole("button", { name: "Editar" }));

    expect(
      screen.queryByText("Criar como cobrança"),
    ).not.toBeInTheDocument();
  });
});
