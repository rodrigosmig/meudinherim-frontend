import { render, screen } from "@/helpers/test/test-helper";
import userEvent from "@testing-library/user-event";

import Pagination from "../pagination";

jest.mock("@/components/primitives/button", () => ({
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}));
jest.mock("@/components/primitives/text", () => ({
  __esModule: true,
  default: ({ children, ...props }: any) => <span {...props}>{children}</span>,
}));
jest.mock("@/components/primitives/icon", () => ({
  __esModule: true,
  default: () => <span data-testid="icon" />,
}));

describe("Pagination", () => {
  const basePaginacao = {
    paginaAtual: 2,
    ultimaPagina: 5,
    tamanhoPagina: 10,
    totalElementos: 50,
    doElemento: 11,
    paraElemento: 20,
  };

  it("renderiza os elementos de paginação e navegação", () => {
    const onPageChange = jest.fn();
    render(<Pagination paginacao={basePaginacao} onPageChange={onPageChange} />);
    expect(screen.getByText("11")).toBeInTheDocument();
    expect(screen.getByText("20")).toBeInTheDocument();
    expect(screen.getByText("50")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Anterior" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Próxima" })).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument(); // página atual
  });

  it("desabilita botão Anterior na primeira página", () => {
    const onPageChange = jest.fn();
    render(<Pagination paginacao={{ ...basePaginacao, paginaAtual: 1 }} onPageChange={onPageChange} />);
    expect(screen.getByRole("button", { name: "Anterior" })).toBeDisabled();
  });

  it("desabilita botão Próxima na última página", () => {
    const onPageChange = jest.fn();
    render(<Pagination paginacao={{ ...basePaginacao, paginaAtual: 5 }} onPageChange={onPageChange} />);
    expect(screen.getByRole("button", { name: "Próxima" })).toBeDisabled();
  });

  it("chama onPageChange ao clicar em Próxima e Anterior", async () => {
    const onPageChange = jest.fn();
    render(<Pagination paginacao={basePaginacao} onPageChange={onPageChange} />);
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Próxima" }));
    expect(onPageChange).toHaveBeenCalledWith(3);
    await user.click(screen.getByRole("button", { name: "Anterior" }));
    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it("chama onPageChange ao clicar em número de página", async () => {
    const onPageChange = jest.fn();
    render(<Pagination paginacao={basePaginacao} onPageChange={onPageChange} />);
    const user = userEvent.setup();
    await user.click(screen.getByText("1"));
    expect(onPageChange).toHaveBeenCalledWith(1);
    await user.click(screen.getByText("5"));
    expect(onPageChange).toHaveBeenCalledWith(5);
  });

  it("mostra ... quando necessário", () => {
    const onPageChange = jest.fn();
    render(<Pagination paginacao={{ ...basePaginacao, paginaAtual: 4 }} onPageChange={onPageChange} />);
    expect(screen.getAllByText("...").length).toBeGreaterThan(0);
  });

  it("corrige paginaAtual maior que ultimaPagina", () => {
    const onPageChange = jest.fn();
    render(<Pagination paginacao={{ ...basePaginacao, paginaAtual: 10 }} onPageChange={onPageChange} />);
    expect(onPageChange).toHaveBeenCalledWith(5);
  });
});
