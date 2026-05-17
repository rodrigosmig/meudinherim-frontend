import { render, screen } from "@/helpers/test/test-helper";
import userEvent from "@testing-library/user-event";
import { BankIconPicker } from "../bank-icon-picker";

jest.mock("../bank-icon", () => ({
  BankIcon: ({ name }: { name: string }) => <img alt={name} />,
}));

jest.mock("@/helpers/bank-icons", () => ({
  BANK_ICONS: [
    { key: "nubank", name: "Nubank" },
    { key: "inter", name: "Inter" },
  ],
}));

describe("BankIconPicker", () => {
  it("renderiza a opção 'Sem ícone'", () => {
    render(<BankIconPicker value="" onChange={jest.fn()} />);
    expect(screen.getByTitle("Sem ícone")).toBeInTheDocument();
  });

  it("renderiza todas as opções de banco", () => {
    render(<BankIconPicker value="" onChange={jest.fn()} />);
    expect(screen.getByTitle("Nubank")).toBeInTheDocument();
    expect(screen.getByTitle("Inter")).toBeInTheDocument();
  });

  it("renderiza o label quando fornecido", () => {
    render(<BankIconPicker value="" onChange={jest.fn()} label="Escolha o banco" />);
    expect(screen.getByText("Escolha o banco")).toBeInTheDocument();
  });

  it("chama onChange com string vazia ao clicar em 'Sem ícone'", async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(<BankIconPicker value="nubank" onChange={onChange} />);
    await user.click(screen.getByTitle("Sem ícone"));
    expect(onChange).toHaveBeenCalledWith("");
  });

  it("chama onChange com a key do banco ao selecionar", async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(<BankIconPicker value="" onChange={onChange} />);
    await user.click(screen.getByTitle("Nubank"));
    expect(onChange).toHaveBeenCalledWith("nubank");
  });

  it("marca o item selecionado com borda primária", () => {
    render(<BankIconPicker value="nubank" onChange={jest.fn()} />);
    const btn = screen.getByTitle("Nubank");
    expect(btn.className).toContain("border-primary");
  });

  it("marca 'Sem ícone' como selecionado quando value é vazio", () => {
    render(<BankIconPicker value="" onChange={jest.fn()} />);
    const btn = screen.getByTitle("Sem ícone");
    expect(btn.className).toContain("border-primary");
  });
});
