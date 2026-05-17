import { render, screen } from "@/helpers/test/test-helper";
import userEvent from "@testing-library/user-event";
import { CardIconPicker } from "../card-icon-picker";

jest.mock("../bank-icon", () => ({
  BankIcon: ({ name }: { name: string }) => <img alt={name} />,
}));

jest.mock("@/helpers/bank-icons", () => ({
  BANK_ICONS: [
    { key: "nubank", name: "Nubank" },
    { key: "inter", name: "Inter" },
  ],
}));

describe("CardIconPicker", () => {
  it("renderiza a opção 'Sem ícone'", () => {
    render(<CardIconPicker value="" onChange={jest.fn()} />);
    expect(screen.getByTitle("Sem ícone")).toBeInTheDocument();
  });

  it("renderiza todas as opções de cartão", () => {
    render(<CardIconPicker value="" onChange={jest.fn()} />);
    expect(screen.getByTitle("Nubank")).toBeInTheDocument();
    expect(screen.getByTitle("Inter")).toBeInTheDocument();
  });

  it("renderiza o label quando fornecido", () => {
    render(<CardIconPicker value="" onChange={jest.fn()} label="Escolha o cartão" />);
    expect(screen.getByText("Escolha o cartão")).toBeInTheDocument();
  });

  it("chama onChange com string vazia ao clicar em 'Sem ícone'", async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(<CardIconPicker value="nubank" onChange={onChange} />);
    await user.click(screen.getByTitle("Sem ícone"));
    expect(onChange).toHaveBeenCalledWith("");
  });

  it("chama onChange com a key ao selecionar opção", async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(<CardIconPicker value="" onChange={onChange} />);
    await user.click(screen.getByTitle("Inter"));
    expect(onChange).toHaveBeenCalledWith("inter");
  });

  it("marca o item selecionado com borda primária", () => {
    render(<CardIconPicker value="inter" onChange={jest.fn()} />);
    expect(screen.getByTitle("Inter").className).toContain("border-primary");
  });

  it("marca 'Sem ícone' como selecionado quando value é vazio", () => {
    render(<CardIconPicker value="" onChange={jest.fn()} />);
    expect(screen.getByTitle("Sem ícone").className).toContain("border-primary");
  });
});
