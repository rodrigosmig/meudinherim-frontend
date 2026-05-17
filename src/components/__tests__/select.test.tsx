import { render, screen, fireEvent } from "@/helpers/test/test-helper";
import { Select } from "../primitives/select";

const OPTIONS = [
  { value: "alimentacao", label: "Alimentação" },
  { value: "transporte", label: "Transporte" },
];

jest.mock("react-select", () => ({
  __esModule: true,
  default: ({ onChange, value, options, placeholder, isMulti }: any) => (
    <select
      data-testid="react-select"
      multiple={isMulti}
      value={isMulti ? (value?.map((v: any) => v.value) ?? []) : (value?.value ?? "")}
      onChange={(e) => {
        if (isMulti) {
          const selected = Array.from(e.target.selectedOptions).map((o: any) => ({
            value: o.value,
            label: o.value,
          }));
          onChange?.(selected);
        } else {
          onChange?.({ value: e.target.value, label: e.target.value });
        }
      }}
    >
      <option value="">{placeholder}</option>
      {options?.map((opt: any) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  ),
}));

jest.mock("react-select/creatable", () => ({
  __esModule: true,
  default: ({ onChange, value, options, onCreateOption, formatCreateLabel, isMulti, placeholder }: any) => (
    <div>
      <select
        data-testid="creatable-select"
        multiple={isMulti}
        value={isMulti ? (value?.map((v: any) => v.value) ?? []) : (value?.value ?? "")}
        onChange={(e) => {
          if (isMulti) {
            const selected = Array.from(e.target.selectedOptions).map((o: any) => ({
              value: o.value,
              label: o.value,
            }));
            onChange?.(selected);
          } else {
            onChange?.({ value: e.target.value, label: e.target.value });
          }
        }}
      >
        <option value="">{placeholder}</option>
        {options?.map((opt: any) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <button
        data-testid="create-option-btn"
        onClick={() => onCreateOption?.("nova-tag")}
      >
        {formatCreateLabel?.("nova-tag")}
      </button>
    </div>
  ),
}));

describe("Select", () => {
  describe("modo padrão (isCreatable=false)", () => {
    it("renderiza ReactSelect por padrão", () => {
      render(<Select options={OPTIONS} />);
      expect(screen.getByTestId("react-select")).toBeInTheDocument();
      expect(screen.queryByTestId("creatable-select")).not.toBeInTheDocument();
    });

    it("chama onChange ao selecionar uma opção", () => {
      const onChange = jest.fn();
      render(<Select options={OPTIONS} onChange={onChange} />);
      fireEvent.change(screen.getByTestId("react-select"), {
        target: { value: "alimentacao" },
      });
      expect(onChange).toHaveBeenCalledWith("alimentacao");
    });

    it("exibe o placeholder quando não há valor selecionado", () => {
      render(<Select options={OPTIONS} placeholder="Escolha..." />);
      expect(screen.getByText("Escolha...")).toBeInTheDocument();
    });
  });

  describe("modo isCreatable=true", () => {
    it("renderiza CreatableSelect quando isCreatable=true", () => {
      render(<Select options={OPTIONS} isCreatable />);
      expect(screen.getByTestId("creatable-select")).toBeInTheDocument();
      expect(screen.queryByTestId("react-select")).not.toBeInTheDocument();
    });

    it("exibe o label de criação formatado em português", () => {
      render(<Select options={OPTIONS} isCreatable />);
      expect(screen.getByTestId("create-option-btn")).toHaveTextContent('Criar "nova-tag"');
    });

    it("chama onChange com o novo valor ao criar uma opção (single)", () => {
      const onChange = jest.fn();
      render(<Select options={OPTIONS} isCreatable onChange={onChange} />);
      fireEvent.click(screen.getByTestId("create-option-btn"));
      expect(onChange).toHaveBeenCalledWith("nova-tag");
    });

    it("adiciona nova tag preservando as selecionadas (isMulti)", () => {
      const onChange = jest.fn();
      render(
        <Select
          options={OPTIONS}
          isCreatable
          isMulti
          value={["alimentacao"]}
          onChange={onChange}
        />,
      );
      fireEvent.click(screen.getByTestId("create-option-btn"));
      expect(onChange).toHaveBeenCalledWith(["alimentacao", "nova-tag"]);
    });

    it("cria nova tag com lista inicial vazia (isMulti)", () => {
      const onChange = jest.fn();
      render(
        <Select options={OPTIONS} isCreatable isMulti value={[]} onChange={onChange} />,
      );
      fireEvent.click(screen.getByTestId("create-option-btn"));
      expect(onChange).toHaveBeenCalledWith(["nova-tag"]);
    });

    it("acumula tags criadas quando o pai atualiza value entre criações", () => {
      const onChange = jest.fn();
      const { rerender } = render(
        <Select options={OPTIONS} isCreatable isMulti value={[]} onChange={onChange} />,
      );

      fireEvent.click(screen.getByTestId("create-option-btn"));
      expect(onChange).toHaveBeenCalledWith(["nova-tag"]);

      onChange.mockClear();
      rerender(
        <Select options={OPTIONS} isCreatable isMulti value={["nova-tag"]} onChange={onChange} />,
      );

      fireEvent.click(screen.getByTestId("create-option-btn"));
      expect(onChange).toHaveBeenCalledWith(["nova-tag", "nova-tag"]);
    });

    it("chama onChange ao selecionar opção existente no CreatableSelect", () => {
      const onChange = jest.fn();
      render(<Select options={OPTIONS} isCreatable isMulti value={[]} onChange={onChange} />);
      fireEvent.change(screen.getByTestId("creatable-select"), {
        target: { value: "transporte" },
      });
      expect(onChange).toHaveBeenCalled();
    });
  });
});
