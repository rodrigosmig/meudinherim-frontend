import React from "react";
import { render, screen } from "@/helpers/test/test-helper";
import userEvent from "@testing-library/user-event";
import PagarContaAPagarForm from "../pagar-conta-a-pagar-form";
import { Periodicidade } from "@/types/enum/periodicidade";
import { StatusContaAgendada } from "@/types/enum/status-conta-agendada";
import { TipoContaAgendada } from "@/types/enum/tipo-conta-agendada";
import type { ContaAgendada } from "@/types/conta-agendada";

// ── fixtures ────────────────────────────────────────────────────────────────

const contaBase: ContaAgendada = {
  uuid: "conta-a-pagar-1",
  dataVencimento: "2026-08-15",
  descricao: "Aluguel",
  valor: 1500,
  idFatura: "",
  categoria: { uuid: "cat-1", descricao: "Moradia" },
  tipo: TipoContaAgendada.CONTA_A_PAGAR,
  periodicidade: Periodicidade.NENHUMA,
  status: StatusContaAgendada.A_VENCER,
  parcelado: false,
  dadosParcela: {
    idParcela: "",
    numeroDaParcela: 1,
    totalDeParcelas: 1,
    valorTotal: 1500,
    idLancamento: "",
    pago: false,
  },
  tags: [],
};

// ── mocks ──────────────────────────────────────────────────────────────────

jest.mock("@/components/toast", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

jest.mock("@/components/modal", () => ({
  __esModule: true,
  default: ({ trigger, children, title }: any) => (
    <div data-testid="modal">
      <div data-testid="modal-trigger">{trigger}</div>
      <div data-testid="modal-content">
        <h2>{title}</h2>
        {children}
      </div>
    </div>
  ),
}));

const mockContasOptions = [
  { value: "conta-1", label: "Itaú" },
  { value: "conta-2", label: "Nubank" },
];

const mockCartoesOptions = [
  { value: "cartao-1", label: "Nubank Mastercard" },
  { value: "cartao-2", label: "Itaú Visa" },
];

const mockFaturasComCartoes = [
  {
    uuid: "fat-1",
    cartao: { uuid: "cartao-1", descricao: "Nubank Mastercard", icon: "" },
    dataVencimento: "2026-08-10",
    dataFechamento: "2026-07-27",
    valorTotal: 3500,
    status: "ABERTA",
    permiteFecharFatura: true,
  },
  {
    uuid: "fat-2",
    cartao: { uuid: "cartao-2", descricao: "Itaú Visa", icon: "" },
    dataVencimento: "2026-08-20",
    dataFechamento: "2026-08-05",
    valorTotal: 1200,
    status: "ABERTA",
    permiteFecharFatura: true,
  },
];

const mockPagamento = jest.fn();

jest.mock("@/hooks/use-contas", () => ({
  useContas: jest.fn(() => ({
    contasOptions: mockContasOptions,
    isLoading: false,
  })),
}));

jest.mock("@/hooks/use-configuracao-inicial", () => ({
  useConfiguracaoInicial: jest.fn(() => ({
    data: { faturas: mockFaturasComCartoes },
    isLoading: false,
  })),
}));

jest.mock("@/components/primitives/select", () => ({
  Select: ({ label, options, value, onChange, disabled, icon: _icon, placeholder }: any) => (
    <div data-testid={`select-${label}`}>
      <label>{label}</label>
      <select
        aria-label={label}
        value={value ?? ""}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">{placeholder}</option>
        {options?.map((o: any) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
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
  default: ({ label, dateSelected, onChange }: any) => (
    <input
      aria-label={label}
      type="date"
      value="2026-08-01"
      onChange={(e) => onChange(new Date(e.target.value + "T00:00:00"))}
    />
  ),
}));

jest.mock("@/services/contas-a-pagar-service", () => ({
  contasAPagarService: { pagamento: (...args: any[]) => mockPagamento(...args) },
}));

// ── helpers ────────────────────────────────────────────────────────────────

const renderForm = (overrides: Partial<ContaAgendada> = {}) => {
  const conta = { ...contaBase, ...overrides };
  const user = userEvent.setup();
  const result = render(
    <PagarContaAPagarForm contaAPagar={conta}>
      <button type="button">Pagar</button>
    </PagarContaAPagarForm>,
  );
  return { ...result, user, conta };
};

const abrirModal = async () => {
  const user = userEvent.setup();
  await user.click(screen.getByRole("button", { name: "Pagar" }));
  return user;
};

// ── setup ──────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
  const { useConfiguracaoInicial } = require("@/hooks/use-configuracao-inicial");
  useConfiguracaoInicial.mockReturnValue({
    data: { faturas: mockFaturasComCartoes },
    isLoading: false,
  });
});

// ── testes ─────────────────────────────────────────────────────────────────

describe("PagarContaAPagarForm", () => {
  describe("renderização inicial", () => {
    it("renderiza toggle com Conta selecionado por padrão", async () => {
      renderForm();
      await abrirModal();

      const btnConta = screen.getByRole("button", { name: "Conta" });
      const btnCartao = screen.getByRole("button", { name: "Cartão" });

      // Conta deve ter a classe de ativo (primary)
      expect(btnConta.className).toContain("bg-primary/20");
      expect(btnCartao.className).not.toContain("bg-primary/20");
    });

    it("renderiza select de contas quando CONTA está ativo", async () => {
      renderForm();
      await abrirModal();

      expect(screen.getByTestId("select-Conta")).toBeInTheDocument();
      expect(screen.queryByTestId("select-Cartão")).not.toBeInTheDocument();
    });

    it("renderiza campos de data, vencimento, categoria, descrição e valor", async () => {
      renderForm();
      await abrirModal();

      expect(screen.getByLabelText("Data do pagamento")).toBeInTheDocument();
      expect(screen.getByDisplayValue("15/08/2026")).toBeInTheDocument(); // vencimento formatado
      expect(screen.getByDisplayValue("Moradia")).toBeInTheDocument(); // categoria
      expect(screen.getByDisplayValue("Aluguel")).toBeInTheDocument(); // descrição
      expect(screen.getByLabelText("Valor pago")).toBeInTheDocument();
    });
  });

  describe("toggle CONTA/CARTAO", () => {
    it("alterna para CARTAO e renderiza select de cartões", async () => {
      renderForm();
      const user = await abrirModal();

      await user.click(screen.getByRole("button", { name: "Cartão" }));

      // Cartão deve estar ativo
      expect(screen.getByRole("button", { name: "Cartão" }).className).toContain("bg-primary/20");
      // Deve renderizar select de cartão
      expect(screen.getByTestId("select-Cartão")).toBeInTheDocument();
      expect(screen.queryByTestId("select-Conta")).not.toBeInTheDocument();
    });

    it("volta para CONTA e renderiza select de contas novamente", async () => {
      renderForm();
      const user = await abrirModal();

      // Vai para Cartão
      await user.click(screen.getByRole("button", { name: "Cartão" }));
      expect(screen.getByTestId("select-Cartão")).toBeInTheDocument();

      // Volta para Conta
      await user.click(screen.getByRole("button", { name: "Conta" }));
      expect(screen.getByTestId("select-Conta")).toBeInTheDocument();
      expect(screen.queryByTestId("select-Cartão")).not.toBeInTheDocument();
    });
  });

  describe("botão Cartão disabled", () => {
    it("desabilita Cartão para conta parcelada", async () => {
      renderForm({ parcelado: true });
      await abrirModal();

      const btnCartao = screen.getByRole("button", { name: "Cartão" });
      expect(btnCartao).toBeDisabled();
      expect(btnCartao.title).toBe("Pagamento com cartão não disponível para contas parceladas");
    });

    it("desabilita Cartão quando não há cartões disponíveis", async () => {
      const { useConfiguracaoInicial } = require("@/hooks/use-configuracao-inicial");
      (useConfiguracaoInicial as jest.Mock).mockReturnValue({
        data: { faturas: [] },
        isLoading: false,
      });

      renderForm();
      await abrirModal();

      const btnCartao = screen.getByRole("button", { name: "Cartão" });
      expect(btnCartao).toBeDisabled();
      expect(btnCartao.title).toBe("Nenhum cartão disponível");
    });

    it("Cartão disponível para conta não parcelada com cartões", async () => {
      renderForm({ parcelado: false });
      await abrirModal();

      const btnCartao = screen.getByRole("button", { name: "Cartão" });
      expect(btnCartao).not.toBeDisabled();
    });

    it("desabilita Cartão quando conta possui idFatura preenchida", async () => {
      renderForm({ idFatura: "fatura-1" });
      await abrirModal();

      const btnCartao = screen.getByRole("button", { name: "Cartão" });
      expect(btnCartao).toBeDisabled();
      expect(btnCartao.title).toBe(
        "Pagamento com cartão não disponível para contas geradas pelo fechamento de fatura",
      );
    });
  });

  describe("limpeza do idConta ao alternar", () => {
    it("limpa idConta ao alternar de CONTA para CARTAO", async () => {
      renderForm();
      const user = await abrirModal();

      // Seleciona uma conta
      const selectConta = screen.getByLabelText("Conta");
      await user.selectOptions(selectConta, "conta-1");
      expect(selectConta).toHaveValue("conta-1");

      // Alterna para Cartão
      await user.click(screen.getByRole("button", { name: "Cartão" }));

      // O select de cartão deve estar com valor vazio
      const selectCartao = screen.getByLabelText("Cartão");
      expect(selectCartao).toHaveValue("");
    });

    it("limpa idConta ao alternar de CARTAO para CONTA", async () => {
      renderForm();
      const user = await abrirModal();

      // Vai para Cartão e seleciona
      await user.click(screen.getByRole("button", { name: "Cartão" }));
      const selectCartao = screen.getByLabelText("Cartão");
      await user.selectOptions(selectCartao, "cartao-1");

      // Volta para Conta
      await user.click(screen.getByRole("button", { name: "Conta" }));

      // O select de conta deve estar com valor vazio
      const selectConta = screen.getByLabelText("Conta");
      expect(selectConta).toHaveValue("");
    });
  });

  describe("submit do formulário", () => {
    it("envia tipoPagamento CONTA e idConta ao submeter", async () => {
      renderForm();
      const user = await abrirModal();

      // Seleciona conta
      await user.selectOptions(screen.getByLabelText("Conta"), "conta-1");

      // Clica em confirmar
      await user.click(screen.getByRole("button", { name: "Confirmar pagamento" }));

      expect(mockPagamento).toHaveBeenCalledWith("conta-a-pagar-1", {
        dataPagamento: "2026-08-01",
        valor: 1500,
        idParcela: "",
        idConta: "conta-1",
        tipoPagamento: "CONTA",
      });
    });

    it("envia tipoPagamento CARTAO ao submeter com cartão selecionado", async () => {
      renderForm();
      const user = await abrirModal();

      // Alterna para Cartão
      await user.click(screen.getByRole("button", { name: "Cartão" }));
      // Seleciona cartão
      await user.selectOptions(screen.getByLabelText("Cartão"), "cartao-1");

      // Submete
      await user.click(screen.getByRole("button", { name: "Confirmar pagamento" }));

      expect(mockPagamento).toHaveBeenCalledWith("conta-a-pagar-1", {
        dataPagamento: "2026-08-01",
        valor: 1500,
        idParcela: "",
        idConta: "cartao-1",
        tipoPagamento: "CARTAO",
      });
    });
  });

  describe("comportamento ao fechar modal", () => {
    it("reseta o formulário ao fechar o modal", async () => {
      renderForm();
      const user = await abrirModal();

      // Muda para Cartão
      await user.click(screen.getByRole("button", { name: "Cartão" }));

      // Fecha via botão Cancelar
      await user.click(screen.getByRole("button", { name: "Cancelar" }));

      // Abre novamente
      await user.click(screen.getByRole("button", { name: "Pagar" }));

      // Deve estar de volta em CONTA
      expect(screen.getByTestId("select-Conta")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Conta" }).className).toContain("bg-primary/20");
    });
  });
});
