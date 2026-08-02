import React from "react";
import { render, screen, waitFor } from "@/helpers/test/test-helper";
import userEvent from "@testing-library/user-event";

import { toast } from "@/components/toast";
import ApiError from "@/types/application-error";
import { DEFAULT_ERROR_MESSAGE } from "@/helpers/route-helpers";
import type { Categoria } from "@/types/categorias";
import { TipoCategoria } from "@/types/enum/tipo-categoria";
import { Status } from "@/types/enum/status";

import GerarContaAPagarModal from "../gerar-conta-pagar-modal";

// ── mocks ──────────────────────────────────────────────────────────────────

jest.mock("@/components/toast", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

const mockUseCategorias = jest.fn();
jest.mock("@/hooks/use-categorias", () => ({
  useCategorias: () => mockUseCategorias(),
}));

jest.mock("@/components/primitives/select", () => ({
  Select: ({
    label,
    options,
    value,
    onChange,
    placeholder,
    error,
  }: {
    label: string;
    options: { value: string; label: string }[];
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    error?: { message?: string };
  }) => (
    <div>
      <label>{label}</label>
      <select
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        data-testid="categoria-select"
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span data-testid="select-error">{error.message}</span>}
    </div>
  ),
}));

jest.mock("@/components/primitives/switch", () => ({
  __esModule: true,
  default: ({
    label,
    checked,
    onCheckedChange,
  }: {
    label: string;
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
  }) => (
    <label>
      <input
        type="checkbox"
        data-testid="switch-parcelado"
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)}
      />
      {label}
    </label>
  ),
}));

jest.mock("@/components/primitives/input", () => ({
  Input: React.forwardRef(
    (
      props: {
        placeholder?: string;
        error?: { message?: string };
        [key: string]: unknown;
      },
      ref: React.Ref<HTMLInputElement>,
    ) => (
      <div>
        <input
          ref={ref}
          data-testid="input-parcelas"
          placeholder={props.placeholder}
          {...props}
        />
        {props.error && (
          <span data-testid="input-error">{props.error.message}</span>
        )}
      </div>
    ),
  ),
}));

jest.mock("@/components/primitives/text", () => ({
  __esModule: true,
  default: ({
    children,
    className,
    variant,
  }: {
    children: React.ReactNode;
    className?: string;
    variant?: string;
  }) => <span className={className}>{children}</span>,
}));

jest.mock("@/services/cobrancas-service", () => ({
  cobrancasService: {
    gerarContaAPagar: jest.fn(),
  },
}));

// ── helpers ────────────────────────────────────────────────────────────────

const { cobrancasService } = jest.requireMock("@/services/cobrancas-service");

const categoriaAlimentacao: Categoria = {
  uuid: "cat-1",
  nome: "Alimentação",
  tipo: TipoCategoria.SAIDA,
  status: Status.ATIVO,
  exibirNaDashboard: true,
};

const categoriaTransporte: Categoria = {
  uuid: "cat-2",
  nome: "Transporte",
  tipo: TipoCategoria.SAIDA,
  status: Status.ATIVO,
  exibirNaDashboard: false,
};

function mockCategorias(categoriasSaida: Categoria[] = [], isLoading = false) {
  mockUseCategorias.mockReturnValue({
    categoriasSaida,
    isLoading,
    isFetching: false,
    categorias: [],
    categoriasEntrada: [],
    categoriasOptions: [],
  });
}

// ── setup ──────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
  mockCategorias([categoriaAlimentacao, categoriaTransporte]);
});

// ── testes ─────────────────────────────────────────────────────────────────

describe("GerarContaAPagarModal", () => {
  const defaultProps = {
    cobrancaUuid: "cob-rec-1",
    valorCobranca: 2500,
    open: true,
    onOpenChange: jest.fn(),
  };

  describe("renderização", () => {
    it("deve renderizar o título do modal", () => {
      render(<GerarContaAPagarModal {...defaultProps} />);

      expect(screen.getByRole("dialog", { name: "Gerar conta a pagar" })).toBeVisible();
    });

    it("deve renderizar o select de categorias com as opções", () => {
      render(<GerarContaAPagarModal {...defaultProps} />);

      const select = screen.getByTestId("categoria-select");
      expect(select).toBeVisible();
      expect(screen.getByText("Alimentação")).toBeVisible();
      expect(screen.getByText("Transporte")).toBeVisible();
    });

    it("deve renderizar os botões Cancelar e Gerar conta a pagar", () => {
      render(<GerarContaAPagarModal {...defaultProps} />);

      expect(screen.getByRole("button", { name: "Cancelar" })).toBeVisible();
      expect(screen.getByRole("button", { name: "Gerar conta a pagar" })).toBeVisible();
    });

    it("não deve renderizar quando open é false", () => {
      render(<GerarContaAPagarModal {...defaultProps} open={false} />);

      expect(
        screen.queryByRole("dialog", { name: "Gerar conta a pagar" }),
      ).not.toBeInTheDocument();
    });
  });

  describe("interação", () => {
    it("deve fechar o modal ao clicar em Cancelar", async () => {
      const user = userEvent.setup();
      const onOpenChange = jest.fn();
      render(<GerarContaAPagarModal {...defaultProps} onOpenChange={onOpenChange} />);

      await user.click(screen.getByRole("button", { name: "Cancelar" }));

      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it("deve chamar gerarContaAPagar ao submeter o formulário", async () => {
      cobrancasService.gerarContaAPagar.mockResolvedValueOnce(undefined);
      const user = userEvent.setup();
      const onOpenChange = jest.fn();

      render(<GerarContaAPagarModal {...defaultProps} onOpenChange={onOpenChange} />);

      // Seleciona uma categoria
      await user.selectOptions(screen.getByTestId("categoria-select"), "cat-1");
      // Submete o formulário
      await user.click(screen.getByRole("button", { name: "Gerar conta a pagar" }));

      await waitFor(() => {
        expect(cobrancasService.gerarContaAPagar).toHaveBeenCalledWith("cob-rec-1", {
          idCategoria: "cat-1",
          isParcelado: false,
          quantidadeParcelas: undefined,
        });
      });
    });

    it("deve exibir toast de sucesso e fechar ao completar a mutação", async () => {
      cobrancasService.gerarContaAPagar.mockResolvedValueOnce(undefined);
      const user = userEvent.setup();
      const onOpenChange = jest.fn();

      render(<GerarContaAPagarModal {...defaultProps} onOpenChange={onOpenChange} />);

      await user.selectOptions(screen.getByTestId("categoria-select"), "cat-2");
      await user.click(screen.getByRole("button", { name: "Gerar conta a pagar" }));

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith("Conta a pagar gerada!");
        expect(onOpenChange).toHaveBeenCalledWith(false);
      });
    });

    it("deve exibir toast de erro quando a mutação falha com ApiError", async () => {
      const apiError = new ApiError({ codigo: 400, descricao: "Erro de validação" }, 400);
      cobrancasService.gerarContaAPagar.mockRejectedValueOnce(apiError);
      const user = userEvent.setup();

      render(<GerarContaAPagarModal {...defaultProps} />);

      await user.selectOptions(screen.getByTestId("categoria-select"), "cat-1");
      await user.click(screen.getByRole("button", { name: "Gerar conta a pagar" }));

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Erro de validação");
      });
    });

    it("deve exibir mensagem de erro padrão quando a mutação falha com erro genérico", async () => {
      cobrancasService.gerarContaAPagar.mockRejectedValueOnce(new Error("Erro genérico"));
      const user = userEvent.setup();

      render(<GerarContaAPagarModal {...defaultProps} />);

      await user.selectOptions(screen.getByTestId("categoria-select"), "cat-1");
      await user.click(screen.getByRole("button", { name: "Gerar conta a pagar" }));

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(DEFAULT_ERROR_MESSAGE);
      });
    });
  });

  describe("parcelamento", () => {
    it("deve exibir o valor da cobrança", () => {
      render(<GerarContaAPagarModal {...defaultProps} />);

      expect(screen.getByText(/Valor da cobrança: R\$ 2.500,00/)).toBeVisible();
    });

    it("deve exibir switch Parcelado desmarcado por padrão", () => {
      render(<GerarContaAPagarModal {...defaultProps} />);

      const switchEl = screen.getByTestId("switch-parcelado");
      expect(switchEl).not.toBeChecked();
    });

    it("não deve exibir campo de parcelas quando switch está desmarcado", () => {
      render(<GerarContaAPagarModal {...defaultProps} />);

      expect(screen.queryByTestId("input-parcelas")).not.toBeInTheDocument();
    });

    it("deve exibir campo de parcelas quando switch é ativado", async () => {
      const user = userEvent.setup();

      render(<GerarContaAPagarModal {...defaultProps} />);

      await user.click(screen.getByTestId("switch-parcelado"));

      expect(screen.getByTestId("input-parcelas")).toBeVisible();
    });

    it("deve exibir valor da parcela calculado", async () => {
      const user = userEvent.setup();

      render(<GerarContaAPagarModal {...defaultProps} />);

      // Ativa o switch
      await user.click(screen.getByTestId("switch-parcelado"));

      // Digita 5 no campo de parcelas
      const input = screen.getByTestId("input-parcelas");
      await user.clear(input);
      await user.type(input, "5");

      // O valor exibido é calculado pelo componente (2500 / 5 = 500)
      expect(screen.getByText(/Valor de cada parcela: R\$ 500,00/)).toBeVisible();
    });

    it("deve enviar isParcelado e quantidadeParcelas ao submeter com parcelamento", async () => {
      cobrancasService.gerarContaAPagar.mockResolvedValueOnce(undefined);
      const user = userEvent.setup();
      const onOpenChange = jest.fn();

      render(<GerarContaAPagarModal {...defaultProps} onOpenChange={onOpenChange} />);

      await user.selectOptions(screen.getByTestId("categoria-select"), "cat-1");
      await user.click(screen.getByTestId("switch-parcelado"));

      const input = screen.getByTestId("input-parcelas");
      await user.clear(input);
      await user.type(input, "3");

      await user.click(screen.getByRole("button", { name: "Gerar conta a pagar" }));

      await waitFor(() => {
        expect(cobrancasService.gerarContaAPagar).toHaveBeenCalledWith(
          "cob-rec-1",
          {
            idCategoria: "cat-1",
            isParcelado: true,
            quantidadeParcelas: 3,
          },
        );
      });
    });

    it("deve esconder campo de parcelas ao desativar o switch", async () => {
      const user = userEvent.setup();

      render(<GerarContaAPagarModal {...defaultProps} />);

      // Ativa
      await user.click(screen.getByTestId("switch-parcelado"));
      expect(screen.getByTestId("input-parcelas")).toBeVisible();

      // Desativa
      await user.click(screen.getByTestId("switch-parcelado"));
      expect(screen.queryByTestId("input-parcelas")).not.toBeInTheDocument();
    });
  });
});
