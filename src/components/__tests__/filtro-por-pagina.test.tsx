import { render, screen } from "@/helpers/test/test-helper";
import userEvent from "@testing-library/user-event";

import FiltroPorPagina from "../filtro-por-pagina";

jest.mock("@/components/primitives/select", () => ({
  __esModule: true,
  Select: ({ value, onChange, options, ...props }: any) => (
    <select
      data-testid="select"
      value={value}
      onChange={e => onChange?.(e.target.value)}
      {...props}
    >
      {options?.map((option: any) => (
        <option key={option.value} value={option.value}>{option.label}</option>
      ))}
    </select>
  ),
}));
jest.mock("@/components/primitives/text", () => ({
  __esModule: true,
  default: ({ children, ...props }: any) => <span {...props}>{children}</span>,
}));

describe("FiltroPorPagina", () => {
  it("renderiza o valor selecionado corretamente", () => {
    render(<FiltroPorPagina value={25} onChange={jest.fn()} />);
    expect(screen.getByTestId("select")).toHaveValue("25");
  });

  it("chama onChange ao selecionar outro valor", async () => {
    const onChange = jest.fn();
    render(<FiltroPorPagina value={10} onChange={onChange} />);
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("select"), "50");
    expect(onChange).toHaveBeenCalledWith(50);
  });

  it("renderiza todos os itens de página", () => {
    render(<FiltroPorPagina value={10} onChange={jest.fn()} />);
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("25")).toBeInTheDocument();
    expect(screen.getByText("50")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
  });

  it("renderiza o texto de resultados por página", () => {
    render(<FiltroPorPagina value={10} onChange={jest.fn()} />);
    expect(screen.getByText("Resultados por página")).toBeInTheDocument();
  });
});
